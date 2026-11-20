'use client';

import type { GardenDrawDataDto, GardenGridConstantsDto } from '@kk-garden/shared/types';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GardenVisualisation } from '@/components/visualisation/GardenVisualisation';
import { assignedGardenVisualisationPanelClassNames as classNames } from './assigned-garden-visualisation-panel.styles';
import { assignedGardenVisualisationPanelTexts as texts } from './texts';

const zoomLoadingDurationMs: number = 1000;

type AssignedGardenVisualisationPanelProps = {
  constants: GardenGridConstantsDto;
  data: GardenDrawDataDto;
  visualisationLabel: string;
};

export const AssignedGardenVisualisationPanel = ({
  constants,
  data,
  visualisationLabel,
}: AssignedGardenVisualisationPanelProps): ReactNode => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isZoomLoading, setIsZoomLoading] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpen = useCallback((): void => {
    setIsExpanded(true);
    setIsZoomLoading(true);
  }, [setIsExpanded, setIsZoomLoading]);
  const handleClose = useCallback((): void => {
    dialogRef.current?.close();
  }, []);
  const handleDialogClose = useCallback((): void => {
    setIsExpanded(false);
  }, [setIsExpanded]);

  useEffect((): void => {
    const dialog = dialogRef.current;
    if (isExpanded && dialog !== null && !dialog.open) {
      dialog.showModal();
    }
  }, [isExpanded]);

  useEffect((): (() => void) | void => {
    if (!isExpanded || !isZoomLoading) {
      return;
    }

    const timeoutId: number = window.setTimeout((): void => {
      setIsZoomLoading(false);
    }, zoomLoadingDurationMs);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, [isExpanded, isZoomLoading, setIsZoomLoading]);

  return (
    <>
      <div className={classNames.visualisationFrame}>
        <GardenVisualisation
          ariaLabel={visualisationLabel}
          constants={constants}
          data={data}
          size={640}
        />
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                aria-expanded={isExpanded}
                aria-haspopup="dialog"
                aria-label={texts.expandVisualisation}
                className={classNames.expandVisualisationButton}
                onClick={handleOpen}
                type="button"
              />
            }
          >
            <span aria-hidden="true" className={classNames.expandIcon}>
              <Expand className={classNames.expandIconGlyph} />
            </span>
          </TooltipTrigger>
          <TooltipContent>{texts.expandVisualisation}</TooltipContent>
        </Tooltip>
      </div>
      {isExpanded ? (
        <dialog
          aria-labelledby="expanded-garden-visualisation-title"
          className={classNames.expandedDialog}
          onClose={handleDialogClose}
          ref={dialogRef}
        >
          <div className={classNames.expandedDialogContent}>
            <h2 className="sr-only" id="expanded-garden-visualisation-title">
              {texts.expandedVisualisationTitle}
            </h2>
            <Button
              aria-label={texts.closeExpandedVisualisation}
              className={classNames.expandedCloseButton}
              onClick={handleClose}
              size="icon-lg"
              type="button"
              variant="outline"
            >
              <X aria-hidden="true" />
            </Button>
            <div className={classNames.expandedVisualisationFrame}>
              <div aria-hidden={isZoomLoading} className={classNames.expandedVisualisation}>
                <GardenVisualisation
                  ariaLabel={visualisationLabel}
                  constants={constants}
                  data={data}
                  size={1200}
                />
              </div>
              {isZoomLoading ? (
                <div aria-live="polite" className={classNames.expandedLoading} role="status">
                  <Spinner aria-hidden="true" className={classNames.expandedLoadingSpinner} />
                  <span className="sr-only">{texts.loadingExpandedVisualisation}</span>
                </div>
              ) : null}
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
};
