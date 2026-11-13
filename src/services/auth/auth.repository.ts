'use client';

import type { ApiService } from '@/services/api/api.service';
import { executeAuthOperation } from './auth.utils';
import type {
  AuthOperationResult,
  SendSignInOtpData,
  SignInWithEmailOtpData,
  SignInWithPasskeyData,
  SignInWithSocialData,
  SignOutData,
  SocialAuthProvider,
} from './auth.types';

export class AuthRepository {
  public constructor(private readonly apiService: ApiService) {}

  public sendSignInOtp(email: string): AuthOperationResult<SendSignInOtpData> {
    return executeAuthOperation(this.apiService, (client) =>
      client.emailOtp.sendVerificationOtp({ email, type: 'sign-in' }),
    );
  }

  public signInWithEmailOtp(
    email: string,
    otp: string,
  ): AuthOperationResult<SignInWithEmailOtpData> {
    return executeAuthOperation(this.apiService, (client) =>
      client.signIn.emailOtp({ email, otp }),
    );
  }

  public signInWithSocial(
    provider: SocialAuthProvider,
    callbackURL: string,
  ): AuthOperationResult<SignInWithSocialData> {
    return executeAuthOperation(this.apiService, (client) =>
      client.signIn.social({ provider, callbackURL }),
    );
  }

  public signInWithPasskey(): AuthOperationResult<SignInWithPasskeyData> {
    return executeAuthOperation(this.apiService, (client) => client.signIn.passkey());
  }

  public signOut(): AuthOperationResult<SignOutData> {
    return executeAuthOperation(this.apiService, (client) => client.signOut());
  }
}
