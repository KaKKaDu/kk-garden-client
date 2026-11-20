'use client';

import { DEFAULT_PROFILE_ACCENT_HEX } from '@kk-garden/shared/constants';
import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GoHomeButton } from '@/components/navigation/go-home-button/GoHomeButton';
import { AssignedGardenCertificateHeader } from '@/components/ownership/AssignedGardenView/certificate-header/AssignedGardenCertificateHeader';
import { AssignedGardenVisualisationPanel } from '@/components/ownership/AssignedGardenView/visualisation-panel/AssignedGardenVisualisationPanel';
import { useSharedGarden } from '@/features/ownership/hooks/use-shared-garden';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { useProfileStore } from '@/features/profile/store/profile.store';
import { getLoggerService } from '@/services/logger/logger.container';
import { getThemeService } from '@/services/theme/theme.container';
import { sharedGardenAccessClassNames as classNames } from './shared-garden-access.styles';
import { sharedGardenAccessTexts as texts } from './texts';

type SharedGardenAccessProps = {
  grantId: string;
};

export const SharedGardenAccess = ({ grantId }: SharedGardenAccessProps): ReactNode => {
  const { state, retry } = useSharedGarden(grantId);
  const viewerAccentHex = useProfileStore(
    (store) => store.profile?.accent.effectiveHex ?? DEFAULT_PROFILE_ACCENT_HEX,
  );
  const ownerAccentHex: string | null = useMemo(
    (): string | null =>
      state.status === 'success' ? state.garden.profile.accent.effectiveHex : null,
    [state],
  );

  const handleRetry = useCallback((): void => {
    void retry();
  }, [retry]);

  useEffect((): (() => void) | void => {
    if (ownerAccentHex === null) {
      return;
    }

    const themeService = getThemeService();
    const applyResult = themeService.setAccentColor(ownerAccentHex);
    if (!applyResult.success) {
      getLoggerService().report('sharing.applyOwnerAccent', applyResult);
    }

    return (): void => {
      const restoreResult = themeService.setAccentColor(viewerAccentHex);
      if (!restoreResult.success) {
        getLoggerService().report('sharing.restoreViewerAccent', restoreResult);
      }
    };
  }, [ownerAccentHex, viewerAccentHex]);

  return (
    <div className={classNames.root}>
      <div className={classNames.content}>
        <header className={classNames.header}>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={texts.returnToMain}
                  className={classNames.backButton}
                  nativeButton={false}
                  render={<Link href={authRoutePaths.main} />}
                  size="icon-lg"
                  variant="outline"
                />
              }
            >
              <ArrowLeft aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>{texts.returnToMain}</TooltipContent>
          </Tooltip>
        </header>

        <main className={classNames.main}>
          {state.status === 'loading' ? (
            <p aria-live="polite" className={classNames.status} role="status">
              <Spinner aria-hidden="true" />
              {texts.loading}
            </p>
          ) : null}

          {state.status === 'denied' ? (
            <section aria-labelledby="shared-garden-access-title" className={classNames.infoCard}>
              <h1 className={classNames.cardTitle} id="shared-garden-access-title">
                {texts.noAccessTitle}
              </h1>
              <p className={classNames.cardDescription}>{texts.noAccessDescription}</p>
              <GoHomeButton />
            </section>
          ) : null}

          {state.status === 'error' ? (
            <section
              aria-labelledby="shared-garden-error-title"
              className={classNames.errorCard}
              role="alert"
            >
              <h1 className={classNames.cardTitle} id="shared-garden-error-title">
                {texts.errorTitle}
              </h1>
              <p className={classNames.cardDescription}>{texts.errorDescription}</p>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={texts.retry}
                      className={classNames.retryButton}
                      onClick={handleRetry}
                      size="icon-lg"
                      variant="outline"
                    />
                  }
                >
                  <RefreshCw aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>{texts.retry}</TooltipContent>
              </Tooltip>
            </section>
          ) : null}

          {state.status === 'success' ? (
            <article
              aria-labelledby="assigned-garden-certificate-title"
              className={classNames.certificate}
            >
              <AssignedGardenCertificateHeader profileOverride={state.garden.profile} />
              <AssignedGardenVisualisationPanel
                constants={state.garden.constants}
                data={state.garden.garden.data}
                visualisationLabel={texts.visualisationLabel}
              />
            </article>
          ) : null}
        </main>
      </div>
    </div>
  );
};
