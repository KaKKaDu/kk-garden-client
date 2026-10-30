import { createAccentThemePalette } from './theme.utils';
import type { ThemeColorMap, ThemeColorPalette } from './theme.types';

export class ThemeService {
  private static readonly themeStyleElementId: string = 'kk-garden-accent-theme';

  public setAccentColor(accentHex: string): void {
    const palette: ThemeColorPalette = createAccentThemePalette(accentHex);
    const styleElement: HTMLStyleElement = this.getThemeStyleElement();

    styleElement.textContent = [
      this.formatThemeRule(':root', palette.light),
      this.formatThemeRule('.dark', palette.dark),
    ].join('\n\n');
  }

  private formatThemeRule(selector: ':root' | '.dark', colors: ThemeColorMap): string {
    const declarations: string = Object.entries(colors)
      .map(([property, value]: [string, string]): string => `  ${property}: ${value};`)
      .join('\n');

    return `${selector} {\n${declarations}\n}`;
  }

  private getThemeStyleElement(): HTMLStyleElement {
    if (typeof document === 'undefined') {
      throw new Error('Accent themes can only be applied in a browser environment.');
    }

    const existingElement: HTMLElement | null = document.getElementById(
      ThemeService.themeStyleElementId,
    );

    if (existingElement !== null) {
      if (!(existingElement instanceof HTMLStyleElement)) {
        throw new Error(
          `The "${ThemeService.themeStyleElementId}" element must be a style element.`,
        );
      }

      return existingElement;
    }

    const styleElement: HTMLStyleElement = document.createElement('style');
    styleElement.id = ThemeService.themeStyleElementId;
    document.head.append(styleElement);

    return styleElement;
  }
}
