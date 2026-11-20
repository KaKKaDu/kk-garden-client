import { cn } from '@/utils/class-names.utils';

export const assignedGardenCertificateHeaderClassNames = {
  root: cn(
    'relative mb-6 overflow-hidden p-6 sm:p-8',
    'border-2 border-primary/30',
    'rounded-2xl bg-gradient-to-br from-primary/15 via-accent/20 to-secondary/30',
    'text-center shadow-[var(--component-shadow-large)]',
  ),
  title: cn(
    'flex items-center justify-center gap-2',
    'text-primary',
    'text-xs font-bold uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.2em]',
  ),
  certificateIcon: cn('size-6 shrink-0'),
  profileRevealButton: cn(
    'mx-auto flex w-full flex-col items-center',
    'cursor-pointer rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-ring/50',
  ),
  avatarFrame: cn(
    'mx-auto mt-5 grid place-items-center p-1',
    'rounded-full border-2 border-primary/50 bg-gradient-to-br from-primary/40 via-accent/50 to-secondary',
    'shadow-[0_0_0_4px_var(--card),0_0_0_6px_var(--primary)]',
    'transition-[width,height] duration-300 ease-out motion-reduce:transition-none',
  ),
  avatar: cn(
    'relative grid size-full place-items-center overflow-hidden rounded-full',
    'border-2 border-card bg-muted',
  ),
  avatarImage: cn('absolute inset-0 size-full object-cover'),
  avatarFallback: cn('size-10 text-primary'),
  ownershipStatement: cn('mt-5', 'text-muted-foreground', 'text-sm sm:text-base'),
  profileName: cn(
    'mt-1 break-words font-bold tracking-wide text-primary',
    'transition-[font-size] duration-300 ease-out motion-reduce:transition-none',
  ),
  profileBio: cn(
    'mx-auto max-w-xl overflow-hidden rounded-xl border-l-4 border-primary/60 bg-card/60 px-5 py-4 text-left text-muted-foreground',
    'text-sm italic leading-relaxed sm:text-base',
    'transition-[max-height,opacity,transform,margin,padding,border-width] duration-300 ease-out motion-reduce:transition-none',
  ),
  lookupCode: cn(
    'mx-auto mt-4 w-fit rounded-full border border-primary/20 bg-card/75 px-4 py-1.5',
    'text-muted-foreground text-xs',
  ),
} as const;

export const getProfileRevealFrameClassName = (isExpanded: boolean): string =>
  cn(
    assignedGardenCertificateHeaderClassNames.avatarFrame,
    isExpanded ? 'size-32 sm:size-36' : 'size-24',
  );

export const getProfileNameClassName = (isExpanded: boolean): string =>
  cn(
    assignedGardenCertificateHeaderClassNames.profileName,
    isExpanded ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl',
  );

export const getProfileBioClassName = (isExpanded: boolean): string =>
  cn(
    assignedGardenCertificateHeaderClassNames.profileBio,
    isExpanded
      ? 'mt-4 max-h-48 translate-y-0 opacity-100'
      : 'mt-0 max-h-0 border-l-0 p-0 -translate-y-2 opacity-0',
  );
