'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Check, Copy, LogOut, Pencil, UserRound } from 'lucide-react';
import { CircleButton } from '@/components/ui/circle-button';
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
import { headerProfileDropdownTexts as texts } from './texts';

type ProfileDropdownProps = {
  isMenuOpen: boolean;
  isMobile: boolean | null;
};

export const ProfileDropdown = ({ isMenuOpen, isMobile }: ProfileDropdownProps): ReactNode => {
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

  const handleSignOut = async (): Promise<void> => {
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
  };

  const profileName: string = profile?.configured === true ? profile.displayName : texts.account;
  const lookupCode: string | null = profile?.lookupCode ?? null;
  const { copyLookupCode, status: lookupCodeCopyStatus } = useCopyLookupCode(lookupCode);
  const avatarUrl: string | null = profile?.avatar?.url ?? null;
  const isMobileMenuClosed: boolean = isMobile !== false && !isMenuOpen;
  const triggerClassName: string = `aspect-square overflow-hidden transition-[transform,opacity,box-shadow,border-color] duration-200 md:pointer-events-auto md:translate-x-0 md:opacity-100 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0 pointer-events-none'}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={texts.openProfileMenu}
        aria-hidden={isMobileMenuClosed}
        className={triggerClassName}
        render={<CircleButton />}
        tabIndex={isMobileMenuClosed ? -1 : 0}
      >
        {avatarUrl ? (
          <span className="relative block aspect-square size-full overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="absolute inset-0 block h-full w-full object-cover"
              src={avatarUrl}
            />
          </span>
        ) : (
          <UserRound aria-hidden="true" className="size-8 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block font-semibold">{texts.profile}</span>
            <span className="mt-0.5 block max-w-56 truncate text-xs font-normal text-muted-foreground">
              {profileName}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {profileError || logoutError || lookupCodeCopyStatus === 'error' ? (
          <p className="px-2.5 py-2 text-xs text-destructive" role="alert">
            {profileError ??
              logoutError ??
              (lookupCodeCopyStatus === 'error' ? texts.lookupCodeCopyError : null)}
          </p>
        ) : null}
        {lookupCode ? (
          <DropdownMenuItem
            aria-label={
              lookupCodeCopyStatus === 'copied' ? texts.lookupCodeCopied : texts.copyLookupCode
            }
            className="justify-between"
            onClick={copyLookupCode}
          >
            <span className="min-w-0 truncate font-mono text-xs">{lookupCode}</span>
            {lookupCodeCopyStatus === 'copied' ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
          </DropdownMenuItem>
        ) : null}
        {lookupCode ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem render={<Link href={profileRoutePaths.edit} />}>
          <Pencil aria-hidden="true" className="size-4" />
          {texts.editProfile}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isSigningOut} onClick={handleSignOut}>
          {isSigningOut ? (
            <UserRound aria-hidden="true" className="size-4" />
          ) : (
            <LogOut aria-hidden="true" className="size-4" />
          )}
          {isSigningOut ? texts.signingOut : texts.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
