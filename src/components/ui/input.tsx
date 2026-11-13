import { Input as InputPrimitive } from '@base-ui/react/input';
import type { ComponentProps, ReactElement } from 'react';
import { cn } from '@/utils/class-names.utils';

type InputProps = ComponentProps<typeof InputPrimitive>;

const Input = ({ className, ...props }: InputProps): ReactElement => (
  <InputPrimitive
    data-slot="input"
    className={cn(
      'component-input flex h-11 w-full px-3 py-2 text-base focus-visible:border-ring focus-visible:outline-none aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive',
      className,
    )}
    {...props}
  />
);

export { Input };
