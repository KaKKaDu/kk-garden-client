import { createAccentThemePalette } from './theme.utils';
import { handleError } from '@kk-garden/shared/errors';
import type { ThemeApplyResult, ThemeColorMap, ThemePaletteResult } from './theme.types';

export class ThemeService {
  private static readonly themeStyleElementId: string = 'kk-garden-accent-theme';

  public setAccentColor(accentHex: string): ThemeApplyResult {
    try {
      const paletteResult: ThemePaletteResult = createAccentThemePalette(accentHex);

      if (!paletteResult.success) {
        throw new Error(paletteResult.errors[0]?.message ?? 'Accent palette generation failed.');
      }

      if (paletteResult.data === undefined) {
        throw new Error('Accent palette generation returned no data.');
      }

      const styleElement: HTMLStyleElement = this.getThemeStyleElement();
      styleElement.textContent = [
        this.formatThemeRule(':root', paletteResult.data.light),
        this.formatThemeRule('.dark', paletteResult.data.dark),
      ].join('\n\n');

      return { success: true, data: { applied: true } };
    } catch (error: unknown) {
      return handleError(error);
    }
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
