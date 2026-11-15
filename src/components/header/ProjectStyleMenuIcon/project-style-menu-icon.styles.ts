import { cn } from '@/utils/class-names.utils';

export const projectStyleMenuIconClassNames = {
  root: cn('block border-0 pointer-events-none overflow-hidden', 'size-8'),
} as const;

export const getProjectStyleMenuIconClassName = (className?: string): string =>
  cn(projectStyleMenuIconClassNames.root, className);
