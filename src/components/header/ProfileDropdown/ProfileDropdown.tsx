'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Check, Copy, LogOut, Pencil, UserRound } from 'lucide-react';
import { CircleButton } from '@/components/ui/circle-button';
import { Spinner } from '@/components/ui/spinner';
import { ProjectStyleMenuIcon } from '../ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getAuthOperationErrorMessage } from '@/features/auth/utils/auth-result.utils';
import { profileRoutePaths } from '@/features/profile/constants/profile-route.constants';
import { useCopyLookupCode } from '@/features/profile/hooks/use-copy-lookup-code/use-copy-lookup-code';
import { useProfileStore } from '@/features/profile/store/profile.store';
import { getProfileService } from '@/services/profile/profile.container';
import type { ProfileResult } from '@/services/profile/profile.types';
import {
  getProfileDropdownTriggerClassName,
  profileDropdownClassNames as classNames,
} from './profile-dropdown.styles';
import { headerProfileDropdownTexts as texts } from './texts';

type ProfileDropdownProps = {
  isActive: boolean;
  isMenuOpen: boolean;
  isMobile: boolean | null;
};

export const ProfileDropdown = ({
  isActive,
  isMenuOpen,
  isMobile,
}: ProfileDropdownProps): ReactNode => {
  const { signOut } = useAuth();
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  useEffect((): (() => void) => {
    let active: boolean = true;

    const fetchProfile = async (): Promise<void> => {
      const result: ProfileResult = await getProfileService().getProfile();
      if (!active) {
        return;
      }

      if (!result.success) {
        setProfileError(result.errors[0]?.message ?? texts.profileError);
      } else if (result.data === undefined) {
        setProfileError(texts.profileError);
      } else {
        setProfileError(null);
        setProfile(result.data);
      }
    };

    void fetchProfile();

    return (): void => {
      active = false;
    };
  }, [setProfile]);

  const profileName: string = useMemo(
    (): string => (profile?.configured === true ? profile.displayName : texts.account),
    [profile],
  );
  const avatarUrl: string | null = useMemo(
    (): string | null => profile?.avatar?.url ?? null,
    [profile?.avatar?.url],
  );
  const lookupCode: string | null = useMemo(
    (): string | null => profile?.lookupCode ?? null,
    [profile?.lookupCode],
  );
  const { copyLookupCode, status: lookupCodeCopyStatus } = useCopyLookupCode(lookupCode);
  const isMobileMenuClosed: boolean = useMemo(
    (): boolean => isMobile !== false && !isMenuOpen,
    [isMenuOpen, isMobile],
  );
  const triggerClassName: string = useMemo(
    (): string => getProfileDropdownTriggerClassName(isMenuOpen, isActive),
    [isActive, isMenuOpen],
  );
  const hasLookupCode: boolean = useMemo((): boolean => lookupCode !== null, [lookupCode]);
  const isLookupCodeCopied: boolean = useMemo(
    (): boolean => lookupCodeCopyStatus === 'copied',
    [lookupCodeCopyStatus],
  );
  const alertMessage: string | null = useMemo(
    (): string | null =>
      profileError ??
      logoutError ??
      (lookupCodeCopyStatus === 'error' ? texts.lookupCodeCopyError : null),
    [logoutError, lookupCodeCopyStatus, profileError],
  );
  const copiedLabel: string = useMemo(
    (): string => (isLookupCodeCopied ? texts.lookupCodeCopied : texts.copyLookupCode),
    [isLookupCodeCopied],
  );
  const signOutLabel: string = useMemo(
    (): string => (isSigningOut ? texts.signingOut : texts.logout),
    [isSigningOut],
  );
  const signOutIcon: ReactNode = useMemo(
    (): ReactNode =>
      isSigningOut ? (
        <Spinner aria-hidden="true" className={classNames.icon} />
      ) : (
        <LogOut aria-hidden="true" className={classNames.icon} />
      ),
    [isSigningOut],
  );
  const handleSignOut = useCallback(async (): Promise<void> => {
    setIsSigningOut(true);
    setLogoutError(null);

    try {
      const result = await signOut();
      const errorMessage = getAuthOperationErrorMessage(result, texts.logoutError);

      if (errorMessage !== null) {
        setLogoutError(errorMessage);
        return;
      }

      setProfile(null);
      window.location.assign(authRoutePaths.signIn);
    } catch (error: unknown) {
      setLogoutError(error instanceof Error ? error.message : texts.logoutError);
    } finally {
      setIsSigningOut(false);
    }
  }, [setProfile, signOut]);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              aria-label={texts.openProfileMenu}
              aria-hidden={isMobileMenuClosed}
              className={triggerClassName}
              render={<CircleButton />}
              tabIndex={isMobileMenuClosed ? -1 : 0}
            />
          }
        >
          <ProjectStyleMenuIcon className={classNames.profileIcon} name="profile" />
        </TooltipTrigger>
        <TooltipContent align="center" side="right">
          {texts.openProfileMenu}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" side="right" sideOffset={12}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className={classNames.profileHeader}>
            <span aria-hidden="true" className={classNames.avatarFrame}>
              <span className={classNames.avatar}>
                {avatarUrl !== null ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className={classNames.avatarImage} src={avatarUrl} />
                ) : (
                  <UserRound aria-hidden="true" className={classNames.avatarFallback} />
                )}
              </span>
            </span>
            <span className={classNames.profileName}>{texts.profile}</span>
            <span className={classNames.profileLabel}>{profileName}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {alertMessage !== null ? (
          <p className={classNames.alert} role="alert">
            {alertMessage}
          </p>
        ) : null}
        {hasLookupCode ? (
          <DropdownMenuItem
            aria-label={copiedLabel}
            className={classNames.lookupCodeAction}
            onClick={copyLookupCode}
          >
            <span className={classNames.lookupCode}>{lookupCode}</span>
            {isLookupCodeCopied ? (
              <Check aria-hidden="true" className={classNames.icon} />
            ) : (
              <Copy aria-hidden="true" className={classNames.icon} />
            )}
          </DropdownMenuItem>
        ) : null}
        {hasLookupCode ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem
          aria-current={isActive ? 'page' : undefined}
          render={<Link href={profileRoutePaths.edit} />}
        >
          <Pencil aria-hidden="true" className={classNames.icon} />
          {texts.editProfile}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isSigningOut} onClick={handleSignOut}>
          {signOutIcon}
          {signOutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
