import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { ProjectStyleMenuIcon } from './header/ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import { getBrandMarkClassName } from './brand-mark.styles';

type BrandMarkProps = {
  size: 'medium' | 'large';
  interactive?: boolean;
};

export const BrandMark = ({ size, interactive = false }: BrandMarkProps): ReactElement => {
  const iconClassName: string = useMemo(
    (): string => (size === 'large' ? 'size-11' : 'size-9'),
    [size],
  );
  const className: string = useMemo(
    (): string => getBrandMarkClassName(size, interactive),
    [interactive, size],
  );

  return (
    <span className={className}>
      <ProjectStyleMenuIcon className={iconClassName} name="logo" />
    </span>
  );
};
