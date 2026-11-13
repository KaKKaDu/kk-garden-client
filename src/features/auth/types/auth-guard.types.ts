import type { ReactNode } from 'react';

export type AuthGuardProps = {
  children: ReactNode;
  strict?: boolean;
};
