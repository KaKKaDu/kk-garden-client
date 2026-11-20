import { cn } from '@/utils/class-names.utils';

export const ownershipAccountBlockClassNames = {
  section: cn(
    'w-full',
    'max-w-xl p-8 sm:p-10',
    'border-2 border-primary/20 bg-card text-card-foreground',
    'rounded-3xl text-center shadow-[var(--component-shadow-large)]',
  ),
  title: cn('text-2xl font-semibold'),
  description: cn('mt-3', 'text-muted-foreground'),
  action: cn('mt-6'),
  paymentStatus: cn(
    'mt-6 flex items-center justify-center gap-2',
    'text-muted-foreground',
    'text-sm',
  ),
} as const;
