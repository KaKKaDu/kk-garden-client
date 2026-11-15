import type { ReactNode } from 'react';
import { GoHomeButton } from '@/components/navigation/go-home-button/GoHomeButton';
import { ownershipAccountBlockClassNames as classNames } from '../ownership-account-block.styles';
import { assignedAccountBlockTexts as texts } from './texts';

export const AssignedAccountBlock = (): ReactNode => {
  return (
    <section className={classNames.section}>
      <h1 className={classNames.title}>{texts.title}</h1>
      <p className={classNames.description}>{texts.description}</p>
      <GoHomeButton />
    </section>
  );
};
