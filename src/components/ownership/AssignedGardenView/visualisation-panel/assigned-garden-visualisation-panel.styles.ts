import { cn } from '@/utils/class-names.utils';

export const assignedGardenVisualisationPanelClassNames = {
  visualisationFrame: cn(
    'relative mx-auto flex aspect-square w-full max-w-[44rem] items-center justify-center',
    'overflow-hidden p-4 sm:p-8',
    'border-2 border-primary/30 bg-primary/5',
    'rounded-3xl shadow-[var(--component-shadow-large)]',
  ),
  expandVisualisationButton: cn(
    'group absolute inset-0 z-10 grid place-items-center rounded-3xl border-0',
    'cursor-zoom-in bg-transparent transition-colors duration-200 hover:bg-primary/20 focus-visible:bg-primary/20',
    'outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring/70 motion-reduce:transition-none',
  ),
  expandIcon: cn(
    'grid size-14 place-items-center rounded-full border-2 border-primary/50 bg-background/90 p-3 text-primary',
    'shadow-[var(--component-shadow-moderate)]',
    'scale-90 opacity-0 transition-[opacity,transform] duration-200',
    'group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100',
    'motion-reduce:transition-none',
  ),
  expandIconGlyph: cn('size-6'),
  expandedDialog: cn(
    'fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-foreground',
    'backdrop:bg-foreground/70 backdrop:backdrop-blur-sm',
  ),
  expandedDialogContent: cn('relative grid h-full w-full place-items-center p-4'),
  expandedCloseButton: cn('absolute top-4 right-4 z-10 size-11 rounded-full'),
  expandedVisualisationFrame: cn(
    'relative grid aspect-square w-[min(94vw,calc(100dvh-5rem))] place-items-center overflow-hidden',
    'rounded-3xl border-2 border-accent/60 bg-accent/50 p-3 sm:p-6',
    'shadow-[var(--component-shadow-large)]',
  ),
  expandedVisualisation: cn(
    'relative grid h-full w-full place-items-center overflow-hidden rounded-2xl',
  ),
  expandedLoading: cn(
    'absolute inset-3 z-10 grid place-items-center rounded-2xl bg-accent/80 backdrop-blur-sm sm:inset-6',
  ),
  expandedLoadingSpinner: cn('size-6 text-primary'),
} as const;
