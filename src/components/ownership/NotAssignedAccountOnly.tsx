'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useOwnershipStore } from '@/features/ownership/store/ownership.store';

type NotAssignedAccountOnlyProps = {
  children: ReactNode;
};

export const NotAssignedAccountOnly = ({ children }: NotAssignedAccountOnlyProps): ReactNode => {
  const { user } = useAuth();
  const status = useOwnershipStore((state) => state.status);
  const storedUserId = useOwnershipStore((state) => state.userId);
  const accountIsNotAssigned: boolean = useMemo(
    (): boolean => status === 'not-assigned' && storedUserId === user?.id,
    [status, storedUserId, user?.id],
  );

  return accountIsNotAssigned ? children : null;
};
