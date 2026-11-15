import type { ReactNode } from 'react';
import { AssignedAccountOnly } from '@/components/ownership/AssignedAccountOnly';
import { AssignedAccountBlock } from '@/components/ownership/AssignedAccountBlock/AssignedAccountBlock';
import { NotAssignedAccountOnly } from '@/components/ownership/NotAssignedAccountOnly';
import { AssignmentFlow } from '@/components/assignment/AssignmentFlow/AssignmentFlow';
import { assignPageClassNames } from './assign-page.styles';

export const instant = false;

export default function AssignPage(): ReactNode {
  return (
    <main className={assignPageClassNames.main}>
      <NotAssignedAccountOnly>
        <AssignmentFlow />
      </NotAssignedAccountOnly>
      <AssignedAccountOnly>
        <AssignedAccountBlock />
      </AssignedAccountOnly>
    </main>
  );
}
