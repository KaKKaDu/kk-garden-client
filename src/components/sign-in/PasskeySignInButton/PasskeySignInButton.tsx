'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getAuthOperationErrorMessage } from '@/features/auth/utils/auth-result.utils';
import type { SignInFeedbackMessage } from '@/features/auth/types/sign-in.types';
import { SignInFeedback } from '../SignInFeedback';
import { passkeySignInTexts as texts } from './texts';

export const PasskeySignInButton = (): ReactNode => {
  const { signInWithPasskey } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<SignInFeedbackMessage | null>(null);

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
    <div className="space-y-3">
      <Button
        className="h-11 w-full"
        disabled={isSubmitting}
        onClick={handleSignIn}
        type="button"
        variant="outline"
      >
        <KeyRound aria-hidden="true" />
        {isSubmitting ? texts.pending : texts.label}
      </Button>
      <SignInFeedback feedback={feedback} />
    </div>
  );
};
