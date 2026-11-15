import { cn } from '@/utils/class-names.utils';

export const gardenVisualisationClassNames = {
  root: cn('mx-auto grid w-full place-items-center', 'overflow-hidden rounded-2xl'),
  error: cn('p-4 text-center text-sm text-destructive'),
} as const;
