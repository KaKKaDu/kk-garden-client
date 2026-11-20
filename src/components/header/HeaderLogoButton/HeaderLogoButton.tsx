'use client';

import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { CircleButton } from '@/components/ui/circle-button';
import { headerClassNames } from '../header.styles';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ProjectStyleMenuIcon } from '../ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { headerLogoButtonClassNames as classNames } from './header-logo-button.styles';
import { headerLogoButtonTexts as texts } from './texts';
import { cn } from '@/utils/class-names.utils';

type HeaderLogoButtonProps = {
  isActive: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
};

const LogoImage = (): ReactNode => <ProjectStyleMenuIcon className={classNames.logo} name="logo" />;

export const HeaderLogoButton = ({
  isActive,
  isMenuOpen,
  onMenuToggle,
}: HeaderLogoButtonProps): ReactNode => {
  const menuLabel: string = useMemo(
    (): string => (isMenuOpen ? texts.closeMenu : texts.openMenu),
    [isMenuOpen],
  );

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <CircleButton
              aria-expanded={isMenuOpen}
              aria-label={menuLabel}
              className={classNames.mobile}
              onClick={onMenuToggle}
              type="button"
            />
          }
        >
          <LogoImage />
        </TooltipTrigger>
        <TooltipContent align="center" side="right">
          {menuLabel}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <CircleButton
              aria-current={isActive ? 'page' : undefined}
              aria-label={texts.home}
              className={cn(
                classNames.desktop,
                isActive ? headerClassNames.activeMenuItem : undefined,
              )}
              nativeButton={false}
              render={<Link href={authRoutePaths.main} />}
            />
          }
        >
          <LogoImage />
        </TooltipTrigger>
        <TooltipContent align="center" side="right">
          {texts.home}
        </TooltipContent>
      </Tooltip>
    </>
  );
};
