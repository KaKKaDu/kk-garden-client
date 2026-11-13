'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { HeaderLogoButton } from './HeaderLogoButton/HeaderLogoButton';
import { ProfileDropdown } from './ProfileDropdown/ProfileDropdown';
import { headerTexts as texts } from './texts';

export const Header = (): ReactNode => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

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
          className="fixed inset-0 z-40 bg-foreground/10 transition-opacity motion-reduce:transition-none md:hidden"
          onClick={(): void => setIsMenuOpen(false)}
          type="button"
        />
      ) : null}
      <nav
        aria-label={texts.navigationLabel}
        className={`main-menu-scroll fixed inset-y-0 left-0 z-50 w-20 overflow-x-hidden overflow-y-auto transition-colors md:bg-transparent ${isMenuOpen ? 'bg-background/95 shadow-lg' : 'bg-transparent'}`}
      >
        <div className="flex min-h-full flex-col items-center px-3 py-3">
          <div className="mt-0 flex flex-col items-center gap-4 md:my-auto">
            <HeaderLogoButton
              isMenuOpen={isMenuOpen}
              onMenuToggle={(): void => setIsMenuOpen((open) => !open)}
            />
            <ProfileDropdown isMenuOpen={isMenuOpen} isMobile={isMobile} />
          </div>
        </div>
      </nav>
    </>
  );
};
