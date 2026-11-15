import { cn } from '@/utils/class-names.utils';

export const accentColorPickerButtonClassNames = {
  trigger: cn(
    'aspect-square overflow-hidden',
    'transition-[transform,opacity,box-shadow,border-color] duration-200 md:pointer-events-auto md:translate-x-0 md:opacity-100',
  ),
  triggerIcon: cn('size-8'),
  popover: cn('w-[min(18rem,calc(100vw-6rem))]'),
  content: cn('space-y-4'),
  header: cn('space-y-1'),
  title: cn('font-semibold'),
  description: cn('text-muted-foreground text-sm'),
  picker: cn('h-40 w-full'),
  colorValue: cn(
    'flex items-center gap-2',
    'rounded-lg border border-border bg-card px-3 py-2',
    'font-mono text-sm',
  ),
  swatch: cn('size-5 shrink-0 rounded-full border border-foreground/20'),
  error: cn('text-destructive text-sm'),
  success: cn('text-primary text-sm'),
  actions: cn('flex flex-wrap items-center justify-end gap-2'),
  resetButton: cn('mr-auto'),
  actionButton: cn('min-h-11'),
} as const;

export const getAccentColorPickerTriggerClassName = (isMenuOpen: boolean): string =>
  cn(
    accentColorPickerButtonClassNames.trigger,
    isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 pointer-events-none opacity-0',
  );
