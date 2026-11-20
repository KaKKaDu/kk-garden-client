import type { StaticTexts } from '@/types/static-texts.types';

export const searchSectionTexts = {
  sectionLabel: 'Find a garden owner',
  invalidLookupCode: 'Enter a valid 16-character lookup code.',
  searchBeforeRequest: 'Search for a profile before requesting access.',
  lookupError: 'Could not search for that lookup code.',
  requestError: 'Could not send the garden access request.',
  requestingAccess: 'Sending request...',
  requestAccess: 'Request garden access',
  alreadyHasAccess: 'You already have access to this garden.',
  requestPending: 'Your garden access request is pending.',
  requestSentButton: 'Your garden access request was sent.',
} satisfies StaticTexts;
