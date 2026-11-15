import { cn } from '@/utils/class-names.utils';

export const mainLayoutClassNames = {
  layout: cn('relative isolate min-h-screen'),
  ambientLayer: cn('main-layout-ambient-layer'),
  orbOne: cn('main-layout-ambient-orb', 'main-layout-ambient-orb-one'),
  orbTwo: cn('main-layout-ambient-orb', 'main-layout-ambient-orb-two'),
  orbThree: cn('main-layout-ambient-orb', 'main-layout-ambient-orb-three'),
  orbFour: cn('main-layout-ambient-orb', 'main-layout-ambient-orb-four'),
  orbFive: cn('main-layout-ambient-orb', 'main-layout-ambient-orb-five'),
  content: cn('relative z-10 md:pl-24'),
} as const;
