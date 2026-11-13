import { handleError } from '@kk-garden/shared/errors';
import type { EnvService } from '@/services/env/env.service';
import type { ApiUrlResult } from './api.types';

export class ApiService {
  public constructor(private readonly envService: EnvService) {}

  public getUrl(path: string): ApiUrlResult {
    try {
      const envResult = this.envService.getRawEnvValue('NEXT_PUBLIC_API_BASE_URL');

      if (!envResult.success) {
        throw new Error(envResult.errors[0]?.message ?? 'API environment lookup failed.');
      }

      if (envResult.data === undefined || envResult.data.value === null) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL must be configured before calling the API.');
      }

      const baseUrl: URL = new URL(`${envResult.data.value}/`);
      const normalizedPath: string = path.replace(/^\/+/, '');
      const resolvedUrl: URL = new URL(normalizedPath, baseUrl);

      if (resolvedUrl.origin !== baseUrl.origin) {
        throw new Error('API paths must resolve to the configured API origin.');
      }

      return { success: true, data: resolvedUrl.toString() };
    } catch (error: unknown) {
      return handleError<string>(error);
    }
  }
}
