import Image from 'next/image';
import type { ReactElement } from 'react';

type BrandMarkProps = {
  size: 'medium' | 'large';
  interactive?: boolean;
};

export const BrandMark = ({ size, interactive = false }: BrandMarkProps): ReactElement => {
  const imageSize: number = size === 'large' ? 44 : 36;
  const containerSize: string = size === 'large' ? 'size-16' : 'size-14';
  const interactionClasses: string = interactive
    ? 'cursor-pointer transition-[transform,box-shadow,border-color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-foreground hover:shadow-[5px_5px_0_var(--component-shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--component-shadow-color)] motion-reduce:transition-none'
    : '';

  return (
    <span
      className={`grid ${containerSize} shrink-0 place-items-center rounded-full border-2 border-primary/40 bg-secondary shadow-[3px_3px_0_var(--component-shadow-color)] ${interactionClasses}`}
    >
      <Image alt="" aria-hidden height={imageSize} src="/logo.svg" width={imageSize} />
    </span>
  );
};
