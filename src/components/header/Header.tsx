'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AccentColorPickerButton } from './AccentColorPickerButton/AccentColorPickerButton';
import { HeaderLogoButton } from './HeaderLogoButton/HeaderLogoButton';
import { ProfileDropdown } from './ProfileDropdown/ProfileDropdown';
import { getHeaderNavClassName, headerClassNames } from './header.styles';
import { headerTexts as texts } from './texts';

export const Header = (): ReactNode => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const navClassName: string = useMemo(
    (): string => getHeaderNavClassName(isMenuOpen),
    [isMenuOpen],
  );
  const handleCloseMenu = useCallback((): void => setIsMenuOpen(false), []);
  const handleMenuToggle = useCallback((): void => setIsMenuOpen((open) => !open), []);

  useEffect((): (() => void) => {
    const mediaQuery: MediaQueryList = window.matchMedia('(max-width: 767px)');
    const updateViewport = (): void => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return (): void => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  return (
    <>
      {isMenuOpen ? (
        <button
          aria-label={texts.closeMenu}
          className={headerClassNames.backdrop}
          onClick={handleCloseMenu}
          type="button"
        />
      ) : null}
      <nav aria-label={texts.navigationLabel} className={navClassName}>
        <div className={headerClassNames.content}>
          <div className={headerClassNames.menu}>
            <HeaderLogoButton isMenuOpen={isMenuOpen} onMenuToggle={handleMenuToggle} />
            <AccentColorPickerButton isMenuOpen={isMenuOpen} isMobile={isMobile} />
            <ProfileDropdown isMenuOpen={isMenuOpen} isMobile={isMobile} />
          </div>
        </div>
      </nav>
    </>
  );
};
