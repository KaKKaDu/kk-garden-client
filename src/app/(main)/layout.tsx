import type { ReactNode } from 'react';
import { AuthOnly } from '@/components/auth/AuthOnly';
import { Header } from '@/components/header/Header';
import { OwnershipCheckProvider } from '@/components/ownership/OwnershipCheckProvider';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps): ReactNode {
  return (
    <AuthOnly strict>
      <OwnershipCheckProvider>
        <Header />
        <div className="md:pl-24">{children}</div>
      </OwnershipCheckProvider>
    </AuthOnly>
  );
}
