import { cn } from '@/utils/class-names.utils';

export const assignedGardenViewClassNames = {
  root: cn('w-full max-w-6xl'),
  status: cn('flex items-center justify-center gap-2', 'text-center text-muted-foreground'),
  card: cn(
    'mx-auto w-full max-w-3xl p-4 sm:p-8',
    'border-2 border-primary/20 bg-card/90 text-card-foreground',
    'rounded-3xl shadow-[var(--component-shadow-large)]',
  ),
  alert: cn(
    'flex flex-col items-center',
    'gap-3 p-4',
    'border border-destructive/40 bg-destructive/5 text-destructive',
    'rounded-xl',
  ),
} as const;
