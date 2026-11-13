import 'server-only';

import { headers } from 'next/headers';
import { handleError } from '@kk-garden/shared/errors';
import type { AuthSessionRepository } from './auth-session.repository';
import type { AuthSessionResult } from './auth-session.types';

export class AuthSessionService {
  public constructor(private readonly authSessionRepository: AuthSessionRepository) {}

  public async getCurrentSession(): Promise<AuthSessionResult> {
    try {
      const requestHeaders: Headers = await headers();

      return await this.authSessionRepository.getSession(requestHeaders.get('cookie'));
    } catch (error: unknown) {
      return handleError(error);
    }
  }
}
