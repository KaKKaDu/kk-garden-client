'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { SocialAuthProvider } from '@/services/auth/auth.types';
import { getAuthOperationErrorMessage } from '@/features/auth/utils/auth-result.utils';
import type { SignInFeedbackMessage } from '@/features/auth/types/sign-in.types';
import { SignInFeedback } from '../SignInFeedback';
import { socialSignInTexts as texts } from './texts';
import { GitHubIcon } from './GitHubIcon';
import { GoogleIcon } from './GoogleIcon';

export const SocialSignInButtons = (): ReactNode => {
  const { signInWithSocial } = useAuth();
  const [pendingProvider, setPendingProvider] = useState<SocialAuthProvider | null>(null);
  const [feedback, setFeedback] = useState<SignInFeedbackMessage | null>(null);

  const handleSignIn = useCallback(
    async (provider: SocialAuthProvider): Promise<void> => {
      setPendingProvider(provider);
      setFeedback(null);

      const callbackURL: string = new URL(authRoutePaths.main, window.location.origin).toString();
      const result = await signInWithSocial(provider, callbackURL);
      const providerName: string = texts[provider];
      const errorMessage: string | null = getAuthOperationErrorMessage(
        result,
        texts.error(providerName),
      );

      setPendingProvider(null);

      if (errorMessage !== null) {
        setFeedback({ kind: 'error', message: errorMessage });
      }
    },
    [signInWithSocial],
  );

  const handleGoogleSignIn = useCallback((): void => void handleSignIn('google'), [handleSignIn]);
  const handleGitHubSignIn = useCallback((): void => void handleSignIn('github'), [handleSignIn]);
  const isSubmitting: boolean = pendingProvider !== null;

  return (
    <div className="space-y-3">
      <Button
        className="h-11 w-full"
        disabled={isSubmitting}
        onClick={handleGoogleSignIn}
        type="button"
        variant="outline"
      >
        <GoogleIcon />
        {pendingProvider === 'google'
          ? texts.connecting(texts.google)
          : texts.continueWith(texts.google)}
      </Button>
      <Button
        className="h-11 w-full"
        disabled={isSubmitting}
        onClick={handleGitHubSignIn}
        type="button"
        variant="outline"
      >
        <GitHubIcon />
        {pendingProvider === 'github'
          ? texts.connecting(texts.github)
          : texts.continueWith(texts.github)}
      </Button>
      <SignInFeedback feedback={feedback} />
    </div>
  );
};
