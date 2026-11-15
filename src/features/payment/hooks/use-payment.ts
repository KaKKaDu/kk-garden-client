'use client';

import { handleError } from '@kk-garden/shared/errors';
import type {
  CurrentGardenPaymentResponse,
  GardenPaymentResponse,
} from '@kk-garden/shared/schemas';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLoggerService } from '@/services/logger/logger.container';
import { getPaymentService } from '@/services/payment/payment.container';
import type { CurrentPaymentResult, PaymentResult } from '@/services/payment/payment.types';
import { paymentErrorMessages } from '../constants/payment.constants';
import { getPaymentErrorMessage, getPaymentResultData } from '../utils/payment-result.utils';

export type UsePaymentResult = {
  currentPayment: CurrentGardenPaymentResponse | null;
  error: string | null;
  isConfirming: boolean;
  isLoading: boolean;
  isStarting: boolean;
  confirmPayment: () => Promise<void>;
  refreshPayment: () => Promise<void>;
  startPayment: () => Promise<void>;
};

export const usePayment = (): UsePaymentResult => {
  const [currentPayment, setCurrentPayment] = useState<CurrentGardenPaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const fetchCurrentPayment = useCallback(async (): Promise<CurrentGardenPaymentResponse> => {
    const result: CurrentPaymentResult = await getPaymentService().getCurrentPayment();
    return getPaymentResultData(result, paymentErrorMessages.load);
  }, []);

  const refreshPayment = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data: CurrentGardenPaymentResponse = await fetchCurrentPayment();

      if (isMounted.current) {
        setCurrentPayment(data);
      }
    } catch (refreshError: unknown) {
      getLoggerService().report('payment.load', handleError(refreshError));
      if (isMounted.current) {
        setError(getPaymentErrorMessage(refreshError, paymentErrorMessages.load));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetchCurrentPayment]);

  useEffect(() => {
    isMounted.current = true;
    let active: boolean = true;

    const loadInitialPayment = async (): Promise<void> => {
      try {
        const data: CurrentGardenPaymentResponse = await fetchCurrentPayment();
        if (active && isMounted.current) {
          setCurrentPayment(data);
        }
      } catch (loadError: unknown) {
        getLoggerService().report('payment.load', handleError(loadError));
        if (active && isMounted.current) {
          setError(getPaymentErrorMessage(loadError, paymentErrorMessages.load));
        }
      } finally {
        if (active && isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialPayment();

    return (): void => {
      active = false;
      isMounted.current = false;
    };
  }, [fetchCurrentPayment]);

  const startPayment = useCallback(async (): Promise<void> => {
    setIsStarting(true);
    setError(null);

    try {
      const result: PaymentResult = await getPaymentService().createPayment();
      const data: GardenPaymentResponse = getPaymentResultData(result, paymentErrorMessages.start);

      if (isMounted.current) {
        setCurrentPayment({
          payment: data.payment,
          mockConfirmationEnabled: data.mockConfirmationEnabled,
        });
      }
    } catch (startError: unknown) {
      getLoggerService().report('payment.create', handleError(startError));
      if (isMounted.current) {
        setError(getPaymentErrorMessage(startError, paymentErrorMessages.start));
      }
    } finally {
      if (isMounted.current) {
        setIsStarting(false);
      }
    }
  }, []);

  const confirmPayment = useCallback(async (): Promise<void> => {
    const payment = currentPayment?.payment;
    if (
      !payment ||
      payment.state !== 'pending' ||
      payment.isGift ||
      currentPayment?.mockConfirmationEnabled !== true
    ) {
      await refreshPayment();
      if (isMounted.current) {
        setError(paymentErrorMessages.confirmUnavailable);
      }
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      const result: PaymentResult = await getPaymentService().confirmMockPayment(payment.paymentId);
      const data: GardenPaymentResponse = getPaymentResultData(
        result,
        paymentErrorMessages.confirm,
      );

      if (isMounted.current) {
        setCurrentPayment({
          payment: data.payment,
          mockConfirmationEnabled: data.mockConfirmationEnabled,
        });
      }
    } catch (confirmationError: unknown) {
      getLoggerService().report('payment.confirmMock', handleError(confirmationError));
      if (isMounted.current) {
        setError(getPaymentErrorMessage(confirmationError, paymentErrorMessages.confirm));
      }
    } finally {
      if (isMounted.current) {
        setIsConfirming(false);
      }
    }
  }, [currentPayment, refreshPayment]);

  return useMemo<UsePaymentResult>(
    () => ({
      currentPayment,
      error,
      isConfirming,
      isLoading,
      isStarting,
      confirmPayment,
      refreshPayment,
      startPayment,
    }),
    [
      currentPayment,
      error,
      isConfirming,
      isLoading,
      isStarting,
      confirmPayment,
      refreshPayment,
      startPayment,
    ],
  );
};
