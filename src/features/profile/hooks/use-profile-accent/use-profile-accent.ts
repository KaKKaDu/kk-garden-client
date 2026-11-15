'use client';

import { DEFAULT_PROFILE_ACCENT_HEX } from '@kk-garden/shared/constants';
import { handleError } from '@kk-garden/shared/errors';
import { useCallback, useMemo, useState } from 'react';
import { useProfileStore } from '@/features/profile/store/profile.store';
import { getLoggerService } from '@/services/logger/logger.container';
import { getProfileService } from '@/services/profile/profile.container';
import { getThemeService } from '@/services/theme/theme.container';
import type { ProfileUpdateResult } from '@/services/profile/profile.types';
import { profileAccentTexts as texts } from './texts';

type ProfileAccentFeedback = {
  kind: 'error' | 'success';
  message: string;
};

type AccentPreview = {
  baseHex: string;
  previewHex: string;
};

type UseProfileAccentResult = {
  accentHex: string;
  feedback: ProfileAccentFeedback | null;
  hasChanges: boolean;
  hasCustomAccent: boolean;
  isConfigured: boolean;
  isSaving: boolean;
  previewAccent: (accentHex: string) => void;
  resetPreview: () => void;
  resetAccent: () => Promise<boolean>;
  saveAccent: () => Promise<boolean>;
};

const getErrorMessage = (error: unknown, fallbackMessage: string): string =>
  error instanceof Error ? error.message : fallbackMessage;

export const useProfileAccent = (): UseProfileAccentResult => {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const currentAccentHex: string = useMemo(
    (): string => profile?.accent.effectiveHex ?? DEFAULT_PROFILE_ACCENT_HEX,
    [profile?.accent.effectiveHex],
  );
  const [preview, setPreview] = useState<AccentPreview | null>(null);
  const accentHex: string = useMemo(
    (): string => (preview?.baseHex === currentAccentHex ? preview.previewHex : currentAccentHex),
    [currentAccentHex, preview],
  );
  const isConfigured: boolean = useMemo(
    (): boolean => profile?.configured === true,
    [profile?.configured],
  );
  const hasCustomAccent: boolean = useMemo(
    (): boolean => profile?.accent.customHex !== undefined,
    [profile?.accent.customHex],
  );
  const hasChanges: boolean = useMemo(
    (): boolean => accentHex.toLowerCase() !== currentAccentHex.toLowerCase(),
    [accentHex, currentAccentHex],
  );
  const [feedback, setFeedback] = useState<ProfileAccentFeedback | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const previewAccent = useCallback(
    (nextAccentHex: string): void => {
      setPreview({ baseHex: currentAccentHex, previewHex: nextAccentHex });
      setFeedback(null);

      const result = getThemeService().setAccentColor(nextAccentHex);
      if (!result.success) {
        getLoggerService().report('profile.accent.preview', result);
        setFeedback({ kind: 'error', message: texts.previewError });
      }
    },
    [currentAccentHex, setFeedback, setPreview],
  );

  const resetPreview = useCallback((): void => {
    setPreview(null);
    setFeedback(null);

    const result = getThemeService().setAccentColor(currentAccentHex);
    if (!result.success) {
      getLoggerService().report('profile.accent.resetPreview', result);
      setFeedback({ kind: 'error', message: texts.previewError });
    }
  }, [currentAccentHex, setFeedback, setPreview]);

  const persistAccent = useCallback(
    async (nextAccentHex: string | null): Promise<boolean> => {
      if (!isConfigured) {
        setFeedback({ kind: 'error', message: texts.profileRequired });
        return false;
      }

      setIsSaving(true);
      setFeedback(null);

      try {
        const result: ProfileUpdateResult = await getProfileService().updateProfile({
          accentHex: nextAccentHex,
        });

        if (!result.success) {
          const message: string = result.errors[0]?.message ?? texts.saveError;
          getLoggerService().report('profile.accent.save', result);
          setFeedback({ kind: 'error', message });
          return false;
        }

        if (result.data === undefined) {
          throw new Error(texts.saveError);
        }

        setProfile(result.data);
        setPreview(null);
        setFeedback({ kind: 'success', message: texts.saved });
        return true;
      } catch (error: unknown) {
        getLoggerService().report('profile.accent.save', handleError(error));
        setFeedback({ kind: 'error', message: getErrorMessage(error, texts.saveError) });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isConfigured, setFeedback, setIsSaving, setPreview, setProfile],
  );

  const saveAccent = useCallback(
    (): Promise<boolean> => persistAccent(accentHex),
    [accentHex, persistAccent],
  );
  const resetAccent = useCallback((): Promise<boolean> => persistAccent(null), [persistAccent]);

  return useMemo<UseProfileAccentResult>(
    () => ({
      accentHex,
      feedback,
      hasChanges,
      hasCustomAccent,
      isConfigured,
      isSaving,
      previewAccent,
      resetPreview,
      resetAccent,
      saveAccent,
    }),
    [
      accentHex,
      feedback,
      hasChanges,
      hasCustomAccent,
      isConfigured,
      isSaving,
      previewAccent,
      resetPreview,
      resetAccent,
      saveAccent,
    ],
  );
};
