import { cn } from '@/utils/class-names.utils';

export const assignmentFlowClassNames = {
  root: cn(
    'w-full',
    'max-w-3xl p-6 sm:p-8',
    'border-2 border-primary/20 bg-card text-card-foreground',
    'rounded-3xl shadow-[var(--component-shadow-large)]',
  ),
  header: cn('mx-auto max-w-2xl', 'text-center'),
  eyebrow: cn('text-primary', 'text-sm font-medium tracking-wide'),
  title: cn('mt-2', 'text-3xl font-semibold sm:text-4xl'),
  description: cn('mt-3', 'text-muted-foreground'),
  alert: cn(
    'flex flex-col items-start',
    'mt-6 gap-3 p-4',
    'border border-destructive/40 bg-destructive/5 text-destructive',
    'rounded-xl',
  ),
  status: cn('mt-8 flex items-center justify-center gap-2 text-center', 'text-muted-foreground'),
  carousel: cn('mt-8'),
  slide: cn('min-w-0'),
  visualisationFrame: cn(
    'mx-auto flex aspect-square w-full max-w-[36rem] items-center justify-center',
    'overflow-hidden p-4 sm:p-8',
    'border-2 border-primary/30 bg-primary/5',
    'rounded-3xl shadow-[var(--component-shadow-large)]',
  ),
  belowViewControls: cn('flex justify-center', 'mt-5'),
  slideControls: cn('flex items-center justify-center', 'gap-3'),
  slidePosition: cn(
    'px-5 py-2',
    'border-2 border-primary/35 bg-primary/10 text-primary',
    'rounded-full shadow-[var(--component-shadow-moderate)]',
    'text-base font-bold tracking-wide',
  ),
  slidePositionSelected: cn(
    'px-5 py-2',
    'border-2 border-primary bg-primary text-primary-foreground',
    'rounded-full shadow-[var(--component-shadow-hover)]',
    'text-base font-bold tracking-wide',
  ),
  iconActions: cn('flex items-center justify-center', 'mt-4 gap-4'),
  iconButton: cn('size-12'),
  actionIcon: cn('size-6'),
  confirmationPanel: cn(
    'mx-auto flex w-full max-w-xl flex-col items-center',
    'mt-5 gap-3 p-4',
    'border-2 border-primary/30 bg-primary/5',
    'rounded-2xl shadow-[var(--component-shadow-moderate)]',
  ),
  actionsStatus: cn('text-center text-sm text-muted-foreground'),
} as const;
