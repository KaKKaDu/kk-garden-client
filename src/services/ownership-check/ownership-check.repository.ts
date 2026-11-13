'use client';

import { handleError } from '@kk-garden/shared/errors';
import {
  VerifyRootResponseSchema,
  type VerifyRootRequest,
  type VerifyRootResponse,
} from '@kk-garden/shared/schemas';
import type { ApiService } from '@/services/api/api.service';
import type { ApiUrlResult } from '@/services/api/api.types';
import type { OwnershipCheckResult } from './ownership-check.types';

export class OwnershipCheckRepository {
  public constructor(private readonly apiService: ApiService) {}

  public async checkOwnership(userId: VerifyRootRequest['userId']): Promise<OwnershipCheckResult> {
    try {
      const urlResult: ApiUrlResult = this.apiService.getUrl('/verify');

      if (!urlResult.success) {
        throw new Error(urlResult.errors[0]?.message ?? 'Ownership check URL resolution failed.');
      }

      if (urlResult.data === undefined) {
        throw new Error('Ownership check URL resolution returned no data.');
      }

      const request: VerifyRootRequest = { userId };
      const response: Response = await fetch(urlResult.data, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ownership check failed (${response.status}).`);
      }

      const responseBody: unknown = await response.json();
      const check: VerifyRootResponse = VerifyRootResponseSchema.parse(responseBody);

      return { success: true, data: check };
    } catch (error: unknown) {
      return handleError<VerifyRootResponse>(error);
    }
  }
}
