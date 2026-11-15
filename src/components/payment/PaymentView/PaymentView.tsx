'use client';

import type { ReactNode } from 'react';
import type { FormEvent } from 'react';
import { useCallback, useMemo } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/features/payment/hooks/use-payment';
import { paymentViewClassNames as classNames } from './payment-view.styles';
import { paymentViewTexts as texts } from './texts';

export const PaymentView = (): ReactNode => {
  const {
    currentPayment,
    error,
    isConfirming,
    isLoading,
    isStarting,
    confirmPayment,
    refreshPayment,
    startPayment,
  } = usePayment();
  const payment = useMemo(() => currentPayment?.payment ?? null, [currentPayment?.payment]);
  const isPaid: boolean = useMemo((): boolean => payment?.state === 'paid', [payment?.state]);
  const isPending: boolean = useMemo((): boolean => payment?.state === 'pending', [payment?.state]);
  const pendingPayment = useMemo(() => (isPending ? payment : null), [isPending, payment]);
  const paidPayment = useMemo(() => (isPaid ? payment : null), [isPaid, payment]);
  const canStartPayment: boolean = useMemo(
    (): boolean =>
      currentPayment !== null && payment === null && currentPayment.mockConfirmationEnabled,
    [currentPayment, payment],
  );
  const canConfirmPayment: boolean = useMemo(
    (): boolean =>
      pendingPayment !== null &&
      !pendingPayment.isGift &&
      currentPayment?.mockConfirmationEnabled === true,
    [currentPayment?.mockConfirmationEnabled, pendingPayment],
  );
  const isPendingGift: boolean = useMemo(
    (): boolean => pendingPayment?.isGift === true,
    [pendingPayment?.isGift],
  );
  const isPaidGift: boolean = useMemo(
    (): boolean => paidPayment?.isGift === true,
    [paidPayment?.isGift],
  );
  const hasError: boolean = useMemo((): boolean => error !== null, [error]);
  const showEmptyPayment: boolean = useMemo(
    (): boolean => !isLoading && currentPayment !== null && payment === null,
    [currentPayment, isLoading, payment],
  );
  const showPendingPayment: boolean = useMemo(
    (): boolean => !isLoading && pendingPayment !== null,
    [isLoading, pendingPayment],
  );
  const showPaidPayment: boolean = useMemo(
    (): boolean => !isLoading && paidPayment !== null,
    [isLoading, paidPayment],
  );
  const handleStartPayment = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      void startPayment();
    },
    [startPayment],
  );
  const handleRefreshPayment = useCallback((): void => {
    void refreshPayment();
  }, [refreshPayment]);
  const handleConfirmPayment = useCallback((): void => {
    void confirmPayment();
  }, [confirmPayment]);

  return (
    <main className={classNames.main}>
      <section className={classNames.section}>
        <p className={classNames.eyebrow}>Garden access</p>
        <h1 className={classNames.title}>{texts.title}</h1>
        <p className={classNames.description}>{texts.description}</p>

        {hasError && (
          <div className={classNames.alert} role="alert">
            <p className={classNames.error}>{error}</p>
            <Button
              disabled={isLoading || isStarting || isConfirming}
              onClick={handleRefreshPayment}
              type="button"
              variant="outline"
            >
              {texts.retry}
            </Button>
          </div>
        )}

        {isLoading && (
          <p aria-live="polite" className={classNames.loading} role="status">
            {texts.loading}
          </p>
        )}

        {showEmptyPayment && (
          <div className={classNames.emptyBlock}>
            <h2 className={classNames.emptyTitle}>{texts.noPaymentTitle}</h2>
            {canStartPayment ? (
              <>
                <p className={classNames.emptyDescription}>{texts.noPaymentDescription}</p>
                <form className={classNames.paymentForm} onSubmit={handleStartPayment}>
                  <Button disabled={isStarting} size="lg" type="submit">
                    {isStarting ? texts.startingPayment : texts.startPayment}
                  </Button>
                </form>
              </>
            ) : (
              <p aria-live="polite" className={classNames.unavailable} role="status">
                {texts.unavailable}
              </p>
            )}
          </div>
        )}

        {showPendingPayment && pendingPayment !== null ? (
          <div aria-live="polite" className={classNames.pendingBlock} role="status">
            <p className={classNames.statusLabel}>
              {isPendingGift ? texts.giftPending : texts.pending}
            </p>
            {canConfirmPayment && (
              <Button
                className={classNames.confirmButton}
                disabled={isConfirming}
                onClick={handleConfirmPayment}
                size="lg"
                type="button"
              >
                {isConfirming ? texts.confirmingPayment : texts.confirmPayment}
              </Button>
            )}
          </div>
        ) : null}

        {showPaidPayment && paidPayment !== null ? (
          isPaidGift ? (
            <div aria-live="polite" className={classNames.giftBlock} role="status">
              <div className={classNames.giftContent}>
                <span className={classNames.giftIconFrame}>
                  <Gift aria-hidden="true" className={classNames.giftIcon} />
                </span>
                <div>
                  <p className={classNames.giftBadge}>{texts.giftBadge}</p>
                  <h2 className={classNames.giftTitle}>{texts.giftTitle}</h2>
                  <p className={classNames.giftDescription}>{texts.giftDescription}</p>
                </div>
              </div>
            </div>
          ) : (
            <div aria-live="polite" className={classNames.ownerPaidBlock} role="status">
              <p className={classNames.statusLabel}>{texts.ownerPaid}</p>
            </div>
          )
        ) : null}
      </section>
    </main>
  );
};
