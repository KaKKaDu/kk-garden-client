'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo, useState, type FocusEvent } from 'react';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ProjectStyleMenuIcon } from '@/components/header/ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import { GardenVisualisation } from '@/components/visualisation/GardenVisualisation';
import { useOwnedGarden } from '@/features/ownership/hooks/use-owned-garden';
import { useProfileStore } from '@/features/profile/store/profile.store';
import {
  assignedGardenViewClassNames as classNames,
  getProfileBioClassName,
  getProfileNameClassName,
  getProfileRevealFrameClassName,
} from './assigned-garden-view.styles';
import { assignedGardenViewTexts as texts } from './texts';

export const AssignedGardenView = (): ReactNode => {
  const { constants, error, isLoading, garden, retry } = useOwnedGarden();
  const profile = useProfileStore((state) => state.profile);
  const [isPointerOverProfile, setIsPointerOverProfile] = useState<boolean>(false);
  const [isProfileFocused, setIsProfileFocused] = useState<boolean>(false);
  const [isProfilePinned, setIsProfilePinned] = useState<boolean>(false);
  const profileName: string = useMemo(
    (): string => (profile?.configured === true ? profile.displayName : texts.defaultProfileName),
    [profile],
  );
  const avatarUrl: string | null = useMemo(
    (): string | null => profile?.avatar?.url ?? null,
    [profile?.avatar?.url],
  );
  const profileBio: string | null = useMemo(
    (): string | null => (profile?.configured === true ? (profile.bio ?? null) : null),
    [profile],
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
  const hasError: boolean = useMemo((): boolean => error !== null, [error]);
  const hasGarden: boolean = useMemo(
    (): boolean => garden !== null && constants !== null,
    [constants, garden],
  );

  const handleRetry = useCallback((): void => {
    void retry();
  }, [retry]);
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
    <section aria-label={texts.visualisationLabel} className={classNames.root}>
      {isLoading && (
        <p aria-live="polite" className={classNames.status} role="status">
          <Spinner aria-hidden="true" />
          {texts.loading}
        </p>
      )}

      {hasError && (
        <div className={classNames.alert} role="alert">
          <p>{error}</p>
          <Button onClick={handleRetry} type="button" variant="outline">
            {texts.retry}
          </Button>
        </div>
      )}

      {!isLoading && hasGarden && garden !== null && constants !== null && (
        <article aria-label={texts.certificateLabel} className={classNames.card}>
          <header className={classNames.certificate}>
            <p className={classNames.certificateLabel}>
              <ProjectStyleMenuIcon className={classNames.certificateIcon} name="certificate" />
              {texts.certificateLabel}
              <ProjectStyleMenuIcon className={classNames.certificateIcon} name="certificate" />
            </p>
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
            {profile?.lookupCode ? (
              <p className={classNames.lookupCode}>
                {texts.profileCode}: <span>{profile.lookupCode}</span>
              </p>
            ) : null}
          </header>
          <div className={classNames.visualisationFrame}>
            <GardenVisualisation
              ariaLabel={texts.visualisationLabel}
              constants={constants}
              data={garden}
              size={640}
            />
          </div>
        </article>
      )}
    </section>
  );
};
