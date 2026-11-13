import type { StaticTexts } from '@/types/static-texts.types';

export const socialSignInTexts = {
  google: 'Google',
  github: 'GitHub',
  continueWith: (provider: string): string => `Continue with ${provider}`,
  connecting: (provider: string): string => `Connecting to ${provider}...`,
  error: (provider: string): string => `Could not continue with ${provider}. Please try again.`,
} as const satisfies StaticTexts;
