import { cn } from '@/utils/class-names.utils';

export const sharedGardenAccessClassNames = {
  root: cn('relative isolate min-h-dvh bg-background text-foreground'),
  content: cn('relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 sm:px-8'),
  header: cn('flex h-20 shrink-0 items-center'),
  backButton: cn('size-11 rounded-full border-primary/25 bg-card/80'),
  main: cn('flex w-full flex-1 flex-col items-center justify-center gap-8 py-8'),
  status: cn('flex items-center justify-center gap-3 text-center text-muted-foreground'),
  infoCard: cn(
    'mx-auto flex w-full max-w-xl flex-col items-center gap-5 p-6 text-center sm:p-8',
    'rounded-3xl border-2 border-primary/20 bg-card/90 text-card-foreground',
    'shadow-[var(--component-shadow-large)]',
  ),
  errorCard: cn(
    'mx-auto flex w-full max-w-xl flex-col items-center gap-5 p-6 text-center sm:p-8',
    'rounded-3xl border-2 border-destructive/30 bg-card/90 text-card-foreground',
    'shadow-[var(--component-shadow-large)]',
  ),
  cardTitle: cn('text-xl font-semibold text-primary sm:text-2xl'),
  cardDescription: cn('max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base'),
  retryButton: cn('rounded-full'),
  certificate: cn(
    'mx-auto w-full max-w-3xl p-4 sm:p-8',
    'rounded-3xl border-2 border-primary/20 bg-card/90 text-card-foreground',
    'shadow-[var(--component-shadow-large)]',
  ),
} as const;
