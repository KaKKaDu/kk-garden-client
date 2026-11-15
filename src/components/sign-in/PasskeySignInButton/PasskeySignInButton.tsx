'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getAuthOperationErrorMessage } from '@/features/auth/utils/auth-result.utils';
import type { SignInFeedbackMessage } from '@/features/auth/types/sign-in.types';
import { SignInFeedback } from '../SignInFeedback';
import { passkeySignInButtonClassNames as classNames } from './passkey-sign-in-button.styles';
import { passkeySignInTexts as texts } from './texts';

export const PasskeySignInButton = (): ReactNode => {
  const { signInWithPasskey } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<SignInFeedbackMessage | null>(null);
  const buttonLabel: string = useMemo(
    (): string => (isSubmitting ? texts.pending : texts.label),
    [isSubmitting],
  );

  const handleSignIn = useCallback(async (): Promise<void> => {
    setIsSubmitting(true);
    setFeedback(null);

    const result = await signInWithPasskey();
    const errorMessage: string | null = getAuthOperationErrorMessage(result, texts.error);

    setIsSubmitting(false);

    if (errorMessage !== null) {
      setFeedback({ kind: 'error', message: errorMessage });
    }
  }, [signInWithPasskey]);

  return (
    <div className={classNames.container}>
      <Button
        className={classNames.button}
        disabled={isSubmitting}
        onClick={handleSignIn}
        type="button"
        variant="outline"
      >
        {isSubmitting ? <Spinner aria-hidden="true" /> : <KeyRound aria-hidden="true" />}
        {buttonLabel}
      </Button>
      <SignInFeedback feedback={feedback} />
    </div>
  );
};
