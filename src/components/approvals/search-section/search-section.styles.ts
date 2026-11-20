import { cn } from '@/utils/class-names.utils';

export const searchSectionClassNames = {
  root: cn('flex w-full flex-col', 'gap-6'),
  requestButton: cn(
    'size-12 rounded-full',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    'aria-disabled:hover:translate-x-0 aria-disabled:hover:translate-y-0',
    'aria-disabled:hover:bg-primary aria-disabled:hover:shadow-[3px_3px_0_var(--component-shadow-color)]',
    'aria-disabled:active:translate-x-0 aria-disabled:active:translate-y-0',
  ),
} as const;
