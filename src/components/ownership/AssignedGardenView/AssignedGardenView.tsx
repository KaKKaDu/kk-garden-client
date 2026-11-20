'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useOwnedGarden } from '@/features/ownership/hooks/use-owned-garden';
import { AssignedGardenCertificateHeader } from './certificate-header/AssignedGardenCertificateHeader';
import { AssignedGardenVisualisationPanel } from './visualisation-panel/AssignedGardenVisualisationPanel';
import { assignedGardenViewClassNames as classNames } from './assigned-garden-view.styles';
import { assignedGardenViewTexts as texts } from './texts';

export const AssignedGardenView = (): ReactNode => {
  const { constants, error, isLoading, garden, retry } = useOwnedGarden();
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
        <article aria-labelledby="assigned-garden-certificate-title" className={classNames.card}>
          <AssignedGardenCertificateHeader />
          <AssignedGardenVisualisationPanel
            constants={constants}
            data={garden}
            visualisationLabel={texts.visualisationLabel}
          />
        </article>
      )}
    </section>
  );
};
