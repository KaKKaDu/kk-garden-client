import { cn } from '@/utils/class-names.utils';

export const headerLogoButtonClassNames = {
  mobile: cn('md:hidden'),
  desktop: cn('hidden md:inline-grid'),
  logo: cn('size-9'),
} as const;
