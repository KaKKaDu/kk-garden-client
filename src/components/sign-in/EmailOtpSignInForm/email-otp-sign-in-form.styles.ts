import { cn } from '@/utils/class-names.utils';

export const emailOtpSignInFormClassNames = {
  content: cn('space-y-4'),
  form: cn('space-y-3'),
  field: cn('space-y-2'),
  label: cn('text-sm font-medium'),
  error: cn('text-destructive', 'text-sm'),
  submitButton: cn('h-11 w-full'),
  feedbackActions: cn('flex flex-wrap items-center justify-between', 'gap-2', 'text-sm'),
  quietAction: cn('px-0'),
  emailForm: cn('space-y-4'),
  prompt: cn('text-muted-foreground', 'text-sm'),
  email: cn('font-medium'),
} as const;
