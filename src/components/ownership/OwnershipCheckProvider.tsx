'use client';

import { handleError } from '@kk-garden/shared/errors';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useOwnershipStore } from '@/features/ownership/store/ownership.store';
import { getLoggerService } from '@/services/logger/logger.container';
import { getOwnershipCheckService } from '@/services/ownership-check/ownership-check.container';

type OwnershipCheckProviderProps = {
  children: ReactNode;
};

const defaultCheckError = 'Could not check account ownership.';

export const OwnershipCheckProvider = ({ children }: OwnershipCheckProviderProps): ReactNode => {
  const { isAuthenticated, isPending, user } = useAuth();
  const setError = useOwnershipStore((state) => state.setError);
  const setLoading = useOwnershipStore((state) => state.setLoading);
  const setCheck = useOwnershipStore((state) => state.setCheck);
  const reset = useOwnershipStore((state) => state.reset);
  const userId: string | null = useMemo((): string | null => user?.id ?? null, [user?.id]);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!isAuthenticated || userId === null) {
      reset();
      return;
    }

    let active = true;
    setLoading(userId);

    const checkOwnership = async (): Promise<void> => {
      try {
        const result = await getOwnershipCheckService().checkOwnership(userId);

        if (!result.success) {
          throw result.errors[0] ?? new Error(defaultCheckError);
        }

        if (result.data === undefined) {
          throw new Error(defaultCheckError);
        }

        if (active) {
          setCheck(userId, result.data.data);
        }
      } catch (error: unknown) {
        if (active) {
          getLoggerService().report('ownership.check', handleError(error));
          setError(userId, error instanceof Error ? error.message : defaultCheckError);
        }
      }
    };

    void checkOwnership();

    return (): void => {
      active = false;
    };
  }, [isAuthenticated, isPending, reset, setCheck, setError, setLoading, userId]);

  return children;
};
