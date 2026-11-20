import { cn } from '@/utils/class-names.utils';

export const headerClassNames = {
  backdrop: cn(
    'fixed inset-0 z-40',
    'bg-foreground/10',
    'transition-opacity motion-reduce:transition-none md:hidden',
  ),
  nav: cn('fixed inset-y-0 left-0 z-50 w-20 overflow-x-hidden overflow-y-auto', 'main-menu-scroll'),
  content: cn('flex flex-col items-center', 'min-h-full px-3 py-3'),
  menu: cn('flex flex-col items-center', 'mt-0 gap-4', 'md:my-auto'),
  activeMenuItem: cn('border-primary bg-primary/20 ring-2 ring-primary/30'),
} as const;

export const getHeaderNavClassName = (isMenuOpen: boolean): string =>
  cn(
    headerClassNames.nav,
    isMenuOpen ? 'bg-background/95 shadow-lg' : 'bg-transparent',
    'transition-colors md:bg-transparent',
  );
