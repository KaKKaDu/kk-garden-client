'use client';

import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { CircleButton } from '@/components/ui/circle-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ProjectStyleMenuIcon } from '../ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { headerLogoButtonClassNames as classNames } from './header-logo-button.styles';
import { headerLogoButtonTexts as texts } from './texts';

type HeaderLogoButtonProps = {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
};

const LogoImage = (): ReactNode => <ProjectStyleMenuIcon className={classNames.logo} name="logo" />;

export const HeaderLogoButton = ({
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
              aria-label={texts.home}
              className={classNames.desktop}
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
