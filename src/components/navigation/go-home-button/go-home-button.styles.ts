import { cn } from '@/utils/class-names.utils';

export const goHomeButtonClassNames = {
  root: cn('flex w-fit'),
} as const;

export const getGoHomeButtonClassName = (
  align: 'center' | 'left',
  spacing: 'compact' | 'default',
): string =>
  cn(
    goHomeButtonClassNames.root,
    spacing === 'compact' ? 'mt-3' : 'mt-6',
    align === 'center' ? 'mx-auto' : 'mx-0',
  );
