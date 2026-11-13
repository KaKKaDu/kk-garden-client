'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { signInOtpLength } from '@/features/auth/constants/sign-in.constants';
import { signInEmailSchema, signInOtpSchema } from '@/features/auth/schemas/sign-in.schemas';
import type { SignInEmailValues, SignInOtpValues } from '@/features/auth/schemas/sign-in.schemas';
import { getAuthOperationErrorMessage } from '@/features/auth/utils/auth-result.utils';
import type { SignInFeedbackMessage } from '@/features/auth/types/sign-in.types';
import { SignInFeedback } from '../SignInFeedback';
import { emailOtpSignInTexts as texts } from './texts';

export const EmailOtpSignInForm = (): ReactNode => {
  const { sendSignInOtp, signInWithEmailOtp } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [isCodeRequested, setIsCodeRequested] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<SignInFeedbackMessage | null>(null);
  const emailForm = useForm<SignInEmailValues>({
    resolver: zodResolver(signInEmailSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });
  const otpForm = useForm<SignInOtpValues>({
    resolver: zodResolver(signInOtpSchema),
    defaultValues: { otp: '' },
    mode: 'onSubmit',
  });

  const requestCode = useCallback(
    async (address: string, isResend: boolean): Promise<void> => {
      setIsSubmitting(true);
      setFeedback(null);

      const result = await sendSignInOtp(address);
      const errorMessage: string | null = getAuthOperationErrorMessage(result, texts.sendCodeError);

      setIsSubmitting(false);

      if (errorMessage !== null) {
        setFeedback({ kind: 'error', message: errorMessage });
        return;
      }

      setEmail(address);
      setIsCodeRequested(true);
      setFeedback({
        kind: 'success',
        message: isResend ? texts.resentCode : texts.sentCode,
      });
    },
    [sendSignInOtp],
  );

  const handleRequestCode: SubmitHandler<SignInEmailValues> = useCallback(
    async ({ email: submittedEmail }): Promise<void> => requestCode(submittedEmail, false),
    [requestCode],
  );

  const handleVerifyCode: SubmitHandler<SignInOtpValues> = useCallback(
    async ({ otp }): Promise<void> => {
      setIsSubmitting(true);
      setFeedback(null);

      const result = await signInWithEmailOtp(email, otp);
      const errorMessage: string | null = getAuthOperationErrorMessage(
        result,
        texts.verifyCodeError,
      );

      setIsSubmitting(false);

      if (errorMessage !== null) {
        setFeedback({ kind: 'error', message: errorMessage });
        return;
      }

      setFeedback({ kind: 'success', message: texts.signedIn });
    },
    [email, signInWithEmailOtp],
  );

  const handleResendCode = useCallback(
    async (): Promise<void> => requestCode(email, true),
    [email, requestCode],
  );

  const handleChangeEmail = useCallback((): void => {
    setIsCodeRequested(false);
    setFeedback(null);
    otpForm.reset({ otp: '' });
  }, [otpForm]);

  if (isCodeRequested) {
    const otpError: string | undefined = otpForm.formState.errors.otp?.message;

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {texts.promptForCode(String(signInOtpLength))}{' '}
          <span className="font-medium">{email}</span>.
        </p>
        <form className="space-y-3" noValidate onSubmit={otpForm.handleSubmit(handleVerifyCode)}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-in-otp">
              {texts.otpLabel}
            </label>
            <Input
              {...otpForm.register('otp')}
              aria-describedby={otpError ? 'sign-in-otp-error' : undefined}
              aria-invalid={otpError !== undefined}
              autoComplete="one-time-code"
              id="sign-in-otp"
              inputMode="numeric"
              maxLength={signInOtpLength}
              placeholder={texts.otpPlaceholder(String(signInOtpLength))}
            />
            {otpError ? (
              <p className="text-sm text-destructive" id="sign-in-otp-error" role="alert">
                {otpError}
              </p>
            ) : null}
          </div>
          <SignInFeedback feedback={feedback} />
          <Button className="h-11 w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? texts.verifyingCode : texts.verifyCode}
          </Button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <Button
            className="px-0"
            disabled={isSubmitting}
            onClick={handleChangeEmail}
            type="button"
            variant="link"
          >
            {texts.changeEmail}
          </Button>
          <Button
            className="px-0"
            disabled={isSubmitting}
            onClick={handleResendCode}
            type="button"
            variant="link"
          >
            {texts.resendCode}
          </Button>
        </div>
      </div>
    );
  }

  const emailError: string | undefined = emailForm.formState.errors.email?.message;

  return (
    <form className="space-y-4" noValidate onSubmit={emailForm.handleSubmit(handleRequestCode)}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="sign-in-email">
          {texts.emailLabel}
        </label>
        <Input
          {...emailForm.register('email')}
          aria-describedby={emailError ? 'sign-in-email-error' : undefined}
          aria-invalid={emailError !== undefined}
          autoComplete="email"
          id="sign-in-email"
          placeholder={texts.emailPlaceholder}
          type="email"
        />
        {emailError ? (
          <p className="text-sm text-destructive" id="sign-in-email-error" role="alert">
            {emailError}
          </p>
        ) : null}
      </div>
      <SignInFeedback feedback={feedback} />
      <Button className="h-11 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? texts.sendingCode : texts.sendCode}
      </Button>
    </form>
  );
};
