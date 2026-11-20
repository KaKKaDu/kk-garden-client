'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { approvalRoutePaths } from '@/features/approvals/constants/approval-route.constants';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { profileRoutePaths } from '@/features/profile/constants/profile-route.constants';
import { AccentColorPickerButton } from './AccentColorPickerButton/AccentColorPickerButton';
import { GardenSharingButton } from './GardenSharingButton/GardenSharingButton';
import { HeaderLogoButton } from './HeaderLogoButton/HeaderLogoButton';
import { ProfileDropdown } from './ProfileDropdown/ProfileDropdown';
import { getHeaderNavClassName, headerClassNames } from './header.styles';
import { headerTexts as texts } from './texts';

const isPathActive = (pathname: string, routePath: string): boolean =>
  routePath === '/'
    ? pathname === routePath
    : pathname === routePath || pathname.startsWith(`${routePath}/`);

export const Header = (): ReactNode => {
  const pathname: string = usePathname() ?? '';
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const isHomeActive: boolean = useMemo(
    (): boolean => isPathActive(pathname, authRoutePaths.main),
    [pathname],
  );
  const isApprovalsActive: boolean = useMemo(
    (): boolean => isPathActive(pathname, approvalRoutePaths.page),
    [pathname],
  );
  const isProfileActive: boolean = useMemo(
    (): boolean => isPathActive(pathname, profileRoutePaths.edit),
    [pathname],
  );
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
            <HeaderLogoButton
              isActive={isHomeActive}
              isMenuOpen={isMenuOpen}
              onMenuToggle={handleMenuToggle}
            />
            <GardenSharingButton
              isActive={isApprovalsActive}
              isMenuOpen={isMenuOpen}
              isMobile={isMobile}
              onNavigate={handleCloseMenu}
            />
            <AccentColorPickerButton isMenuOpen={isMenuOpen} isMobile={isMobile} />
            <ProfileDropdown
              isActive={isProfileActive}
              isMenuOpen={isMenuOpen}
              isMobile={isMobile}
            />
          </div>
        </div>
      </nav>
    </>
  );
};
