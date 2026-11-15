import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authRoutePaths } from '@/features/auth/constants/auth-route.constants';
import { getGoHomeButtonClassName } from './go-home-button.styles';
import { goHomeButtonTexts as texts } from './texts';

type GoHomeButtonProps = {
  align?: 'center' | 'left';
  spacing?: 'compact' | 'default';
};

export const GoHomeButton = ({
  align = 'center',
  spacing = 'default',
}: GoHomeButtonProps): ReactNode => {
  const className: string = useMemo(
    (): string => getGoHomeButtonClassName(align, spacing),
    [align, spacing],
  );

  return (
    <Button
      className={className}
      nativeButton={false}
      render={<Link href={authRoutePaths.main} />}
      size="lg"
    >
      {texts.label}
      <ArrowRight aria-hidden="true" data-icon="inline-end" />
    </Button>
  );
};
