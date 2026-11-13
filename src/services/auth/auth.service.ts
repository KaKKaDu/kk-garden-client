'use client';

import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type { AuthRepository } from './auth.repository';
import type {
  SendSignInOtpData,
  SignInWithEmailOtpData,
  SignInWithPasskeyData,
  SignInWithSocialData,
  SignOutData,
  SocialAuthProvider,
} from './auth.types';

export class AuthService {
  public constructor(private readonly authRepository: AuthRepository) {}

  public sendSignInOtp(email: string): Promise<SuccessDataAny<SendSignInOtpData>> {
    return this.authRepository.sendSignInOtp(email);
  }

  public signInWithEmailOtp(
    email: string,
    otp: string,
  ): Promise<SuccessDataAny<SignInWithEmailOtpData>> {
    return this.authRepository.signInWithEmailOtp(email, otp);
  }

  public signInWithSocial(
    provider: SocialAuthProvider,
    callbackURL: string,
  ): Promise<SuccessDataAny<SignInWithSocialData>> {
    return this.authRepository.signInWithSocial(provider, callbackURL);
  }

  public signInWithPasskey(): Promise<SuccessDataAny<SignInWithPasskeyData>> {
    return this.authRepository.signInWithPasskey();
  }

  public signOut(): Promise<SuccessDataAny<SignOutData>> {
    return this.authRepository.signOut();
  }
}
