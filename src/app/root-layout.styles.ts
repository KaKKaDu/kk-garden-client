import { cn } from '@/utils/class-names.utils';

export const rootLayoutClassNames = {
  html: cn('h-full antialiased'),
  body: cn('flex flex-col', 'm-0 w-full p-0'),
} as const;
