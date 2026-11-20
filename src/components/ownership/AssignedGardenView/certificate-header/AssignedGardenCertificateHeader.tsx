'use client';

import type { ReactNode, FocusEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { GardenProfileResponse } from '@kk-garden/shared/schemas';
import { UserRound } from 'lucide-react';
import { ProjectStyleMenuIcon } from '@/components/header/ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import { useProfileStore } from '@/features/profile/store/profile.store';
import {
  assignedGardenCertificateHeaderClassNames as classNames,
  getProfileBioClassName,
  getProfileNameClassName,
  getProfileRevealFrameClassName,
} from './assigned-garden-certificate-header.styles';
import { assignedGardenCertificateHeaderTexts as texts } from './texts';

type AssignedGardenCertificateHeaderProps = {
  profileOverride?: GardenProfileResponse;
};

export const AssignedGardenCertificateHeader = ({
  profileOverride,
}: AssignedGardenCertificateHeaderProps): ReactNode => {
  const signedInProfile = useProfileStore((state) => state.profile);
  const [isPointerOverProfile, setIsPointerOverProfile] = useState<boolean>(false);
  const [isProfileFocused, setIsProfileFocused] = useState<boolean>(false);
  const [isProfilePinned, setIsProfilePinned] = useState<boolean>(false);
  const profileName: string = useMemo(
    (): string =>
      profileOverride?.displayName ??
      (signedInProfile?.configured === true
        ? signedInProfile.displayName
        : texts.defaultProfileName),
    [profileOverride?.displayName, signedInProfile],
  );
  const avatarUrl: string | null = useMemo(
    (): string | null =>
      profileOverride !== undefined
        ? (profileOverride.avatar?.url ?? null)
        : (signedInProfile?.avatar?.url ?? null),
    [profileOverride, signedInProfile?.avatar?.url],
  );
  const profileBio: string | null = useMemo(
    (): string | null =>
      profileOverride !== undefined
        ? (profileOverride.bio ?? null)
        : signedInProfile?.configured === true
          ? (signedInProfile.bio ?? null)
          : null,
    [profileOverride, signedInProfile],
  );
  const isProfileExpanded: boolean = useMemo(
    (): boolean => isPointerOverProfile || isProfileFocused || isProfilePinned,
    [isPointerOverProfile, isProfileFocused, isProfilePinned],
  );
  const profileRevealFrameClassName: string = useMemo(
    (): string => getProfileRevealFrameClassName(isProfileExpanded),
    [isProfileExpanded],
  );
  const profileNameClassName: string = useMemo(
    (): string => getProfileNameClassName(isProfileExpanded),
    [isProfileExpanded],
  );
  const profileBioClassName: string = useMemo(
    (): string => getProfileBioClassName(isProfileExpanded),
    [isProfileExpanded],
  );

  const handleProfilePointerEnter = useCallback((): void => {
    setIsPointerOverProfile(true);
  }, [setIsPointerOverProfile]);
  const handleProfilePointerLeave = useCallback((): void => {
    setIsPointerOverProfile(false);
  }, [setIsPointerOverProfile]);
  const handleProfileFocus = useCallback((): void => {
    setIsProfileFocused(true);
  }, [setIsProfileFocused]);
  const handleProfileBlur = useCallback(
    (event: FocusEvent<HTMLButtonElement>): void => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setIsProfileFocused(false);
      }
    },
    [setIsProfileFocused],
  );
  const handleProfileToggle = useCallback((): void => {
    setIsProfilePinned((isPinned: boolean): boolean => !isPinned);
  }, [setIsProfilePinned]);

  return (
    <header className={classNames.root}>
      <h2 className={classNames.title} id="assigned-garden-certificate-title">
        <ProjectStyleMenuIcon className={classNames.certificateIcon} name="certificate" />
        {texts.certificateLabel}
        <ProjectStyleMenuIcon className={classNames.certificateIcon} name="certificate" />
      </h2>
      <button
        aria-controls={profileBio !== null ? 'assigned-garden-profile-bio' : undefined}
        aria-expanded={isProfileExpanded}
        className={classNames.profileRevealButton}
        onBlur={handleProfileBlur}
        onClick={handleProfileToggle}
        onFocus={handleProfileFocus}
        onPointerEnter={handleProfilePointerEnter}
        onPointerLeave={handleProfilePointerLeave}
        type="button"
      >
        <span className={profileRevealFrameClassName}>
          <span className={classNames.avatar}>
            {avatarUrl !== null ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className={classNames.avatarImage} src={avatarUrl} />
            ) : (
              <UserRound aria-hidden="true" className={classNames.avatarFallback} />
            )}
          </span>
        </span>
        <span className={classNames.ownershipStatement}>{texts.belongsTo}</span>
        <span className={profileNameClassName}>{profileName}</span>
      </button>
      {profileBio !== null ? (
        <blockquote
          aria-hidden={!isProfileExpanded}
          className={profileBioClassName}
          id="assigned-garden-profile-bio"
        >
          {profileBio}
        </blockquote>
      ) : null}
      {profileOverride === undefined && signedInProfile?.lookupCode ? (
        <p className={classNames.lookupCode}>
          {texts.profileCode}: <span>{signedInProfile.lookupCode}</span>
        </p>
      ) : null}
    </header>
  );
};
