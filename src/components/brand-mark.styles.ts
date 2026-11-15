import { cn } from '@/utils/class-names.utils';

export const getBrandMarkClassName = (size: 'medium' | 'large', interactive: boolean): string =>
  cn(
    'grid shrink-0 place-items-center',
    size === 'large' ? 'size-16' : 'size-14',
    'border-2 border-primary/40 bg-secondary',
    'rounded-full shadow-[3px_3px_0_var(--component-shadow-color)]',
    interactive
      ? 'cursor-pointer transition-[transform,box-shadow,border-color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-foreground hover:shadow-[5px_5px_0_var(--component-shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--component-shadow-color)] motion-reduce:transition-none'
      : null,
  );
