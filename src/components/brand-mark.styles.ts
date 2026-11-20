import { cn } from '@/utils/class-names.utils';

export const getBrandMarkClassName = (size: 'medium' | 'large', interactive: boolean): string =>
  cn(
    'grid shrink-0 place-items-center',
    size === 'large' ? 'size-16' : 'size-14',
    'border-2 border-primary/40 bg-secondary',
    'rounded-full shadow-[var(--component-shadow-moderate)]',
    interactive
      ? 'cursor-pointer transition-[transform,box-shadow,border-color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-foreground hover:shadow-[var(--component-shadow-hover)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[var(--component-shadow-pressed)] motion-reduce:transition-none'
      : null,
  );
