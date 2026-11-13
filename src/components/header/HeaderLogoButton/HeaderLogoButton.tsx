'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CircleButton } from '@/components/ui/circle-button';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
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
}: HeaderLogoButtonProps): ReactNode => (
  <>
    <CircleButton
      aria-expanded={isMenuOpen}
      aria-label={isMenuOpen ? texts.closeMenu : texts.openMenu}
      className="md:hidden"
      onClick={onMenuToggle}
      type="button"
    >
      <LogoImage />
    </CircleButton>
    <CircleButton
      aria-label={texts.home}
      className="hidden md:inline-grid"
      nativeButton={false}
      render={<Link href={authRoutePaths.main} />}
    >
      <LogoImage />
    </CircleButton>
  </>
);
