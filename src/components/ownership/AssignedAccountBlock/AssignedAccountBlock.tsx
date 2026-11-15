import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { ownershipAccountBlockClassNames as classNames } from '../ownership-account-block.styles';
import { assignedAccountBlockTexts as texts } from './texts';

export const AssignedAccountBlock = (): ReactNode => {
  return (
    <section className={classNames.section}>
      <h1 className={classNames.title}>{texts.title}</h1>
      <p className={classNames.description}>{texts.description}</p>
      <Button
        className={classNames.action}
        nativeButton={false}
        render={<Link href={authRoutePaths.main} />}
        size="lg"
      >
        {texts.home}
        <ArrowRight aria-hidden="true" data-icon="inline-end" />
      </Button>
    </section>
  );
};
