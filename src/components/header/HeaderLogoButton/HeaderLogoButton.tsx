'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { CircleButton } from '@/components/ui/circle-button';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { headerLogoButtonClassNames as classNames } from './header-logo-button.styles';
import { headerLogoButtonTexts as texts } from './texts';

type HeaderLogoButtonProps = {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
};

const LogoImage = (): ReactNode => (
  <Image alt="" aria-hidden height={36} src="/logo.svg" width={36} />
);

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
      <CircleButton
        aria-expanded={isMenuOpen}
        aria-label={menuLabel}
        className={classNames.mobile}
        onClick={onMenuToggle}
        type="button"
      >
        <LogoImage />
      </CircleButton>
      <CircleButton
        aria-label={texts.home}
        className={classNames.desktop}
        nativeButton={false}
        render={<Link href={authRoutePaths.main} />}
      >
        <LogoImage />
      </CircleButton>
    </>
  );
};
