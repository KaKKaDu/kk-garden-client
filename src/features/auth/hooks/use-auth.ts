'use client';

import { useCallback, useMemo } from 'react';
import { getApiService } from '@/services/api/api.container';
import { getAuthService } from '@/services/auth/auth.container';
import { getBetterAuthClient } from '@/services/auth/auth.utils';
import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type {
  SendSignInOtpData,
  SignInWithEmailOtpData,
  SignInWithPasskeyData,
  SignInWithSocialData,
  SignOutData,
  SocialAuthProvider,
} from '@/services/auth/auth.types';
import type { UseAuthResult } from '../types/use-auth.types';

export const useAuth = (): UseAuthResult => {
  const authService = getAuthService();
  const authSession = getBetterAuthClient(getApiService()).useSession();
  const session: UseAuthResult['session'] = useMemo(
    (): UseAuthResult['session'] => authSession.data?.session ?? null,
    [authSession.data?.session],
  );
  const user: UseAuthResult['user'] = useMemo(
    (): UseAuthResult['user'] => authSession.data?.user ?? null,
    [authSession.data?.user],
  );
  const isAuthenticated: boolean = useMemo((): boolean => session !== null, [session]);
  const isPending: boolean = authSession.isPending;
  const isRefetching: boolean = authSession.isRefetching;
  const error: UseAuthResult['error'] = authSession.error;
  const refreshSession: UseAuthResult['refreshSession'] = authSession.refetch;

  const sendSignInOtp: UseAuthResult['sendSignInOtp'] = useCallback(
    (email: string): Promise<SuccessDataAny<SendSignInOtpData>> => authService.sendSignInOtp(email),
    [authService],
  );
  const signInWithEmailOtp: UseAuthResult['signInWithEmailOtp'] = useCallback(
    (email: string, otp: string): Promise<SuccessDataAny<SignInWithEmailOtpData>> =>
      authService.signInWithEmailOtp(email, otp),
    [authService],
  );
  const signInWithSocial: UseAuthResult['signInWithSocial'] = useCallback(
    (
      provider: SocialAuthProvider,
      callbackURL: string,
    ): Promise<SuccessDataAny<SignInWithSocialData>> =>
      authService.signInWithSocial(provider, callbackURL),
    [authService],
  );
  const signInWithPasskey: UseAuthResult['signInWithPasskey'] = useCallback(
    (): Promise<SuccessDataAny<SignInWithPasskeyData>> => authService.signInWithPasskey(),
    [authService],
  );
  const signOut: UseAuthResult['signOut'] = useCallback(
    (): Promise<SuccessDataAny<SignOutData>> => authService.signOut(),
    [authService],
  );

  return useMemo<UseAuthResult>(
    () => ({
      session,
      user,
      isAuthenticated,
      isPending,
      isRefetching,
      error,
      refreshSession,
      sendSignInOtp,
      signInWithEmailOtp,
      signInWithSocial,
      signInWithPasskey,
      signOut,
    }),
    [
      session,
      user,
      isAuthenticated,
      isPending,
      isRefetching,
      error,
      refreshSession,
      sendSignInOtp,
      signInWithEmailOtp,
      signInWithSocial,
      signInWithPasskey,
      signOut,
    ],
  );
};
