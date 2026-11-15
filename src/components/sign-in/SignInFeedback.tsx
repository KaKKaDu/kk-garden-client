import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { SignInFeedbackProps } from '@/features/auth/types/sign-in.types';
import { getSignInFeedbackClassName } from './sign-in-feedback.styles';

export const SignInFeedback = ({ feedback }: SignInFeedbackProps): ReactNode => {
  const isError: boolean = useMemo((): boolean => feedback?.kind === 'error', [feedback?.kind]);
  const className: string = useMemo((): string => getSignInFeedbackClassName(isError), [isError]);
  const role: 'alert' | 'status' = useMemo(
    (): 'alert' | 'status' => (isError ? 'alert' : 'status'),
    [isError],
  );

  if (feedback === null) {
    return null;
  }

  return (
    <p className={className} role={role}>
      {feedback.message}
    </p>
  );
};
