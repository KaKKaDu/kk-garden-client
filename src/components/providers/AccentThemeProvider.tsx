'use client';

import { DEFAULT_PROFILE_ACCENT_HEX } from '@kk-garden/shared/constants';
import { useEffect, useMemo, type ReactElement, type ReactNode } from 'react';
import { useProfileStore } from '@/features/profile/store/profile.store';
import { getLoggerService } from '@/services/logger/logger.container';
import { getThemeService } from '@/services/theme/theme.container';

type AccentThemeProviderProps = {
  children: ReactNode;
};

export const AccentThemeProvider = ({ children }: AccentThemeProviderProps): ReactElement => {
  const profileAccentHex = useProfileStore((state) => state.profile?.accent.effectiveHex ?? null);
  const accentHex: string = useMemo(
    (): string => profileAccentHex ?? DEFAULT_PROFILE_ACCENT_HEX,
    [profileAccentHex],
  );

  useEffect((): void => {
    const result = getThemeService().setAccentColor(accentHex);

    if (!result.success) {
      getLoggerService().report('theme.setAccentColor', result);
    }
  }, [accentHex]);

  return <>{children}</>;
};
