import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type {
  AuthSessionState,
  ClientAuthSession,
  SendSignInOtpData,
  SignInWithEmailOtpData,
  SignInWithPasskeyData,
  SignInWithSocialData,
  SignOutData,
  SocialAuthProvider,
} from '@/services/auth/auth.types';

export type UseAuthResult = {
  session: ClientAuthSession['session'] | null;
  user: ClientAuthSession['user'] | null;
  isAuthenticated: boolean;
  isPending: AuthSessionState['isPending'];
  isRefetching: AuthSessionState['isRefetching'];
  error: AuthSessionState['error'];
  refreshSession: AuthSessionState['refetch'];
  sendSignInOtp: (email: string) => Promise<SuccessDataAny<SendSignInOtpData>>;
  signInWithEmailOtp: (
    email: string,
    otp: string,
  ) => Promise<SuccessDataAny<SignInWithEmailOtpData>>;
  signInWithSocial: (
    provider: SocialAuthProvider,
    callbackURL: string,
  ) => Promise<SuccessDataAny<SignInWithSocialData>>;
  signInWithPasskey: () => Promise<SuccessDataAny<SignInWithPasskeyData>>;
  signOut: () => Promise<SuccessDataAny<SignOutData>>;
};
