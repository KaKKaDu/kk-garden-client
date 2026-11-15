'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GardenVisualisation } from '@/components/visualisation/GardenVisualisation';
import { useAssignmentFlow } from '@/features/assignment/hooks/use-assignment-flow';
import { assignmentFlowClassNames as classNames } from './assignment-flow.styles';
import { assignmentFlowTexts as texts } from './texts';

export const AssignmentFlow = (): ReactNode => {
  const {
    constants,
    currentIndex,
    error,
    isAssigning,
    isLoading,
    isLoadingMore,
    pendingId,
    retryAction,
    selectedVisualisationId,
    visualisations,
    assignSelected,
    loadMore,
    retry,
    selectVisualisation,
    setCurrentIndex,
  } = useAssignmentFlow();

  const currentVisualisation = useMemo(
    () => visualisations[currentIndex] ?? null,
    [currentIndex, visualisations],
  );
  const hasVisualisations: boolean = useMemo(
    (): boolean => visualisations.length > 0,
    [visualisations.length],
  );
  const isCurrentSelected: boolean = useMemo(
    (): boolean => currentVisualisation?.visualisationId === selectedVisualisationId,
    [currentVisualisation?.visualisationId, selectedVisualisationId],
  );
  const canGoPrevious: boolean = useMemo((): boolean => currentIndex > 0, [currentIndex]);
  const canGoNext: boolean = useMemo(
    (): boolean => currentIndex < visualisations.length - 1,
    [currentIndex, visualisations.length],
  );
  const canRequestMore: boolean = useMemo(
    (): boolean =>
      pendingId !== null &&
      hasVisualisations &&
      selectedVisualisationId === null &&
      !isLoading &&
      !isLoadingMore &&
      !isAssigning,
    [hasVisualisations, isAssigning, isLoading, isLoadingMore, pendingId, selectedVisualisationId],
  );
  const canAssign: boolean = useMemo(
    (): boolean =>
      selectedVisualisationId !== null &&
      pendingId !== null &&
      !isLoading &&
      !isLoadingMore &&
      !isAssigning,
    [isAssigning, isLoading, isLoadingMore, pendingId, selectedVisualisationId],
  );
  const slideLabel: string = useMemo(
    (): string => texts.slideLabel(String(currentIndex + 1), String(visualisations.length)),
    [currentIndex, visualisations.length],
  );
  const slidePositionLabel: string = useMemo(
    (): string => (isCurrentSelected ? `${texts.selected} · ${slideLabel}` : slideLabel),
    [isCurrentSelected, slideLabel],
  );
  const hasError: boolean = useMemo((): boolean => error !== null, [error]);

  const handlePrevious = useCallback((): void => {
    setCurrentIndex((index: number): number => Math.max(0, index - 1));
  }, [setCurrentIndex]);
  const handleNext = useCallback((): void => {
    setCurrentIndex((index: number): number => Math.min(visualisations.length - 1, index + 1));
  }, [setCurrentIndex, visualisations.length]);
  const handleSelect = useCallback((): void => {
    if (currentVisualisation !== null) {
      selectVisualisation(currentVisualisation.visualisationId);
    }
  }, [currentVisualisation, selectVisualisation]);
  const handleLoadMore = useCallback((): void => {
    void loadMore();
  }, [loadMore]);
  const handleAssign = useCallback((): void => {
    void assignSelected();
  }, [assignSelected]);
  const handleRetry = useCallback((): void => {
    void retry();
  }, [retry]);

  return (
    <section aria-labelledby="assignment-title" className={classNames.root}>
      <header className={classNames.header}>
        <p className={classNames.eyebrow}>{texts.eyebrow}</p>
        <h1 className={classNames.title} id="assignment-title">
          {texts.title}
        </h1>
        <p className={classNames.description}>{texts.description}</p>
      </header>

      {hasError && (
        <div className={classNames.alert} role="alert">
          <p>{error}</p>
          {retryAction !== null && (
            <Button
              disabled={isLoading || isLoadingMore || isAssigning}
              onClick={handleRetry}
              type="button"
              variant="outline"
            >
              {texts.retry}
            </Button>
          )}
        </div>
      )}

      {isLoading && (
        <p aria-live="polite" className={classNames.status} role="status">
          {texts.loading}
        </p>
      )}

      {!isLoading && hasVisualisations && currentVisualisation !== null && constants !== null && (
        <>
          <div
            aria-label={texts.carouselLabel}
            aria-roledescription="carousel"
            className={classNames.carousel}
          >
            <div
              aria-label={slideLabel}
              aria-roledescription="slide"
              className={classNames.slide}
              role="group"
            >
              <div className={classNames.visualisationFrame}>
                <GardenVisualisation
                  ariaLabel={texts.visualisationLabel(String(currentIndex + 1))}
                  constants={constants}
                  data={currentVisualisation}
                  size={512}
                />
              </div>
            </div>

            <div className={classNames.belowViewControls}>
              <div
                aria-label={texts.navigationLabel}
                className={classNames.slideControls}
                role="group"
              >
                <Button
                  aria-label={texts.previous}
                  disabled={!canGoPrevious || isAssigning || isCurrentSelected}
                  onClick={handlePrevious}
                  size="icon-lg"
                  type="button"
                  variant="outline"
                >
                  <ChevronLeft aria-hidden="true" />
                </Button>
                <p
                  className={
                    isCurrentSelected ? classNames.slidePositionSelected : classNames.slidePosition
                  }
                >
                  {slidePositionLabel}
                </p>
                <Button
                  aria-label={texts.next}
                  disabled={!canGoNext || isAssigning || isCurrentSelected}
                  onClick={handleNext}
                  size="icon-lg"
                  type="button"
                  variant="outline"
                >
                  <ChevronRight aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className={classNames.iconActions}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={texts.loadMore}
                      className={classNames.iconButton}
                      disabled={!canRequestMore}
                      onClick={handleLoadMore}
                      size="icon-lg"
                      type="button"
                      variant="outline"
                    >
                      <Plus aria-hidden="true" className={classNames.actionIcon} />
                    </Button>
                  }
                />
                <TooltipContent>{texts.loadMoreTooltip}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={isCurrentSelected ? texts.selected : texts.select}
                      aria-pressed={isCurrentSelected}
                      className={classNames.iconButton}
                      disabled={isAssigning || isCurrentSelected}
                      onClick={handleSelect}
                      size="icon-lg"
                      type="button"
                      variant="default"
                    >
                      <Check aria-hidden="true" className={classNames.actionIcon} />
                    </Button>
                  }
                />
                <TooltipContent>
                  {isCurrentSelected ? texts.selectedTooltip : texts.selectTooltip}
                </TooltipContent>
              </Tooltip>
            </div>

            <div className={classNames.confirmationPanel}>
              <p aria-live="polite" className={classNames.actionsStatus} role="status">
                {isLoadingMore
                  ? texts.loadingMore
                  : selectedVisualisationId !== null
                    ? texts.selectionReady
                    : texts.selectionPrompt}
              </p>
              <Button disabled={!canAssign} onClick={handleAssign} type="button">
                {isAssigning ? texts.assigning : texts.confirmAssignment}
              </Button>
            </div>
          </div>
        </>
      )}

      {!isLoading && !hasVisualisations && !hasError && (
        <p aria-live="polite" className={classNames.status} role="status">
          {texts.empty}
        </p>
      )}
    </section>
  );
};
