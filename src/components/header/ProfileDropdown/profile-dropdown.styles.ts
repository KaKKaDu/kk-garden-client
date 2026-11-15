import { cn } from '@/utils/class-names.utils';

export const profileDropdownClassNames = {
  avatar: cn('block', 'relative', 'size-full', 'aspect-square overflow-hidden rounded-full'),
  avatarImage: cn('block', 'absolute inset-0', 'h-full w-full object-cover'),
  avatarFallback: cn('size-8', 'text-muted-foreground'),
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

export const getProfileDropdownTriggerClassName = (isMenuOpen: boolean): string =>
  cn(
    profileDropdownClassNames.trigger,
    isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 pointer-events-none opacity-0',
  );
