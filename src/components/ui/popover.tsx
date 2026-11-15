'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import type { ComponentProps, ReactElement } from 'react';
import { cn } from '@/utils/class-names.utils';

type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    ComponentProps<typeof PopoverPrimitive.Positioner>,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >;

const Popover = (props: ComponentProps<typeof PopoverPrimitive.Root>): ReactElement => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

const PopoverTrigger = (props: ComponentProps<typeof PopoverPrimitive.Trigger>): ReactElement => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

const PopoverContent = ({
  align = 'start',
  alignOffset,
  side = 'right',
  sideOffset = 12,
  className,
  ...props
}: PopoverContentProps): ReactElement => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      className="z-50 outline-none"
      side={side}
      sideOffset={sideOffset}
    >
      <PopoverPrimitive.Popup
        data-slot="popover-content"
        className={cn(
          'origin-(--transform-origin) rounded-xl border-2 border-primary/20 bg-background p-4 text-foreground shadow-[4px_4px_0_var(--component-shadow-color)] outline-none',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
);

export { Popover, PopoverContent, PopoverTrigger };
