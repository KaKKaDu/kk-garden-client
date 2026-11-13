'use client';

import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { getApiService } from '@/services/api/api.container';

const authRepository: AuthRepository = new AuthRepository(getApiService());
const authService: AuthService = new AuthService(authRepository);

export const getAuthService = (): AuthService => authService;
