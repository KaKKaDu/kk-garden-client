'use client';

import { handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import {
  ProfileAvatarUploadRequestSchema,
  type ProfileOwnerResponse,
} from '@kk-garden/shared/schemas';
import { useCallback, useEffect, useState } from 'react';
import { useProfileStore } from '@/features/profile/store/profile.store';
import { getLoggerService } from '@/services/logger/logger.container';
import { getProfileService } from '@/services/profile/profile.container';
import type { ProfileResult } from '@/services/profile/profile.types';
import type { ProfileEditValues } from '../../schemas/profile-edit.schema';
import { profileEditFormTexts as texts } from './texts';

type Feedback = {
  kind: 'error' | 'success';
  message: string;
};

type UseEditProfileResult = {
  feedback: Feedback | null;
  hasLoadedProfile: boolean;
  isSubmitting: boolean;
  profileLoadError: string | null;
  profile: ProfileOwnerResponse | null;
  previewUrl: string | null;
  saveProfile: (values: ProfileEditValues) => Promise<void>;
  selectAvatarFile: (file: File | null) => void;
};

const getResultData = <Data extends object>(
  result: SuccessDataAny<Data>,
  fallbackMessage: string,
): Data => {
  if (!result.success) {
    throw result.errors[0] ?? new Error(fallbackMessage);
  }

  if (result.data === undefined) {
    throw new Error(fallbackMessage);
  }

  return result.data;
};

const getErrorMessage = (error: unknown, fallbackMessage: string): string =>
  error instanceof Error ? error.message : fallbackMessage;

export const useEditProfile = (): UseEditProfileResult => {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const [hasLoadedProfile, setHasLoadedProfile] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchProfile = async (): Promise<void> => {
      try {
        const result: ProfileResult = await getProfileService().getProfile();
        const profileData = getResultData(result, texts.profileError);

        if (active) {
          setProfile(profileData);
          setSelectedFile(null);
          setPreviewUrl(null);
          setFeedback(null);
          setProfileLoadError(null);
        }
      } catch (error: unknown) {
        if (active) {
          getLoggerService().report('profile.edit.load', handleError(error));
          setProfileLoadError(getErrorMessage(error, texts.profileError));
        }
      } finally {
        if (active) {
          setHasLoadedProfile(true);
        }
      }
    };

    void fetchProfile();

    return (): void => {
      active = false;
    };
  }, [setProfile]);

  useEffect(() => {
    if (previewUrl === null) {
      return;
    }

    return (): void => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectAvatarFile = useCallback((file: File | null): void => {
    setSelectedFile(file);
    setPreviewUrl(file === null ? null : URL.createObjectURL(file));
  }, []);

  const saveProfile = useCallback(
    async ({ displayName, bio }: ProfileEditValues): Promise<void> => {
      setIsSubmitting(true);
      setFeedback(null);
      let profileSaved = false;

      try {
        if (
          selectedFile !== null &&
          !ProfileAvatarUploadRequestSchema.safeParse({
            contentType: selectedFile.type,
            byteSize: selectedFile.size,
          }).success
        ) {
          throw new Error(texts.avatarInvalid);
        }

        const updateResult = await getProfileService().updateProfile({
          displayName,
          bio: bio.trim() === '' ? null : bio.trim(),
        });
        const updatedProfile = getResultData(updateResult, texts.saveError);

        setProfile(updatedProfile);
        profileSaved = true;

        if (selectedFile !== null) {
          const avatarResult = await getProfileService().uploadAvatar(selectedFile);
          const avatar = getResultData(avatarResult, texts.avatarPartialError);

          if (updatedProfile.configured) {
            setProfile({ ...updatedProfile, avatar: avatar.avatar });
          }
        }

        setFeedback({ kind: 'success', message: texts.saved });
        selectAvatarFile(null);
      } catch (error: unknown) {
        getLoggerService().report(
          profileSaved ? 'profile.edit.uploadAvatar' : 'profile.edit.updateProfile',
          handleError(error),
        );
        setFeedback({
          kind: 'error',
          message: profileSaved
            ? texts.avatarPartialError
            : getErrorMessage(error, texts.saveError),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectAvatarFile, selectedFile, setProfile],
  );

  return {
    feedback,
    hasLoadedProfile,
    isSubmitting,
    profileLoadError,
    profile,
    previewUrl,
    saveProfile,
    selectAvatarFile,
  };
};
