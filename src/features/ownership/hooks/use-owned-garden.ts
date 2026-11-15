'use client';

import { handleError } from '@kk-garden/shared/errors';
import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type { GenerateRootResponse } from '@kk-garden/shared/schemas';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getLoggerService } from '@/services/logger/logger.container';
import { getOwnedGardenService } from '@/services/owned-garden/owned-garden.container';

type OwnedGardenVisualisation = GenerateRootResponse['generations'][number];

export type UseOwnedGardenResult = {
  constants: GenerateRootResponse['constants'] | null;
  error: string | null;
  isLoading: boolean;
  garden: OwnedGardenVisualisation | null;
  retry: () => Promise<void>;
};

const loadErrorMessage: string = 'Could not load your garden. Please try again.';
const invalidResponseMessage: string = 'The garden response did not contain exactly one garden.';

export const useOwnedGarden = (): UseOwnedGardenResult => {
  const [constants, setConstants] = useState<GenerateRootResponse['constants'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [garden, setGarden] = useState<OwnedGardenVisualisation | null>(null);
  const isMounted = useRef<boolean>(false);
  const hasStartedInitialRequest = useRef<boolean>(false);

  const loadGarden = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result: SuccessDataAny<GenerateRootResponse> =
        await getOwnedGardenService().getOwnedGarden();
      if (!result.success) {
        throw result.errors[0] ?? new Error(loadErrorMessage);
      }
      if (result.data === undefined) {
        throw new Error(loadErrorMessage);
      }

      const ownedVisualisation: OwnedGardenVisualisation | undefined = result.data.generations[0];
      if (ownedVisualisation === undefined || result.data.generations.length !== 1) {
        throw new Error(invalidResponseMessage);
      }

      if (isMounted.current) {
        setConstants(result.data.constants);
        setGarden(ownedVisualisation);
      }
    } catch (loadError: unknown) {
      const failure: SuccessDataAny = handleError(loadError);
      getLoggerService().report('ownership.loadGarden', failure);
      if (isMounted.current) {
        setError(failure.errors[0]?.message ?? loadErrorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect((): (() => void) => {
    isMounted.current = true;
    if (!hasStartedInitialRequest.current) {
      hasStartedInitialRequest.current = true;
      void loadGarden();
    }

    return (): void => {
      isMounted.current = false;
    };
  }, [loadGarden]);

  return useMemo<UseOwnedGardenResult>(
    () => ({
      constants,
      error,
      isLoading,
      garden,
      retry: loadGarden,
    }),
    [constants, error, garden, isLoading, loadGarden],
  );
};
