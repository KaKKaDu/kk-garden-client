'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { usePayment } from '@/features/payment/hooks/use-payment';
import { paymentRoutePaths } from '@/features/payment/constants/payment-route.constants';
import { ownershipRoutePaths } from '@/features/ownership/constants/ownership-route.constants';
import { ownershipAccountBlockClassNames as classNames } from '../ownership-account-block.styles';
import { notAssignedAccountBlockTexts as texts } from './texts';

export const NotAssignedAccountBlock = (): ReactNode => {
  const { currentPayment, isLoading } = usePayment();
  const hasPaidPayment: boolean = useMemo(
    (): boolean => currentPayment?.payment?.state === 'paid',
    [currentPayment?.payment?.state],
  );
  const actionHref: string = useMemo(
    (): string => (hasPaidPayment ? ownershipRoutePaths.assign : paymentRoutePaths.payment),
    [hasPaidPayment],
  );
  const actionText: string = useMemo(
    (): string => (hasPaidPayment ? texts.assign : texts.payment),
    [hasPaidPayment],
  );
  const description: string = useMemo(
    (): string => (hasPaidPayment ? texts.paidDescription : texts.description),
    [hasPaidPayment],
  );

  return (
    <section className={classNames.section}>
      <h1 className={classNames.title}>{texts.title}</h1>
      <p className={classNames.description}>{description}</p>
      {isLoading ? (
        <p aria-live="polite" className={classNames.paymentStatus} role="status">
          <Spinner aria-hidden="true" />
          {texts.checkingPayment}
        </p>
      ) : (
        <Button
          className={classNames.action}
          nativeButton={false}
          render={<Link href={actionHref} />}
          size="lg"
        >
          {actionText}
          <ArrowRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      )}
    </section>
  );
};
