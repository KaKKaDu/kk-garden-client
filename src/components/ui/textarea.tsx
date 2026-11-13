import type { ComponentProps, ReactElement } from 'react';
import { cn } from '@/utils/class-names.utils';

type TextareaProps = ComponentProps<'textarea'>;

const Textarea = ({ className, ...props }: TextareaProps): ReactElement => (
  <textarea
    data-slot="textarea"
    className={cn(
      'component-input min-h-28 w-full resize-y px-3 py-2 text-base focus-visible:border-ring focus-visible:outline-none aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive',
      className,
    )}
    {...props}
  />
);

export { Textarea };
