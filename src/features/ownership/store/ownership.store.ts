import { create } from 'zustand';
import type { OwnershipCheckData } from '@/services/ownership-check/ownership-check.types';

type OwnershipStore = {
  status: 'idle' | 'loading' | 'assigned' | 'not-assigned' | 'error';
  userId: string | null;
  check: OwnershipCheckData | null;
  error: string | null;
  setLoading: (userId: string) => void;
  setCheck: (userId: string, check: OwnershipCheckData) => void;
  setError: (userId: string, error: string) => void;
  reset: () => void;
};

const initialOwnershipState = {
  status: 'idle' as const,
  userId: null,
  check: null,
  error: null,
};

export const useOwnershipStore = create<OwnershipStore>((set) => ({
  ...initialOwnershipState,
  setLoading: (userId: string): void =>
    set({ status: 'loading', userId, check: null, error: null }),
  setCheck: (userId: string, check: OwnershipCheckData): void =>
    set({
      status: check.ownershipExists.status === 'success' ? 'assigned' : 'not-assigned',
      userId,
      check,
      error: null,
    }),
  setError: (userId: string, error: string): void =>
    set({ status: 'error', userId, check: null, error }),
  reset: (): void => set(initialOwnershipState),
}));
