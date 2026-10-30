import { ThemeService } from './theme.service';

const themeService: ThemeService = new ThemeService();

export const getThemeService = (): ThemeService => themeService;
