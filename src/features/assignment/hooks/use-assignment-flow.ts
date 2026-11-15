'use client';

import { handleError } from '@kk-garden/shared/errors';
import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type {
  AssignRootRequest,
  AssignRootResponse,
  GenerateRootResponse,
} from '@kk-garden/shared/schemas';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getLoggerService } from '@/services/logger/logger.container';
import { getAssignmentService } from '@/services/assignment/assignment.container';
import { useOwnershipStore } from '@/features/ownership/store/ownership.store';

type AssignmentVisualisation = GenerateRootResponse['generations'][number];
type RetryAction = 'initial' | 'more' | 'assign';

export type UseAssignmentFlowResult = {
  constants: GenerateRootResponse['constants'] | null;
  currentIndex: number;
  error: string | null;
  isAssigning: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  pendingId: string | null;
  retryAction: RetryAction | null;
  selectedVisualisationId: string | null;
  visualisations: AssignmentVisualisation[];
  assignSelected: () => Promise<void>;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
  selectVisualisation: (visualisationId: string) => void;
  setCurrentIndex: (updater: (index: number) => number) => void;
};

const assignmentBatchSize: number = 3;
const generationErrorMessage: string = 'Could not generate gardens. Please try again.';
const assignmentErrorMessage: string = 'Could not assign this garden. Please try again.';
const missingPendingIdMessage: string = 'The generation request did not return a pending ID.';
const pendingIdMismatchMessage: string =
  'The new gardens did not match the current selection session.';
const invalidBatchMessage: string = 'The generation request did not return three gardens.';

export const useAssignmentFlow = (): UseAssignmentFlowResult => {
  const router = useRouter();
  const { user } = useAuth();
  const userId: string | null = useMemo((): string | null => user?.id ?? null, [user?.id]);
  const setAssigned = useOwnershipStore((state) => state.setAssigned);
  const [constants, setConstants] = useState<GenerateRootResponse['constants'] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<RetryAction | null>(null);
  const [selectedVisualisationId, setSelectedVisualisationId] = useState<string | null>(null);
  const [visualisations, setVisualisations] = useState<AssignmentVisualisation[]>([]);
  const isMounted = useRef<boolean>(false);
  const isBatchRequestInProgress = useRef<boolean>(false);
  const hasStartedInitialRequest = useRef<boolean>(false);

  const requestBatch = useCallback(async (existingPendingId: string | null): Promise<void> => {
    if (isBatchRequestInProgress.current) {
      return;
    }
    isBatchRequestInProgress.current = true;

    const isInitialRequest: boolean = existingPendingId === null;
    if (isInitialRequest) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    setRetryAction(null);

    try {
      const result: SuccessDataAny<GenerateRootResponse> =
        await getAssignmentService().generateBatch(assignmentBatchSize, existingPendingId);
      if (!result.success) {
        throw result.errors[0] ?? new Error(generationErrorMessage);
      }
      if (result.data === undefined) {
        throw new Error(generationErrorMessage);
      }

      const response: GenerateRootResponse = result.data;
      if (response.generations.length !== assignmentBatchSize) {
        throw new Error(invalidBatchMessage);
      }
      if (response.pendingId === undefined) {
        throw new Error(missingPendingIdMessage);
      }
      if (existingPendingId !== null && response.pendingId !== existingPendingId) {
        throw new Error(pendingIdMismatchMessage);
      }

      if (isMounted.current) {
        setConstants(response.constants);
        setPendingId(response.pendingId);
        setVisualisations((current: AssignmentVisualisation[]): AssignmentVisualisation[] => [
          ...current,
          ...response.generations,
        ]);
        if (isInitialRequest) {
          setCurrentIndex(0);
        }
      }
    } catch (requestError: unknown) {
      const failure: SuccessDataAny = handleError(requestError);
      getLoggerService().report('assignment.generateBatch', failure);
      if (isMounted.current) {
        setError(failure.errors[0]?.message ?? generationErrorMessage);
        setRetryAction(isInitialRequest ? 'initial' : 'more');
      }
    } finally {
      isBatchRequestInProgress.current = false;
      if (isMounted.current) {
        if (isInitialRequest) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    }
  }, []);

  const loadInitial = useCallback((): Promise<void> => requestBatch(null), [requestBatch]);
  const loadMore = useCallback(async (): Promise<void> => {
    if (pendingId === null) {
      setError(missingPendingIdMessage);
      setRetryAction('initial');
      return;
    }
    await requestBatch(pendingId);
  }, [pendingId, requestBatch]);

  const selectVisualisation = useCallback((visualisationId: string): void => {
    setSelectedVisualisationId(visualisationId);
    setError(null);
    setRetryAction(null);
  }, []);

  const assignSelected = useCallback(async (): Promise<void> => {
    if (selectedVisualisationId === null) {
      setError('Select a garden before confirming assignment.');
      setRetryAction(null);
      return;
    }
    if (pendingId === null) {
      setError(missingPendingIdMessage);
      setRetryAction('initial');
      return;
    }
    if (userId === null) {
      setError(assignmentErrorMessage);
      setRetryAction(null);
      return;
    }

    setIsAssigning(true);
    setError(null);
    setRetryAction(null);

    try {
      const request: AssignRootRequest = {
        visualisationId: selectedVisualisationId,
        pendingId,
      };
      const result: SuccessDataAny<AssignRootResponse> =
        await getAssignmentService().assignSelection(request);
      if (!result.success) {
        throw result.errors[0] ?? new Error(assignmentErrorMessage);
      }
      if (result.data === undefined || !result.data.success) {
        throw new Error(assignmentErrorMessage);
      }

      setAssigned(userId);
      router.replace('/');
    } catch (assignmentError: unknown) {
      const failure: SuccessDataAny = handleError(assignmentError);
      getLoggerService().report('assignment.assignSelection', failure);
      if (isMounted.current) {
        setError(failure.errors[0]?.message ?? assignmentErrorMessage);
        setRetryAction('assign');
      }
    } finally {
      if (isMounted.current) {
        setIsAssigning(false);
      }
    }
  }, [pendingId, router, selectedVisualisationId, setAssigned, userId]);

  const retry = useCallback(async (): Promise<void> => {
    if (retryAction === 'initial') {
      await loadInitial();
      return;
    }
    if (retryAction === 'more') {
      await loadMore();
      return;
    }
    if (retryAction === 'assign') {
      await assignSelected();
    }
  }, [assignSelected, loadInitial, loadMore, retryAction]);

  useEffect((): (() => void) => {
    isMounted.current = true;
    if (!hasStartedInitialRequest.current) {
      hasStartedInitialRequest.current = true;
      void loadInitial();
    }

    return (): void => {
      isMounted.current = false;
    };
  }, [loadInitial]);

  return useMemo<UseAssignmentFlowResult>(
    () => ({
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
    }),
    [
      assignSelected,
      constants,
      currentIndex,
      error,
      isAssigning,
      isLoading,
      isLoadingMore,
      loadMore,
      pendingId,
      retry,
      retryAction,
      selectVisualisation,
      selectedVisualisationId,
      visualisations,
    ],
  );
};
