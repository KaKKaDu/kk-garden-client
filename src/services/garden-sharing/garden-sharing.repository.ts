'use client';

import { AppError, handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import {
  CreateGardenShareRequestResponseSchema,
  ErrorSchema,
  GardenShareActionResponseSchema,
  GardenShareListQuerySchema,
  GardenShareListResponseSchema,
  GardenShareLookupResponseSchema,
  GardenViewResponseSchema,
  type CreateGardenShareRequest,
  type GardenShareListQuery,
  type ProfileLookupCardRequest,
} from '@kk-garden/shared/schemas';
import type { ZodType } from 'zod';
import type { ApiService } from '@/services/api/api.service';
import type { ApiUrlResult } from '@/services/api/api.types';
import type {
  GardenShareActionResult,
  GardenShareListResult,
  GardenShareLookupResult,
  GardenShareRequestResult,
  GardenViewResult,
} from './garden-sharing.types';

type GardenSharingRequestOptions = {
  body?: object;
  query?: GardenShareListQuery;
};

export class GardenSharingRepository {
  public constructor(private readonly apiService: ApiService) {}

  public lookupProfileCard(
    lookupCode: ProfileLookupCardRequest['lookupCode'],
  ): Promise<GardenShareLookupResult> {
    const body: ProfileLookupCardRequest = { lookupCode };
    return this.request('/sharing/lookup', 'POST', GardenShareLookupResponseSchema, { body });
  }

  public getGardenViewByGrantId(grantId: string): Promise<GardenViewResult> {
    return this.request(`/garden/${encodeURIComponent(grantId)}`, 'GET', GardenViewResponseSchema);
  }

  public createRequest(
    lookupCode: CreateGardenShareRequest['lookupCode'],
  ): Promise<GardenShareRequestResult> {
    const body: CreateGardenShareRequest = { lookupCode };
    return this.request('/sharing/requests', 'POST', CreateGardenShareRequestResponseSchema, {
      body,
    });
  }

  public listRequests(query: GardenShareListQuery): Promise<GardenShareListResult> {
    return this.request('/sharing/requests', 'GET', GardenShareListResponseSchema, { query });
  }

  public acceptRequest(requestId: string): Promise<GardenShareActionResult> {
    return this.request(
      `/sharing/requests/${encodeURIComponent(requestId)}/accept`,
      'POST',
      GardenShareActionResponseSchema,
    );
  }

  public declineRequest(requestId: string): Promise<GardenShareActionResult> {
    return this.request(
      `/sharing/requests/${encodeURIComponent(requestId)}/decline`,
      'POST',
      GardenShareActionResponseSchema,
    );
  }

  public cancelRequest(requestId: string): Promise<GardenShareActionResult> {
    return this.request(
      `/sharing/requests/${encodeURIComponent(requestId)}/cancel`,
      'POST',
      GardenShareActionResponseSchema,
    );
  }

  public listGrants(query: GardenShareListQuery): Promise<GardenShareListResult> {
    return this.request('/sharing/grants', 'GET', GardenShareListResponseSchema, { query });
  }

  public revokeGrant(grantId: string): Promise<GardenShareActionResult> {
    return this.request(
      `/sharing/grants/${encodeURIComponent(grantId)}/revoke`,
      'POST',
      GardenShareActionResponseSchema,
    );
  }

  private async request<Data extends object>(
    path: string,
    method: 'GET' | 'POST',
    schema: ZodType<Data>,
    options: GardenSharingRequestOptions = {},
  ): Promise<SuccessDataAny<Data>> {
    try {
      const urlResult: ApiUrlResult = this.apiService.getUrl(path);

      if (!urlResult.success) {
        throw new Error(urlResult.errors[0]?.message ?? 'Garden sharing URL resolution failed.');
      }

      if (urlResult.data === undefined) {
        throw new Error('Garden sharing URL resolution returned no data.');
      }

      const url: URL = new URL(urlResult.data);
      if (options.query !== undefined) {
        const query: GardenShareListQuery = GardenShareListQuerySchema.parse(options.query);
        url.search = new URLSearchParams({
          direction: query.direction,
          page: String(query.page),
          pageSize: String(query.pageSize),
        }).toString();
      }

      const response: Response = await fetch(url.toString(), {
        method,
        credentials: 'include',
        cache: 'no-store',
        ...(options.body === undefined
          ? {}
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(options.body),
            }),
      });

      const responseBody: unknown = await response.json();
      if (!response.ok) {
        const errorResponse = ErrorSchema.safeParse(responseBody);
        throw new AppError({
          status: response.status,
          message: errorResponse.success
            ? errorResponse.data.message
            : `The garden sharing request failed (${response.status}).`,
        });
      }

      const data: Data = schema.parse(responseBody);

      return { success: true, data };
    } catch (error: unknown) {
      return handleError<Data>(error);
    }
  }
}
