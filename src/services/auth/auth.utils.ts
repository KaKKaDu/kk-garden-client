'use client';

import { passkeyClient } from '@better-auth/passkey/client';
import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';
import { handleError } from '@kk-garden/shared/errors';
import type { ApiUrlResult } from '@/services/api/api.types';
import type { ApiService } from '@/services/api/api.service';
import type { AuthOperationResult, BetterAuthClient, BetterAuthClientOptions } from './auth.types';

type AuthApiResponse<Data extends object> = {
  data: Data | null;
  error: { message?: string } | null;
};

type AuthOperation<Data extends object> = (
  client: BetterAuthClient,
) => Promise<AuthApiResponse<Data>>;

let betterAuthClient: BetterAuthClient | null = null;

const getBetterAuthClient = (apiService: ApiService): BetterAuthClient => {
  if (betterAuthClient !== null) {
    return betterAuthClient;
  }

  const baseUrlResult: ApiUrlResult = apiService.getUrl('/');

  if (!baseUrlResult.success) {
    throw new Error(baseUrlResult.errors[0]?.message ?? 'API base URL resolution failed.');
  }

  if (baseUrlResult.data === undefined) {
    throw new Error('API base URL resolution returned no data.');
  }

  betterAuthClient = createAuthClient<BetterAuthClientOptions>({
    baseURL: baseUrlResult.data,
    basePath: '/api/auth',
    fetchOptions: { credentials: 'include' },
    plugins: [emailOTPClient(), passkeyClient()],
  });

  return betterAuthClient;
};

export { getBetterAuthClient };

export const executeAuthOperation = async <Data extends object>(
  apiService: ApiService,
  operation: AuthOperation<Data>,
): AuthOperationResult<Data> => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('Better Auth operations must run in a browser.');
    }

    const client: BetterAuthClient = getBetterAuthClient(apiService);
    const response: AuthApiResponse<Data> = await operation(client);

    if (response.error !== null) {
      throw new Error(response.error.message ?? 'The authentication request failed.');
    }

    if (response.data === null) {
      throw new Error('The authentication request returned no data.');
    }

    return { success: true, data: response.data };
  } catch (error: unknown) {
    return handleError<Data>(error);
  }
};
