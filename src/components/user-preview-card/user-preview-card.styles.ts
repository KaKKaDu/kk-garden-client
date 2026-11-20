import { cn } from '@/utils/class-names.utils';

export const userPreviewCardClassNames = {
  root: cn(
    'flex items-center gap-3 sm:gap-4',
    'rounded-2xl border-2 border-border bg-card/85 p-4 sm:p-5',
    'shadow-[var(--component-shadow-moderate)]',
  ),
  approvedStatus: cn('border-l-4 border-l-sharing-approved'),
  pendingStatus: cn('border-l-4 border-l-sharing-pending'),
  relationshipIndicators: cn('flex shrink-0 flex-col items-center gap-1'),
  profile: cn('flex min-w-0 flex-1 items-center gap-3 sm:gap-4'),
  avatarFrame: cn(
    'grid size-14 shrink-0 place-items-center p-1',
    'rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary/30 via-accent/40 to-secondary',
  ),
  avatar: cn(
    'relative grid size-full place-items-center overflow-hidden rounded-full',
    'border-2 border-background bg-muted',
  ),
  avatarImage: cn('absolute inset-0 size-full object-cover'),
  avatarFallback: cn('size-7 text-primary'),
  details: cn('min-w-0 flex-1 space-y-1'),
  name: cn('break-words font-semibold text-foreground'),
  statusLabel: cn('inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium leading-none'),
  approvedLabel: cn(
    'border border-sharing-approved/30 bg-sharing-approved/10 text-sharing-approved',
  ),
  pendingLabel: cn('border border-sharing-pending/30 bg-sharing-pending/10 text-sharing-pending'),
  action: cn('flex shrink-0'),
} as const;
