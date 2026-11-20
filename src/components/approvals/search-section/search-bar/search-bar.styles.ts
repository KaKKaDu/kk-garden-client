import { cn } from '@/utils/class-names.utils';

export const searchBarClassNames = {
  root: cn('w-full max-w-md', 'space-y-2'),
  label: cn('block text-sm font-medium text-foreground'),
  field: cn('relative'),
  icon: cn(
    'pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground',
  ),
  input: cn('pl-10 font-mono tracking-widest'),
  help: cn('text-sm text-muted-foreground'),
  error: cn('text-sm text-destructive'),
} as const;
