'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
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
import { emailOtpSignInFormClassNames as classNames } from './email-otp-sign-in-form.styles';
import { emailOtpSignInTexts as texts } from './texts';

export const EmailOtpSignInForm = (): ReactNode => {
  const { sendSignInOtp, signInWithEmailOtp } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [isCodeRequested, setIsCodeRequested] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<SignInFeedbackMessage | null>(null);
  const {
    formState: { errors: emailErrors },
    handleSubmit: handleSubmitEmail,
    register: registerEmail,
  } = useForm<SignInEmailValues>({
    resolver: zodResolver(signInEmailSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });
  const {
    formState: { errors: otpErrors },
    handleSubmit: handleSubmitOtp,
    register: registerOtp,
    reset: resetOtp,
  } = useForm<SignInOtpValues>({
    resolver: zodResolver(signInOtpSchema),
    defaultValues: { otp: '' },
    mode: 'onSubmit',
  });
  const otpError: string | undefined = useMemo(
    (): string | undefined => otpErrors.otp?.message,
    [otpErrors.otp?.message],
  );
  const emailError: string | undefined = useMemo(
    (): string | undefined => emailErrors.email?.message,
    [emailErrors.email?.message],
  );
  const verifyButtonLabel: string = useMemo(
    (): string => (isSubmitting ? texts.verifyingCode : texts.verifyCode),
    [isSubmitting],
  );
  const sendButtonLabel: string = useMemo(
    (): string => (isSubmitting ? texts.sendingCode : texts.sendCode),
    [isSubmitting],
  );

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
    resetOtp({ otp: '' });
  }, [resetOtp]);
  const submitOtp = useMemo(
    () => handleSubmitOtp(handleVerifyCode),
    [handleSubmitOtp, handleVerifyCode],
  );
  const submitEmail = useMemo(
    () => handleSubmitEmail(handleRequestCode),
    [handleSubmitEmail, handleRequestCode],
  );

  if (isCodeRequested) {
    return (
      <div className={classNames.content}>
        <p className={classNames.prompt}>
          {texts.promptForCode(String(signInOtpLength))}{' '}
          <span className={classNames.email}>{email}</span>.
        </p>
        <form className={classNames.form} noValidate onSubmit={submitOtp}>
          <div className={classNames.field}>
            <label className={classNames.label} htmlFor="sign-in-otp">
              {texts.otpLabel}
            </label>
            <Input
              {...registerOtp('otp')}
              aria-describedby={otpError ? 'sign-in-otp-error' : undefined}
              aria-invalid={otpError !== undefined}
              autoComplete="one-time-code"
              id="sign-in-otp"
              inputMode="numeric"
              maxLength={signInOtpLength}
              placeholder={texts.otpPlaceholder(String(signInOtpLength))}
            />
            {otpError ? (
              <p className={classNames.error} id="sign-in-otp-error" role="alert">
                {otpError}
              </p>
            ) : null}
          </div>
          <SignInFeedback feedback={feedback} />
          <Button className={classNames.submitButton} disabled={isSubmitting} type="submit">
            {verifyButtonLabel}
          </Button>
        </form>
        <div className={classNames.feedbackActions}>
          <Button
            className={classNames.quietAction}
            disabled={isSubmitting}
            onClick={handleChangeEmail}
            type="button"
            variant="link"
          >
            {texts.changeEmail}
          </Button>
          <Button
            className={classNames.quietAction}
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

  return (
    <form className={classNames.emailForm} noValidate onSubmit={submitEmail}>
      <div className={classNames.field}>
        <label className={classNames.label} htmlFor="sign-in-email">
          {texts.emailLabel}
        </label>
        <Input
          {...registerEmail('email')}
          aria-describedby={emailError ? 'sign-in-email-error' : undefined}
          aria-invalid={emailError !== undefined}
          autoComplete="email"
          id="sign-in-email"
          placeholder={texts.emailPlaceholder}
          type="email"
        />
        {emailError ? (
          <p className={classNames.error} id="sign-in-email-error" role="alert">
            {emailError}
          </p>
        ) : null}
      </div>
      <SignInFeedback feedback={feedback} />
      <Button className={classNames.submitButton} disabled={isSubmitting} type="submit">
        {sendButtonLabel}
      </Button>
    </form>
  );
};
