import { cn } from '@/utils/class-names.utils';
import { headerClassNames } from '../header.styles';

export const profileDropdownClassNames = {
  profileIcon: cn('size-8'),
  profileHeader: cn('flex flex-col items-center text-center'),
  avatarFrame: cn(
    'mb-2 grid size-16 place-items-center p-1',
    'rounded-full border-2 border-primary/50 bg-gradient-to-br from-primary/40 via-accent/50 to-secondary',
    'shadow-[0_0_0_3px_var(--background),0_0_0_5px_var(--primary)]',
  ),
  avatar: cn(
    'relative grid size-full place-items-center overflow-hidden rounded-full',
    'border-2 border-background bg-muted',
  ),
  avatarImage: cn('absolute inset-0 size-full object-cover'),
  avatarFallback: cn('size-7 text-primary'),
  profileName: cn('block', 'font-semibold'),
  profileLabel: cn(
    'block',
    'mt-0.5 max-w-56 truncate',
    'text-muted-foreground',
    'text-xs font-normal',
  ),
  alert: cn('px-2.5 py-2', 'text-destructive', 'text-xs'),
  lookupCode: cn('min-w-0 truncate font-mono text-xs'),
  lookupCodeAction: cn(
    'flex items-center justify-between',
    'gap-2 px-2.5 py-2.5',
    'rounded-lg text-sm',
  ),
  icon: cn('size-4'),
  trigger: cn(
    'aspect-square overflow-hidden',
    'transition-[transform,opacity,box-shadow,border-color] duration-200 md:pointer-events-auto md:translate-x-0 md:opacity-100',
  ),
} as const;

export const getProfileDropdownTriggerClassName = (
  isMenuOpen: boolean,
  isActive: boolean,
): string =>
  cn(
    profileDropdownClassNames.trigger,
    isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 pointer-events-none opacity-0',
    isActive ? headerClassNames.activeMenuItem : undefined,
  );
