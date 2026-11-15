import { cn } from '@/utils/class-names.utils';

export const assignedGardenViewClassNames = {
  root: cn('w-full max-w-6xl'),
  status: cn('text-center', 'text-muted-foreground'),
  card: cn(
    'mx-auto w-full max-w-3xl p-4 sm:p-8',
    'border-2 border-primary/20 bg-card/90 text-card-foreground',
    'rounded-3xl shadow-[8px_8px_0_var(--component-shadow-color)]',
  ),
  certificate: cn(
    'relative mb-6 overflow-hidden p-6 sm:p-8',
    'border-2 border-primary/30',
    'rounded-2xl bg-gradient-to-br from-primary/15 via-accent/20 to-secondary/30',
    'text-center shadow-inner',
  ),
  certificateLabel: cn(
    'flex items-center justify-center gap-2',
    'text-primary',
    'text-xs font-bold uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.2em]',
  ),
  certificateIcon: cn('size-4 shrink-0 text-accent-foreground'),
  avatarFrame: cn(
    'mx-auto mt-5 grid size-24 place-items-center p-1',
    'rounded-full border-2 border-primary/50 bg-gradient-to-br from-primary/40 via-accent/50 to-secondary',
    'shadow-[0_0_0_4px_var(--card),0_0_0_6px_var(--primary)]',
  ),
  avatar: cn(
    'relative grid size-full place-items-center overflow-hidden rounded-full',
    'border-2 border-card bg-muted',
  ),
  avatarImage: cn('absolute inset-0 size-full object-cover'),
  avatarFallback: cn('size-10 text-primary'),
  ownershipStatement: cn('mt-5', 'text-muted-foreground', 'text-sm sm:text-base'),
  profileName: cn(
    'mt-1 break-words font-serif text-2xl font-bold tracking-wide text-primary sm:text-3xl',
  ),
  lookupCode: cn(
    'mx-auto mt-4 w-fit rounded-full border border-primary/20 bg-card/75 px-4 py-1.5',
    'text-muted-foreground text-xs',
  ),
  alert: cn(
    'flex flex-col items-center',
    'gap-3 p-4',
    'border border-destructive/40 bg-destructive/5 text-destructive',
    'rounded-xl',
  ),
  visualisationFrame: cn(
    'mx-auto flex aspect-square w-full max-w-[44rem] items-center justify-center',
    'overflow-hidden p-4 sm:p-8',
    'border-2 border-primary/30 bg-primary/5',
    'rounded-3xl shadow-[8px_8px_0_var(--component-shadow-color)]',
  ),
} as const;
