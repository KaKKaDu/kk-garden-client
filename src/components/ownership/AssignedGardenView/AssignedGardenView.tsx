'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { BadgeCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GardenVisualisation } from '@/components/visualisation/GardenVisualisation';
import { useOwnedGarden } from '@/features/ownership/hooks/use-owned-garden';
import { useProfileStore } from '@/features/profile/store/profile.store';
import { assignedGardenViewClassNames as classNames } from './assigned-garden-view.styles';
import { assignedGardenViewTexts as texts } from './texts';

export const AssignedGardenView = (): ReactNode => {
  const { constants, error, isLoading, garden, retry } = useOwnedGarden();
  const profile = useProfileStore((state) => state.profile);
  const profileName: string =
    profile?.configured === true ? profile.displayName : texts.defaultProfileName;
  const avatarUrl: string | null = profile?.avatar?.url ?? null;
  const hasError: boolean = useMemo((): boolean => error !== null, [error]);
  const hasGarden: boolean = useMemo(
    (): boolean => garden !== null && constants !== null,
    [constants, garden],
  );

  const handleRetry = useCallback((): void => {
    void retry();
  }, [retry]);

  return (
    <section aria-label={texts.visualisationLabel} className={classNames.root}>
      {isLoading && (
        <p aria-live="polite" className={classNames.status} role="status">
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
              <BadgeCheck aria-hidden="true" className={classNames.certificateIcon} />
              {texts.certificateLabel}
              <BadgeCheck aria-hidden="true" className={classNames.certificateIcon} />
            </p>
            <div className={classNames.avatarFrame}>
              <div className={classNames.avatar}>
                {avatarUrl !== null ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={`${profileName} profile`}
                    className={classNames.avatarImage}
                    src={avatarUrl}
                  />
                ) : (
                  <UserRound aria-hidden="true" className={classNames.avatarFallback} />
                )}
              </div>
            </div>
            <p className={classNames.ownershipStatement}>{texts.belongsTo}</p>
            <p className={classNames.profileName}>{profileName}</p>
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
