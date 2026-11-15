import Image from 'next/image';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { getBrandMarkClassName } from './brand-mark.styles';

type BrandMarkProps = {
  size: 'medium' | 'large';
  interactive?: boolean;
};

export const BrandMark = ({ size, interactive = false }: BrandMarkProps): ReactElement => {
  const imageSize: number = useMemo((): number => (size === 'large' ? 44 : 36), [size]);
  const className: string = useMemo(
    (): string => getBrandMarkClassName(size, interactive),
    [interactive, size],
  );

  return (
    <span className={className}>
      <Image alt="" aria-hidden height={imageSize} src="/logo.svg" width={imageSize} />
    </span>
  );
};
