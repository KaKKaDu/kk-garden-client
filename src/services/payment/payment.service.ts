'use client';

import { handleError } from '@kk-garden/shared/errors';
import type { GardenPaymentResponse } from '@kk-garden/shared/schemas';
import type { PaymentRepository } from './payment.repository';
import type { CurrentPaymentResult, PaymentResult } from './payment.types';

export class PaymentService {
  public constructor(private readonly paymentRepository: PaymentRepository) {}

  public getCurrentPayment(): Promise<CurrentPaymentResult> {
    return this.paymentRepository.getCurrentPayment();
  }

  public createPayment(): Promise<PaymentResult> {
    return this.paymentRepository.createPayment();
  }

  public async confirmMockPayment(paymentId: string): Promise<PaymentResult> {
    const confirmationResult: PaymentResult =
      await this.paymentRepository.confirmMockPayment(paymentId);

    if (!confirmationResult.success) {
      return { success: false, errors: confirmationResult.errors };
    }

    if (confirmationResult.data === undefined) {
      return handleError<GardenPaymentResponse>(
        new Error('Payment confirmation returned no data.'),
      );
    }

    return this.paymentRepository.getPayment(paymentId);
  }
}
