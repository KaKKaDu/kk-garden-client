import type { ReactNode } from 'react';
import { AssignedAccountOnly } from '@/components/ownership/AssignedAccountOnly';
import { AssignedGardenView } from '@/components/ownership/AssignedGardenView/AssignedGardenView';
import { NotAssignedAccountOnly } from '@/components/ownership/NotAssignedAccountOnly';
import { NotAssignedAccountBlock } from '@/components/ownership/NotAssignedAccountBlock/NotAssignedAccountBlock';
import { mainPageClassNames } from './main-page.styles';

export default function Home(): ReactNode {
  return (
    <main className={mainPageClassNames.main}>
      <NotAssignedAccountOnly>
        <NotAssignedAccountBlock />
      </NotAssignedAccountOnly>
      <AssignedAccountOnly>
        <AssignedGardenView />
      </AssignedAccountOnly>
    </main>
  );
}
