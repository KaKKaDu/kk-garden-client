import { create } from 'zustand';
import type { ProfileOwnerResponse } from '@kk-garden/shared/schemas';

type ProfileStore = {
  profile: ProfileOwnerResponse | null;
  setProfile: (profile: ProfileOwnerResponse | null) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile: ProfileOwnerResponse | null): void => set({ profile }),
}));
