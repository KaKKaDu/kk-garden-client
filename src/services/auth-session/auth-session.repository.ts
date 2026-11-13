import 'server-only';

import { handleError } from '@kk-garden/shared/errors';
import type { ApiUrlResult } from '@/services/api/api.types';
import type { ApiService } from '@/services/api/api.service';
import type { AuthSessionResult } from './auth-session.types';
import { parseAuthSessionResponse } from './auth-session.utils';

export class AuthSessionRepository {
  public constructor(private readonly apiService: ApiService) {}

  public async getSession(cookieHeader: string | null): Promise<AuthSessionResult> {
    try {
      if (cookieHeader === null || cookieHeader.length === 0) {
        return { success: true, data: { session: null } };
      }

      const urlResult: ApiUrlResult = this.apiService.getUrl('/api/auth/get-session');

      if (!urlResult.success) {
        throw new Error(urlResult.errors[0]?.message ?? 'Session URL resolution failed.');
      }

      if (urlResult.data === undefined) {
        throw new Error('Session URL resolution returned no data.');
      }

      const response: Response = await fetch(urlResult.data, {
        headers: { cookie: cookieHeader },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`The authentication session request failed (${response.status}).`);
      }

      const responseBody: unknown = await response.json();
      const session = parseAuthSessionResponse(responseBody);

      return { success: true, data: { session } };
    } catch (error: unknown) {
      return handleError(error);
    }
  }
}
