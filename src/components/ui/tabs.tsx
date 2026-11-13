'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import type { ComponentProps, ReactElement } from 'react';
import { cn } from '@/utils/class-names.utils';

type TabsProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, 'className'> & {
  className?: string;
};
type TabsListProps = Omit<ComponentProps<typeof TabsPrimitive.List>, 'className'> & {
  className?: string;
};
type TabsTriggerProps = Omit<ComponentProps<typeof TabsPrimitive.Tab>, 'className'> & {
  className?: string;
};
type TabsContentProps = Omit<ComponentProps<typeof TabsPrimitive.Panel>, 'className'> & {
  className?: string;
};

const Tabs = ({ className, ...props }: TabsProps): ReactElement => (
  <TabsPrimitive.Root
    data-slot="tabs"
    className={cn('flex flex-col gap-2', className)}
    {...props}
  />
);

const TabsList = ({ className, ...props }: TabsListProps): ReactElement => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(
      'inline-flex w-fit items-center justify-center gap-1 rounded-xl border-2 border-border bg-muted/60 p-1 text-muted-foreground shadow-[3px_3px_0_var(--component-shadow-color)]',
      className,
    )}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }: TabsTriggerProps): ReactElement => (
  <TabsPrimitive.Tab
    data-slot="tabs-trigger"
    className={cn(
      'relative inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color,box-shadow] hover:text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-active:border-foreground data-active:bg-background data-active:text-foreground data-active:shadow-[2px_2px_0_var(--component-shadow-color)]',
      className,
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: TabsContentProps): ReactElement => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    className={cn('flex-1 outline-none', className)}
    {...props}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
