import { cn } from '@/utils/class-names.utils';

export const approvalsPageClassNames = {
  root: cn(
    'mx-4 flex min-h-full w-auto max-w-5xl flex-col md:mx-6 xl:mx-auto',
    'mt-8 gap-6 p-5 sm:p-8 md:mt-16',
    'rounded-3xl border-2 border-border bg-card/90',
    'shadow-[var(--component-shadow-large)]',
  ),
  tabs: cn('w-full gap-5'),
  tabsList: cn('grid w-full grid-cols-3 gap-0 sm:gap-1'),
  tabsTrigger: cn(
    'min-w-0 px-0 text-center text-xs leading-tight whitespace-normal sm:px-2 sm:text-sm',
  ),
  tabsContent: cn('mt-1'),
} as const;
