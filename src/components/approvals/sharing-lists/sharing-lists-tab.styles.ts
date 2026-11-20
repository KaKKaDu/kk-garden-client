import { cn } from '@/utils/class-names.utils';

export const sharingListsClassNames = {
  root: cn('w-full space-y-5'),
  header: cn('flex items-center justify-end gap-3'),
  reloadButton: cn('shrink-0'),
  iconButton: cn(
    'size-10 rounded-full',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  ),
  section: cn('space-y-3'),
  sectionTitle: cn('flex items-center gap-2 text-sm font-semibold text-foreground'),
  pendingCount: cn(
    'rounded-full border border-sharing-pending/30 bg-sharing-pending/10 px-2 py-0.5',
    'text-xs font-medium text-sharing-pending',
  ),
  approvedCount: cn(
    'rounded-full border border-sharing-approved/30 bg-sharing-approved/10 px-2 py-0.5',
    'text-xs font-medium text-sharing-approved',
  ),
  list: cn('grid w-full gap-3'),
  actions: cn('flex flex-wrap justify-end gap-2'),
  empty: cn('rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground'),
  loading: cn('flex items-center gap-2 text-sm text-muted-foreground'),
  error: cn('text-sm text-destructive'),
} as const;
