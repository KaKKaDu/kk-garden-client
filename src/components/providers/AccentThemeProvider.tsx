'use client';

import { useEffect, type ReactElement, type ReactNode } from 'react';
import { getLoggerService } from '@/services/logger/logger.container';
import { getThemeService } from '@/services/theme/theme.container';

type AccentThemeProviderProps = {
  accentHex: string;
  children: ReactNode;
};

export const AccentThemeProvider = ({
  accentHex,
  children,
}: AccentThemeProviderProps): ReactElement => {
  useEffect((): void => {
    const result = getThemeService().setAccentColor(accentHex);

    if (!result.success) {
      getLoggerService().report('theme.setAccentColor', result);
    }
  }, [accentHex]);

  return <>{children}</>;
};
