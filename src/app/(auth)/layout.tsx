import type { ReactNode } from 'react';
import { NoAuthOnly } from '@/components/auth/NoAuthOnly';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps): ReactNode {
  return <NoAuthOnly strict>{children}</NoAuthOnly>;
}
