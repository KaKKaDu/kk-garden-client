import type { ReactNode } from 'react';
import { AuthOnly } from '@/components/auth/AuthOnly';

type SharedViewLayoutProps = {
  children: ReactNode;
};

export default function SharedViewLayout({ children }: SharedViewLayoutProps): ReactNode {
  return <AuthOnly strict>{children}</AuthOnly>;
}
