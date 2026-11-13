'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import type { ComponentProps, ReactElement } from 'react';
import { cn } from '@/utils/class-names.utils';

type DropdownMenuContentProps = ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<
    ComponentProps<typeof MenuPrimitive.Positioner>,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >;

const DropdownMenu = (props: ComponentProps<typeof MenuPrimitive.Root>): ReactElement => (
  <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
);

const DropdownMenuTrigger = (props: ComponentProps<typeof MenuPrimitive.Trigger>): ReactElement => (
  <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
);

const DropdownMenuGroup = (props: ComponentProps<typeof MenuPrimitive.Group>): ReactElement => (
  <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
);

const DropdownMenuContent = ({
  align = 'end',
  alignOffset,
  side = 'bottom',
  sideOffset = 6,
  className,
  ...props
}: DropdownMenuContentProps): ReactElement => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner
      align={align}
      alignOffset={alignOffset}
      className="z-50 outline-none"
      side={side}
      sideOffset={sideOffset}
    >
      <MenuPrimitive.Popup
        data-slot="dropdown-menu-content"
        className={cn(
          'min-w-48 origin-(--transform-origin) rounded-xl border-2 border-primary/20 bg-background p-2 text-foreground shadow-[4px_4px_0_var(--component-shadow-color)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
);

const DropdownMenuLabel = ({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.GroupLabel>): ReactElement => (
  <MenuPrimitive.GroupLabel
    data-slot="dropdown-menu-label"
    className={cn('px-2.5 py-2 text-sm font-medium', className)}
    {...props}
  />
);

const DropdownMenuItem = ({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Item>): ReactElement => (
  <MenuPrimitive.Item
    data-slot="dropdown-menu-item"
    className={cn(
      'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
      className,
    )}
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>): ReactElement => (
  <MenuPrimitive.Separator
    data-slot="dropdown-menu-separator"
    className={cn('-mx-2 my-2 h-px bg-border', className)}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
