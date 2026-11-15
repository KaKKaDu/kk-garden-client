'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import type { AuthGuardProps } from '@/features/auth/types/auth-guard.types';

export const NoAuthOnly = ({ children, strict = false }: AuthGuardProps): ReactNode => {
  const router = useRouter();
  const { isAuthenticated, isPending } = useAuth();
  const shouldRedirect: boolean = useMemo(
    (): boolean => strict && !isPending && isAuthenticated,
    [isAuthenticated, isPending, strict],
  );

  useEffect((): void => {
    if (shouldRedirect) {
      router.replace(authRoutePaths.main);
    }
  }, [router, shouldRedirect]);

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
};
