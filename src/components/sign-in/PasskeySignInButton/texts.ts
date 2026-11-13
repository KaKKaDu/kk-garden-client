import type { StaticTexts } from '@/types/static-texts.types';

export const passkeySignInTexts = {
  label: 'Continue with a passkey',
  pending: 'Waiting for passkey...',
  error: 'Passkey sign-in failed. Please try again.',
} as const satisfies StaticTexts;
