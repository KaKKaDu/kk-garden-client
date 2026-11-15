import type { StaticTexts } from '@/types/static-texts.types';

export const assignmentFlowTexts = {
  eyebrow: 'Garden ownership',
  title: 'Choose your garden',
  description:
    'Browse the generated gardens, select the one you want, and confirm to assign it to your account. You can request three more options at any time.',
  carouselLabel: 'Generated garden options',
  loading: 'Generating your first three gardens...',
  loadingMore: 'Generating three more gardens...',
  loadMore: 'Show three more',
  loadMoreTooltip: 'Generate three more garden options',
  navigationLabel: 'Garden slide navigation',
  previous: 'Previous',
  next: 'Next',
  select: 'Select this garden',
  selectTooltip: 'Choose this garden as your preferred option',
  selected: 'Selected',
  selectedTooltip: 'This garden is selected',
  selectionReady: 'Your selection is ready to confirm.',
  selectionPrompt: 'Select a garden before confirming assignment.',
  confirmAssignment: 'Confirm and assign',
  assigning: 'Assigning garden...',
  retry: 'Try again',
  empty: 'No visualisations are available right now.',
  slideLabel: (current: string, total: string): string => `Garden ${current} of ${total}`,
  visualisationLabel: (current: string): string => `Garden option ${current}`,
} satisfies StaticTexts;
