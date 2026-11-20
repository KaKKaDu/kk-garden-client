import type { StaticTexts } from '@/types/static-texts.types';

export const sharedGardenAccessTexts = {
  errorDescription: 'We could not check access to this garden. Please try again.',
  errorTitle: 'Garden unavailable',
  loading: 'Checking garden access...',
  noAccessDescription:
    'This garden is not available to your account. Access may have been removed or the lookup code may be invalid.',
  noAccessTitle: 'You do not have access to this garden',
  retry: 'Try again',
  returnToMain: 'Return to the main site',
  visualisationLabel: 'Shared garden visualisation',
} satisfies StaticTexts;
