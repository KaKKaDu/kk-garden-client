import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ownershipRoutePaths } from '@/features/ownership/constants/ownership-route.constants';
import { notAssignedAccountBlockTexts as texts } from './texts';

export const NotAssignedAccountBlock = (): ReactNode => (
  <section className="w-full max-w-xl rounded-3xl border-2 border-primary/20 bg-card p-8 text-center text-card-foreground shadow-[8px_8px_0_var(--component-shadow-color)] sm:p-10">
    <h1 className="text-2xl font-semibold">{texts.title}</h1>
    <p className="mt-3 text-muted-foreground">{texts.description}</p>
    <Button className="mt-6" render={<Link href={ownershipRoutePaths.assign} />} size="lg">
      {texts.assign}
      <ArrowRight aria-hidden="true" data-icon="inline-end" />
    </Button>
  </section>
);
