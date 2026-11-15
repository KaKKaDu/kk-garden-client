'use client';

import { handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import {
  ErrorSchema,
  GenerateRootResponseSchema,
  type GenerateRootResponse,
} from '@kk-garden/shared/schemas';
import type { ZodType } from 'zod';
import type { ApiService } from '@/services/api/api.service';
import type { ApiUrlResult } from '@/services/api/api.types';

export class OwnedGardenRepository {
  public constructor(private readonly apiService: ApiService) {}

  public getOwnedGarden(): Promise<SuccessDataAny<GenerateRootResponse>> {
    return this.request('/garden', GenerateRootResponseSchema);
  }

  private async request<Data extends object>(
    path: string,
    schema: ZodType<Data>,
  ): Promise<SuccessDataAny<Data>> {
    try {
      const urlResult: ApiUrlResult = this.apiService.getUrl(path);
      if (!urlResult.success) {
        throw new Error(urlResult.errors[0]?.message ?? 'Owned garden URL resolution failed.');
      }
      if (urlResult.data === undefined) {
        throw new Error('Owned garden URL resolution returned no data.');
      }

      const response: Response = await fetch(urlResult.data, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      const responseBody: unknown = await response.json();

      if (!response.ok) {
        const errorResponse = ErrorSchema.safeParse(responseBody);
        throw new Error(
          errorResponse.success
            ? errorResponse.data.message
            : `The owned garden request failed (${response.status}).`,
        );
      }

      const data: Data = schema.parse(responseBody);
      return { success: true, data };
    } catch (error: unknown) {
      return handleError<Data>(error);
    }
  }
}
