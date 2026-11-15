import type { ReactNode } from 'react';
import { AuthOnly } from '@/components/auth/AuthOnly';
import { Header } from '@/components/header/Header';
import { OwnershipCheckProvider } from '@/components/ownership/OwnershipCheckProvider';
import { mainLayoutClassNames } from './main-layout.styles';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps): ReactNode {
  return (
    <AuthOnly strict>
      <OwnershipCheckProvider>
        <div className={mainLayoutClassNames.layout}>
          <div aria-hidden="true" className={mainLayoutClassNames.ambientLayer}>
            <span className={mainLayoutClassNames.orbOne} />
            <span className={mainLayoutClassNames.orbTwo} />
            <span className={mainLayoutClassNames.orbThree} />
            <span className={mainLayoutClassNames.orbFour} />
            <span className={mainLayoutClassNames.orbFive} />
          </div>
          <Header />
          <div className={mainLayoutClassNames.content}>{children}</div>
        </div>
      </OwnershipCheckProvider>
    </AuthOnly>
  );
}
