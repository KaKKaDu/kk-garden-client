import { cn } from '@/utils/class-names.utils';

export const profileEditFormClassNames = {
  section: cn(
    'mx-auto w-full max-w-2xl',
    'p-6 sm:p-8',
    'border-2 border-primary/20 bg-card/90 text-card-foreground',
    'rounded-3xl shadow-[8px_8px_0_var(--component-shadow-color)]',
  ),
  loading: cn('flex items-center gap-2', 'text-muted-foreground', 'text-sm'),
  error: cn('text-destructive', 'text-sm'),
  form: cn('grid', 'gap-8', 'sm:grid-cols-[10rem_minmax(0,1fr)]'),
  avatarColumn: cn('flex flex-col items-center', 'gap-3', 'sm:items-start sm:self-center'),
  hiddenInput: cn('hidden'),
  avatarButton: cn(
    'relative',
    'border-primary/40 bg-secondary',
    'group aspect-square h-40 w-40 min-h-40 min-w-40 shrink-0 overflow-hidden rounded-full p-0',
  ),
  avatarFrame: cn(
    'block',
    'relative',
    'size-full',
    'aspect-square overflow-hidden rounded-full',
    'bg-muted',
  ),
  avatarImage: cn('block', 'absolute inset-0', 'h-full w-full object-cover'),
  avatarFallback: cn(
    'absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2',
    'text-muted-foreground',
  ),
  avatarOverlay: cn(
    'grid place-items-center',
    'absolute inset-0',
    'bg-background/75',
    'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
  ),
  avatarEditIcon: cn('size-8'),
  avatarHint: cn('text-center', 'text-muted-foreground', 'text-xs sm:text-left'),
  lookupPanel: cn(
    'w-full',
    'p-3',
    'border-2 border-primary/20 bg-card text-card-foreground',
    'rounded-xl shadow-[3px_3px_0_var(--component-shadow-color)]',
  ),
  lookupLabel: cn('mb-1', 'text-muted-foreground', 'text-xs font-medium'),
  lookupRow: cn('flex items-center justify-between', 'gap-2'),
  lookupValue: cn('min-w-0 truncate font-mono text-xs'),
  errorHint: cn('mt-1', 'text-destructive', 'text-xs'),
  fields: cn('min-w-0 space-y-5'),
  field: cn('space-y-2'),
  label: cn('text-sm font-medium'),
  help: cn('text-muted-foreground', 'text-xs'),
  submitButton: cn('w-full sm:w-auto'),
  copyButton: cn('size-8'),
} as const;

export const getProfileFeedbackClassName = (isError: boolean): string =>
  cn(isError ? 'text-destructive' : 'text-foreground', 'text-sm');

export const profileFieldErrorClassName = cn('text-destructive', 'text-sm');
