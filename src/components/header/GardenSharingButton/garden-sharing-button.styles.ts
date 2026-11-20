import { cn } from '@/utils/class-names.utils';
import { headerClassNames } from '../header.styles';

export const gardenSharingButtonClassNames = {
  trigger: cn(
    'aspect-square overflow-hidden',
    'transition-[transform,opacity,box-shadow,border-color] duration-200 md:pointer-events-auto md:translate-x-0 md:opacity-100',
  ),
  icon: cn('size-7'),
} as const;

export const getGardenSharingButtonClassName = (isMenuOpen: boolean, isActive: boolean): string =>
  cn(
    gardenSharingButtonClassNames.trigger,
    isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 pointer-events-none opacity-0',
    isActive ? headerClassNames.activeMenuItem : undefined,
  );
