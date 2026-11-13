import 'server-only';

import { AuthSessionService } from './auth-session.service';
import { AuthSessionRepository } from './auth-session.repository';
import { getApiService } from '@/services/api/api.container';

const authSessionRepository: AuthSessionRepository = new AuthSessionRepository(getApiService());
const authSessionService: AuthSessionService = new AuthSessionService(authSessionRepository);

export const getAuthSessionService = (): AuthSessionService => authSessionService;
