'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { GardenDrawDataDto, GardenGridConstantsDto } from '@kk-garden/shared/types';
import { GridConstants } from '@kk-garden/shared/constants';
import { gardenDrawDataTransformer } from '@kk-garden/shared/transformers';
import { GardenPlugin } from '@/lib/canvas-layer/garden-plugin/garden-plugin';
import { cn } from '@/utils/class-names.utils';
import { gardenVisualisationClassNames as classNames } from './garden-visualisation.styles';

export type GardenVisualisationProps = {
  ariaLabel?: string;
  className?: string;
  constants: GardenGridConstantsDto;
  data: GardenDrawDataDto;
  size?: number;
};

export const GardenVisualisation = ({
  ariaLabel = 'Garden visualisation',
  className,
  constants,
  data,
  size = 512,
}: GardenVisualisationProps): ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRenderError, setHasRenderError] = useState<boolean>(false);

  useEffect((): (() => void) | void => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setHasRenderError(false);

    let isDisposed: boolean = false;
    let plugin: GardenPlugin | null = null;
    let seed: number | null = null;

    const reportError = (error: unknown): void => {
      console.error('Failed to render garden visualisation.', error);
      if (!isDisposed) {
        setHasRenderError(true);
      }
    };

    try {
      const drawData = gardenDrawDataTransformer.fromDto(data);
      if (!drawData) {
        throw new Error('Garden visualisation data could not be transformed.');
      }

      plugin = new GardenPlugin(
        size,
        GridConstants.fromDto(constants.gridConstants),
        GridConstants.fromDto(constants.largeGridConstants),
      );
      seed = plugin.init(container);

      void plugin
        .draw(seed, drawData)
        .then(async (): Promise<void> => {
          if (isDisposed && plugin !== null && seed !== null) {
            await plugin.terminate(seed);
          }
        })
        .catch(reportError);
    } catch (error: unknown) {
      reportError(error);
    }

    return (): void => {
      isDisposed = true;
      if (plugin !== null && seed !== null) {
        void plugin.terminate(seed).catch((error: unknown): void => {
          console.error('Failed to clean up garden visualisation.', error);
        });
      }
    };
  }, [constants, data, size]);

  return (
    <div
      aria-label={hasRenderError ? undefined : ariaLabel}
      className={cn(classNames.root, className)}
      ref={containerRef}
      role={hasRenderError ? undefined : 'img'}
      style={{ maxWidth: size }}
    >
      {hasRenderError && (
        <p className={classNames.error} role="alert">
          This garden visualisation could not be displayed.
        </p>
      )}
    </div>
  );
};
