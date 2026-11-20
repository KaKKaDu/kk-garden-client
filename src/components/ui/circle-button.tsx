import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { ReactElement } from 'react';
import { cn } from '@/utils/class-names.utils';

type CircleButtonProps = ButtonPrimitive.Props & {
  circleSize?: 'medium' | 'large';
};

const CircleButton = ({
  circleSize = 'medium',
  className,
  ...props
}: CircleButtonProps): ReactElement => {
  const classNameForState = (state: ButtonPrimitive.State): string =>
    cn(
      'inline-grid shrink-0 cursor-pointer place-items-center rounded-full border-2 border-primary/40 bg-secondary shadow-[var(--component-shadow-moderate)] outline-none transition-[transform,box-shadow,border-color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-foreground hover:shadow-[var(--component-shadow-hover)] focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[var(--component-shadow-pressed)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
      circleSize === 'large' ? 'size-16' : 'size-14',
      typeof className === 'function' ? className(state) : className,
    );

  return <ButtonPrimitive data-slot="circle-button" className={classNameForState} {...props} />;
};

export { CircleButton };
