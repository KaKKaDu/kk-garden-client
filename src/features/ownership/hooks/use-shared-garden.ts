'use client';

import type { GardenViewResponse } from '@kk-garden/shared/schemas';
import { handleError } from '@kk-garden/shared/errors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getLoggerService } from '@/services/logger/logger.container';
import { getGardenSharingService } from '@/services/garden-sharing/garden-sharing.container';

type SharedGardenViewStatus = 'loading' | 'denied' | 'error' | 'success';

export type SharedGardenViewState<Status extends SharedGardenViewStatus = SharedGardenViewStatus> =
  Status extends 'success'
    ? { sourceKey: string; requestId: number; status: Status; garden: GardenViewResponse }
    : { sourceKey: string; requestId: number; status: Status };

export type UseSharedGardenResult = {
  state: SharedGardenViewState;
  retry: () => Promise<void>;
};

const loadErrorMessage: string = 'Could not load this shared garden. Please try again.';

export const useSharedGarden = (grantId: string): UseSharedGardenResult => {
  const sourceKey: string = useMemo((): string => grantId, [grantId]);
  const [requestId, setRequestId] = useState<number>(0);
  const [state, setState] = useState<SharedGardenViewState>({
    sourceKey,
    requestId: 0,
    status: 'loading',
  });

  useEffect((): (() => void) => {
    let active: boolean = true;
    const loadGarden = async (): Promise<void> => {
      try {
        const gardenSharingService = getGardenSharingService();
        const result = await gardenSharingService.getGardenViewByGrantId(grantId);
        if (!active) {
          return;
        }

        if (!result.success) {
          if (result.errors[0]?.status === 400 || result.errors[0]?.status === 404) {
            setState({ sourceKey, requestId, status: 'denied' });
            return;
          }

          getLoggerService().report('sharing.loadGardenView', result);
          setState({ sourceKey, requestId, status: 'error' });
          return;
        }

        if (result.data === undefined) {
          throw new Error(loadErrorMessage);
        }

        setState({ sourceKey, requestId, status: 'success', garden: result.data });
      } catch (error: unknown) {
        const failure = handleError(error);
        if (!active) {
          return;
        }

        if (failure.errors[0]?.status === 400 || failure.errors[0]?.status === 404) {
          setState({ sourceKey, requestId, status: 'denied' });
          return;
        }

        getLoggerService().report('sharing.loadGardenView', failure);
        setState({ sourceKey, requestId, status: 'error' });
      }
    };

    void loadGarden();

    return (): void => {
      active = false;
    };
  }, [grantId, requestId, sourceKey]);

  const currentState: SharedGardenViewState = useMemo(
    (): SharedGardenViewState =>
      state.sourceKey === sourceKey && state.requestId === requestId
        ? state
        : { sourceKey, requestId, status: 'loading' },
    [requestId, sourceKey, state],
  );
  const retry = useCallback((): Promise<void> => {
    setRequestId((currentRequestId: number): number => currentRequestId + 1);
    return Promise.resolve();
  }, []);

  return useMemo<UseSharedGardenResult>(
    () => ({ state: currentState, retry }),
    [currentState, retry],
  );
};
