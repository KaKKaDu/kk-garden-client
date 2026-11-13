'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, Pencil, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  profileEditSchema,
  type ProfileEditValues,
} from '@/features/profile/schemas/profile-edit.schema';
import { useEditProfile } from '@/features/profile/hooks/use-edit-profile/use-edit-profile';
import { profileEditFormTexts as texts } from '@/features/profile/hooks/use-edit-profile/texts';
import { useCopyLookupCode } from '@/features/profile/hooks/use-copy-lookup-code/use-copy-lookup-code';

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

  useEffect(() => {
    if (profile !== null) {
      reset({
        displayName: profile.configured ? profile.displayName : '',
        bio: profile.configured ? (profile.bio ?? '') : '',
      });
    }
  }, [profile, reset]);

  const lookupCode: string | null = profile?.lookupCode ?? null;
  const { copyLookupCode, status: lookupCodeCopyStatus } = useCopyLookupCode(lookupCode);
  const avatarUrl: string | null = previewUrl ?? profile?.avatar?.url ?? null;
  const isLoading: boolean = !hasLoadedProfile;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-8">
      {isLoading ? (
        <p className="text-sm text-muted-foreground" role="status">
          {texts.loading}
        </p>
      ) : profileLoadError !== null ? (
        <p className="text-sm text-destructive" role="alert">
          {profileLoadError}
        </p>
      ) : (
        <form
          className="grid gap-8 sm:grid-cols-[10rem_minmax(0,1fr)]"
          onSubmit={handleSubmit(saveProfile)}
        >
          <div className="flex flex-col items-center gap-3 sm:items-start sm:self-center">
            <input
              accept="image/jpeg,image/png,image/webp"
              aria-label={texts.avatar}
              className="hidden"
              disabled={isSubmitting}
              id="profile-avatar"
              key={previewUrl === null ? 'empty' : 'selected'}
              onChange={(event): void => selectAvatarFile(event.currentTarget.files?.[0] ?? null)}
              ref={avatarInputRef}
              type="file"
            />
            <Button
              aria-label={texts.changeAvatar}
              className="group relative aspect-square h-40 w-40 min-h-40 min-w-40 shrink-0 overflow-hidden rounded-full border-primary/40 bg-secondary p-0"
              disabled={isSubmitting}
              onClick={(): void => avatarInputRef.current?.click()}
              type="button"
              variant="outline"
            >
              <span className="relative block aspect-square size-full overflow-hidden rounded-full bg-muted">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    className="absolute inset-0 block h-full w-full object-cover"
                    src={avatarUrl}
                  />
                ) : (
                  <UserRound
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                )}
                <span className="absolute inset-0 grid place-items-center bg-background/75 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Pencil aria-hidden="true" className="size-8" />
                </span>
              </span>
            </Button>
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              {texts.avatarHint}
            </p>
            <div className="w-full rounded-xl border-2 border-primary/20 bg-card p-3 text-card-foreground shadow-[3px_3px_0_var(--component-shadow-color)]">
              <p className="mb-1 text-xs font-medium text-muted-foreground">{texts.lookupCode}</p>
              <div className="flex items-center justify-between gap-2">
                <code className="min-w-0 truncate font-mono text-xs">
                  {lookupCode ?? texts.lookupCodeUnavailable}
                </code>
                {lookupCode ? (
                  <Button
                    aria-label={
                      lookupCodeCopyStatus === 'copied'
                        ? texts.lookupCodeCopied
                        : texts.copyLookupCode
                    }
                    className="size-8"
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
              {lookupCodeCopyStatus === 'error' ? (
                <p className="mt-1 text-xs text-destructive" role="alert">
                  {texts.lookupCodeCopyError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="profile-display-name">
                {texts.displayName}
              </label>
              <Input
                aria-invalid={errors.displayName !== undefined}
                autoComplete="name"
                disabled={isSubmitting}
                id="profile-display-name"
                {...register('displayName')}
              />
              {errors.displayName ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.displayName.message ?? texts.displayNameRequired}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="profile-bio">
                {texts.bio}
              </label>
              <Textarea
                aria-describedby="profile-bio-hint"
                aria-invalid={errors.bio !== undefined}
                disabled={isSubmitting}
                id="profile-bio"
                {...register('bio')}
              />
              <p className="text-xs text-muted-foreground" id="profile-bio-hint">
                {texts.bioHint}
              </p>
              {errors.bio ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.bio.message ?? texts.bioInvalid}
                </p>
              ) : null}
            </div>

            {feedback ? (
              <p
                className={
                  feedback.kind === 'error' ? 'text-sm text-destructive' : 'text-sm text-foreground'
                }
                role={feedback.kind === 'error' ? 'alert' : 'status'}
              >
                {feedback.message}
              </p>
            ) : null}

            <Button className="w-full sm:w-auto" disabled={isSubmitting} size="lg" type="submit">
              {isSubmitting ? texts.saving : texts.save}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};
