import { cn } from '@/utils/class-names.utils';

export const searchResultsClassNames = {
  root: cn('w-full', 'space-y-4'),
  list: cn('grid w-full gap-3'),
  status: cn('flex items-center gap-2', 'text-sm text-muted-foreground'),
  error: cn('text-sm text-destructive'),
  empty: cn('rounded-xl border border-border bg-card/60 p-4', 'text-sm text-muted-foreground'),
  indicator: cn(
    'grid size-8 shrink-0 cursor-help place-items-center rounded-full border',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ),
  indicatorIcon: cn('size-4'),
  indicatorInactive: cn('border-border bg-muted/50 text-muted-foreground/50'),
  incomingIndicator: cn('border-sharing-incoming/30 bg-sharing-incoming/10 text-sharing-incoming'),
  outgoingIndicator: cn('border-sharing-outgoing/30 bg-sharing-outgoing/10 text-sharing-outgoing'),
} as const;
