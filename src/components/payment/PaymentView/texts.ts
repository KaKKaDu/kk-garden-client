import type { StaticTexts } from '@/types/static-texts.types';

export const paymentViewTexts = {
  title: 'Payment',
  description: 'A one-time payment is required before garden ownership can be assigned.',
  loading: 'Checking payment status...',
  retry: 'Try again',
  noPaymentTitle: 'No payment is assigned to this account.',
  noPaymentDescription:
    'Start a development-only mock payment. No real payment provider or card details are used.',
  startPayment: 'Start mock payment',
  startingPayment: 'Starting payment...',
  unavailable: 'Payment is not available right now. Please try again later.',
  pending: 'Your payment is pending confirmation.',
  giftPending: 'A gift payment is pending. The payer must complete it.',
  confirmPayment: 'Confirm mock payment',
  confirmingPayment: 'Confirming payment...',
  giftBadge: 'Gift payment',
  giftTitle: 'Your garden payment is taken care of.',
  giftDescription: 'This account has a paid gift entitlement. No payment is needed.',
  ownerPaid: 'Payment has already been completed for this account.',
} satisfies StaticTexts;
