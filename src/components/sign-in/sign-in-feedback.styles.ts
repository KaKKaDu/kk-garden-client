import { cn } from '@/utils/class-names.utils';

export const getSignInFeedbackClassName = (isError: boolean): string =>
  cn(isError ? 'text-destructive' : 'text-muted-foreground', 'text-sm');
