import type { SuccessDataAny } from '@kk-garden/shared/errors';

export const themeChartColorNames = [
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
] as const;

export type ThemeChartColorName = (typeof themeChartColorNames)[number];

export const themeChartColorAliasNames = [
  '--color-chart-1',
  '--color-chart-2',
  '--color-chart-3',
  '--color-chart-4',
  '--color-chart-5',
] as const;

export type ThemeChartColorAliasName = (typeof themeChartColorAliasNames)[number];

export const themeColorNames = [
  ...themeChartColorNames,
  ...themeChartColorAliasNames,
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--border',
  '--input',
  '--ring',
  '--svg-base',
  '--svg-deep',
  '--svg-dark',
  '--svg-light',
  '--svg-pale',
  '--sidebar',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring',
] as const;

export type ThemeColorName = (typeof themeColorNames)[number];

export type ThemeColorMap = Record<ThemeColorName, string>;

export const themeSvgColorNames = [
  '--svg-base',
  '--svg-deep',
  '--svg-dark',
  '--svg-light',
  '--svg-pale',
] as const;

export type ThemeSvgColorName = (typeof themeSvgColorNames)[number];

export type ThemeSvgColorMap = Pick<ThemeColorMap, ThemeSvgColorName>;

export type ThemeChartColorMap = Pick<
  ThemeColorMap,
  ThemeChartColorName | ThemeChartColorAliasName
>;

export type ThemeColorPalette = {
  light: ThemeColorMap;
  dark: ThemeColorMap;
};

export type ThemePaletteResult = SuccessDataAny<ThemeColorPalette>;
export type ThemeApplyResult = SuccessDataAny<{ applied: true }>;
