'use client';

import { useCallback, useEffect, useMemo, useRef, type ChangeEvent, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, Pencil, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
  profileEditSchema,
  type ProfileEditValues,
} from '@/features/profile/schemas/profile-edit.schema';
import { useEditProfile } from '@/features/profile/hooks/use-edit-profile/use-edit-profile';
import { profileEditFormTexts as texts } from '@/features/profile/hooks/use-edit-profile/texts';
import { useCopyLookupCode } from '@/features/profile/hooks/use-copy-lookup-code/use-copy-lookup-code';
import {
  getProfileFeedbackClassName,
  profileEditFormClassNames as classNames,
  profileFieldErrorClassName,
} from './profile-edit-form.styles';

export const ProfileEditForm = (): ReactNode => {
  const {
    feedback,
    hasLoadedProfile,
    isSubmitting,
    profileLoadError,
    profile,
    previewUrl,
    saveProfile,
    selectAvatarFile,
  } = useEditProfile();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: { displayName: '', bio: '' },
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const submitProfile = useMemo(() => handleSubmit(saveProfile), [handleSubmit, saveProfile]);
  const lookupCode: string | null = useMemo(
    (): string | null => profile?.lookupCode ?? null,
    [profile?.lookupCode],
  );
  const avatarUrl: string | null = useMemo(
    (): string | null => previewUrl ?? profile?.avatar?.url ?? null,
    [previewUrl, profile?.avatar?.url],
  );
  const avatarDisplay: ReactNode = useMemo(
    (): ReactNode =>
      avatarUrl !== null ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" className={classNames.avatarImage} src={avatarUrl} />
      ) : (
        <UserRound aria-hidden="true" className={classNames.avatarFallback} />
      ),
    [avatarUrl],
  );
  const hasLookupCode: boolean = useMemo((): boolean => lookupCode !== null, [lookupCode]);
  const isLoading: boolean = useMemo((): boolean => !hasLoadedProfile, [hasLoadedProfile]);
  const displayNameError: string | undefined = useMemo(
    (): string | undefined => errors.displayName?.message,
    [errors.displayName?.message],
  );
  const bioError: string | undefined = useMemo(
    (): string | undefined => errors.bio?.message,
    [errors.bio?.message],
  );
  const feedbackClassName: string = useMemo(
    (): string => getProfileFeedbackClassName(feedback?.kind === 'error'),
    [feedback?.kind],
  );
  const feedbackRole: 'alert' | 'status' = useMemo(
    (): 'alert' | 'status' => (feedback?.kind === 'error' ? 'alert' : 'status'),
    [feedback?.kind],
  );
  const avatarInputKey: 'empty' | 'selected' = useMemo(
    (): 'empty' | 'selected' => (previewUrl === null ? 'empty' : 'selected'),
    [previewUrl],
  );

  useEffect(() => {
    if (profile !== null) {
      reset({
        displayName: profile.configured ? profile.displayName : '',
        bio: profile.configured ? (profile.bio ?? '') : '',
      });
    }
  }, [profile, reset]);

  const { copyLookupCode, status: lookupCodeCopyStatus } = useCopyLookupCode(lookupCode);
  const isLookupCodeCopied: boolean = useMemo(
    (): boolean => lookupCodeCopyStatus === 'copied',
    [lookupCodeCopyStatus],
  );
  const hasLookupCodeCopyError: boolean = useMemo(
    (): boolean => lookupCodeCopyStatus === 'error',
    [lookupCodeCopyStatus],
  );
  const handleAvatarSelection = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      selectAvatarFile(event.currentTarget.files?.[0] ?? null),
    [selectAvatarFile],
  );
  const openAvatarPicker = useCallback((): void => avatarInputRef.current?.click(), []);

  return (
    <section className={classNames.section}>
      {isLoading ? (
        <p className={classNames.loading} role="status">
          <Spinner aria-hidden="true" />
          {texts.loading}
        </p>
      ) : profileLoadError !== null ? (
        <p className={classNames.error} role="alert">
          {profileLoadError}
        </p>
      ) : (
        <form className={classNames.form} onSubmit={submitProfile}>
          <div className={classNames.avatarColumn}>
            <input
              accept="image/jpeg,image/png,image/webp"
              aria-label={texts.avatar}
              className={classNames.hiddenInput}
              disabled={isSubmitting}
              id="profile-avatar"
              key={avatarInputKey}
              onChange={handleAvatarSelection}
              ref={avatarInputRef}
              type="file"
            />
            <Button
              aria-label={texts.changeAvatar}
              className={classNames.avatarButton}
              disabled={isSubmitting}
              onClick={openAvatarPicker}
              type="button"
              variant="outline"
            >
              <span className={classNames.avatarFrame}>
                {avatarDisplay}
                <span className={classNames.avatarOverlay}>
                  <Pencil aria-hidden="true" className={classNames.avatarEditIcon} />
                </span>
              </span>
            </Button>
            <p className={classNames.avatarHint}>{texts.avatarHint}</p>
            <div className={classNames.lookupPanel}>
              <p className={classNames.lookupLabel}>{texts.lookupCode}</p>
              <div className={classNames.lookupRow}>
                <code className={classNames.lookupValue}>
                  {lookupCode ?? texts.lookupCodeUnavailable}
                </code>
                {hasLookupCode ? (
                  <Button
                    aria-label={isLookupCodeCopied ? texts.lookupCodeCopied : texts.copyLookupCode}
                    className={classNames.copyButton}
                    onClick={copyLookupCode}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    {lookupCodeCopyStatus === 'copied' ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <Copy aria-hidden="true" />
                    )}
                  </Button>
                ) : null}
              </div>
              {hasLookupCodeCopyError ? (
                <p className={classNames.errorHint} role="alert">
                  {texts.lookupCodeCopyError}
                </p>
              ) : null}
            </div>
          </div>

          <div className={classNames.fields}>
            <div className={classNames.field}>
              <label className={classNames.label} htmlFor="profile-display-name">
                {texts.displayName}
              </label>
              <Input
                aria-invalid={displayNameError !== undefined}
                autoComplete="name"
                disabled={isSubmitting}
                id="profile-display-name"
                {...register('displayName')}
              />
              {displayNameError !== undefined ? (
                <p className={profileFieldErrorClassName} role="alert">
                  {displayNameError ?? texts.displayNameRequired}
                </p>
              ) : null}
            </div>

            <div className={classNames.field}>
              <label className={classNames.label} htmlFor="profile-bio">
                {texts.bio}
              </label>
              <Textarea
                aria-describedby="profile-bio-hint"
                aria-invalid={bioError !== undefined}
                disabled={isSubmitting}
                id="profile-bio"
                {...register('bio')}
              />
              <p className={classNames.help} id="profile-bio-hint">
                {texts.bioHint}
              </p>
              {bioError !== undefined ? (
                <p className={profileFieldErrorClassName} role="alert">
                  {bioError ?? texts.bioInvalid}
                </p>
              ) : null}
            </div>

            {feedback !== null ? (
              <p className={feedbackClassName} role={feedbackRole}>
                {feedback.message}
              </p>
            ) : null}

            <Button
              className={classNames.submitButton}
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting ? <Spinner aria-hidden="true" /> : null}
              {isSubmitting ? texts.saving : texts.save}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
