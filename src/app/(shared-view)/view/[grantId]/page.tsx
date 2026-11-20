import type { ReactNode } from 'react';
import { SharedGardenAccess } from '@/components/ownership/SharedGardenAccess/SharedGardenAccess';

type SharedGardenPageProps = {
  params: Promise<{ grantId: string }>;
};

export default async function SharedGardenPage({
  params,
}: SharedGardenPageProps): Promise<ReactNode> {
  const { grantId } = await params;
  return <SharedGardenAccess grantId={grantId} />;
}
