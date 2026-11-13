import type { StaticTexts } from '@/types/static-texts.types';

export const emailOtpSignInTexts = {
  emailLabel: 'Email address',
  emailPlaceholder: 'you@example.com',
  sendCode: 'Continue with email',
  sendingCode: 'Sending code...',
  sendCodeError: 'We could not send a sign-in code. Please try again.',
  sentCode: 'If this address is registered, a sign-in code has been sent.',
  resentCode: 'A new code has been requested.',
  promptForCode: (length: string): string => `Enter the ${length}-digit code sent to`,
  otpLabel: 'Verification code',
  otpPlaceholder: (length: string): string => '-'.repeat(Number(length)),
  verifyCode: 'Verify and sign in',
  verifyingCode: 'Verifying code...',
  verifyCodeError: 'That code could not be verified. Please try again.',
  signedIn: 'Signed in. Redirecting to your garden...',
  changeEmail: 'Use a different email',
  resendCode: 'Resend code',
} as const satisfies StaticTexts;
