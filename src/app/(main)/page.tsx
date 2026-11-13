import type { ReactNode } from 'react';
import { NotAssignedAccountOnly } from '@/components/ownership/NotAssignedAccountOnly';
import { NotAssignedAccountBlock } from '@/components/ownership/NotAssignedAccountBlock/NotAssignedAccountBlock';

export default function Home(): ReactNode {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <NotAssignedAccountOnly>
        <NotAssignedAccountBlock />
      </NotAssignedAccountOnly>
    </main>
  );
}
