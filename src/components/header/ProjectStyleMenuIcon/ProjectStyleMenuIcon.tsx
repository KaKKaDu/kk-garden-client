'use client';

import { useCallback, useMemo, type ReactNode, type SyntheticEvent } from 'react';
import { getLoggerService } from '@/services/logger/logger.container';
import { getThemeService } from '@/services/theme/theme.container';
import { getProjectStyleMenuIconClassName } from './project-style-menu-icon.styles';

const iconPaths = {
  profile: '/profile.svg',
  palette: '/palette.svg',
  logo: '/logo.svg',
  certificate: '/certificate.svg',
  list: '/list.svg',
} as const;

type ProjectStyleMenuIconName = keyof typeof iconPaths;

type ProjectStyleMenuIconProps = {
  className?: string;
  name: ProjectStyleMenuIconName;
};

export const ProjectStyleMenuIcon = ({ className, name }: ProjectStyleMenuIconProps): ReactNode => {
  const iconClassName: string = useMemo(
    (): string => getProjectStyleMenuIconClassName(className),
    [className],
  );
  const handleLoad = useCallback((event: SyntheticEvent<HTMLIFrameElement>): void => {
    const result = getThemeService().syncSvgAccent(event.currentTarget);
    if (!result.success) {
      getLoggerService().report('theme.syncSvgAccent', result);
    }
  }, []);

  return (
    <iframe
      aria-hidden="true"
      className={iconClassName}
      loading="eager"
      sandbox="allow-same-origin"
      src={iconPaths[name]}
      data-accent-svg=""
      onLoad={handleLoad}
      scrolling="no"
      tabIndex={-1}
      title={`${name} menu icon`}
    />
  );
};
