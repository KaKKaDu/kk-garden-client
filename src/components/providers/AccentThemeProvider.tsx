'use client';

import { useEffect, type ReactElement, type ReactNode } from 'react';
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
    getThemeService().setAccentColor(accentHex);
  }, [accentHex]);

  return <>{children}</>;
};
