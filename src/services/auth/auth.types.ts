import type { emailOTPClient } from 'better-auth/client/plugins';
import type { createAuthClient } from 'better-auth/react';
import type { passkeyClient } from '@better-auth/passkey/client';
import type { SuccessDataAny } from '@kk-garden/shared/errors';

export type BetterAuthClientOptions = {
  baseURL: string;
  basePath: string;
  fetchOptions: { credentials: 'include' };
  plugins: [ReturnType<typeof emailOTPClient>, ReturnType<typeof passkeyClient>];
};

export type BetterAuthClient = ReturnType<typeof createAuthClient<BetterAuthClientOptions>>;
export type ClientAuthSession = BetterAuthClient['$Infer']['Session'];
export type AuthSessionState = ReturnType<BetterAuthClient['useSession']>;

export type AuthOperationResult<Data extends object> = Promise<SuccessDataAny<Data>>;

export type SendSignInOtpData = NonNullable<
  Awaited<ReturnType<BetterAuthClient['emailOtp']['sendVerificationOtp']>>['data']
>;
export type SignInWithEmailOtpData = NonNullable<
  Awaited<ReturnType<BetterAuthClient['signIn']['emailOtp']>>['data']
>;
export type SignInWithSocialData = NonNullable<
  Awaited<ReturnType<BetterAuthClient['signIn']['social']>>['data']
>;
export type SignInWithPasskeyData = NonNullable<
  Awaited<ReturnType<BetterAuthClient['signIn']['passkey']>>['data']
>;
export type SignOutData = NonNullable<Awaited<ReturnType<BetterAuthClient['signOut']>>['data']>;

export type SocialAuthProvider = 'google' | 'github';
