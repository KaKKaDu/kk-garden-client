'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useOwnershipStore } from '@/features/ownership/store/ownership.store';

type NotAssignedAccountOnlyProps = {
  children: ReactNode;
};

export const NotAssignedAccountOnly = ({ children }: NotAssignedAccountOnlyProps): ReactNode => {
  const { user } = useAuth();
  const status = useOwnershipStore((state) => state.status);
  const storedUserId = useOwnershipStore((state) => state.userId);

  return status === 'not-assigned' && storedUserId === user?.id ? children : null;
};
