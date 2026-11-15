'use client';

import { handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import {
  AssignRootRequestSchema,
  AssignRootResponseSchema,
  ErrorSchema,
  GenerateRootQueryStringSchema,
  GenerateRootResponseSchema,
  type AssignRootRequest,
  type AssignRootResponse,
  type GenerateRootQueryString,
  type GenerateRootResponse,
} from '@kk-garden/shared/schemas';
import type { ZodType } from 'zod';
import type { ApiService } from '@/services/api/api.service';
import type { ApiUrlResult } from '@/services/api/api.types';

export class AssignmentRepository {
  public constructor(private readonly apiService: ApiService) {}

  public generateBatch(
    count: number,
    pendingId: string | null,
  ): Promise<SuccessDataAny<GenerateRootResponse>> {
    try {
      const query: GenerateRootQueryString = GenerateRootQueryStringSchema.parse({
        count,
        ...(pendingId === null ? {} : { pendingId }),
      });
      const searchParameters: URLSearchParams = new URLSearchParams({
        count: String(query.count),
        ...(query.pendingId === undefined ? {} : { pendingId: query.pendingId }),
      });

      return this.request(
        `/generate?${searchParameters.toString()}`,
        'GET',
        GenerateRootResponseSchema,
      );
    } catch (error: unknown) {
      return Promise.resolve(handleError<GenerateRootResponse>(error));
    }
  }

  public assignSelection(request: AssignRootRequest): Promise<SuccessDataAny<AssignRootResponse>> {
    try {
      const validatedRequest: AssignRootRequest = AssignRootRequestSchema.parse(request);
      return this.request('/assign', 'POST', AssignRootResponseSchema, validatedRequest);
    } catch (error: unknown) {
      return Promise.resolve(handleError<AssignRootResponse>(error));
    }
  }

  private async request<Data extends object>(
    path: string,
    method: 'GET' | 'POST',
    schema: ZodType<Data>,
    body?: object,
  ): Promise<SuccessDataAny<Data>> {
    try {
      const urlResult: ApiUrlResult = this.apiService.getUrl(path);
      if (!urlResult.success) {
        throw new Error(urlResult.errors[0]?.message ?? 'Assignment URL resolution failed.');
      }
      if (urlResult.data === undefined) {
        throw new Error('Assignment URL resolution returned no data.');
      }

      const response: Response = await fetch(urlResult.data, {
        method,
        credentials: 'include',
        cache: 'no-store',
        ...(body === undefined
          ? {}
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            }),
      });

      const responseBody: unknown = await response.json();
      if (!response.ok) {
        const errorResponse = ErrorSchema.safeParse(responseBody);
        throw new Error(
          errorResponse.success
            ? errorResponse.data.message
            : `The assignment request failed (${response.status}).`,
        );
      }

      const data: Data = schema.parse(responseBody);
      return { success: true, data };
    } catch (error: unknown) {
      return handleError<Data>(error);
    }
  }
}
