import type { ReactNode } from 'react';
import type { SignInFeedbackProps } from '@/features/auth/types/sign-in.types';

export const SignInFeedback = ({ feedback }: SignInFeedbackProps): ReactNode => {
  if (feedback === null) {
    return null;
  }

  const isError: boolean = feedback.kind === 'error';

  return (
    <p
      className={isError ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}
      role={isError ? 'alert' : 'status'}
    >
      {feedback.message}
    </p>
  );
};
