'use client';

import { handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import {
  ProfileAvatarFinalizeResponseSchema,
  ProfileAvatarUploadResponseSchema,
  ProfileOwnerResponseSchema,
  ProfileUpdateResponseSchema,
  type ProfileAvatarUploadRequest as ProfileAvatarUploadMetadata,
  type ProfileUpdateRequest as ProfileUpdateFields,
} from '@kk-garden/shared/schemas';
import type { ZodType } from 'zod';
import type { ApiService } from '@/services/api/api.service';
import type { ApiUrlResult } from '@/services/api/api.types';
import type {
  ProfileAvatarFinalizeResult,
  ProfileAvatarUploadComplete,
  ProfileAvatarUploadResult,
  ProfileResult,
  ProfileUpdateResult,
} from './profile.types';

export class ProfileRepository {
  public constructor(private readonly apiService: ApiService) {}

  public async getProfile(): Promise<ProfileResult> {
    return this.request('/profile', 'GET', ProfileOwnerResponseSchema);
  }

  public async updateProfile(fields: ProfileUpdateFields): Promise<ProfileUpdateResult> {
    return this.request('/profile', 'PATCH', ProfileUpdateResponseSchema, fields);
  }

  public async requestAvatarUpload(
    metadata: ProfileAvatarUploadMetadata,
  ): Promise<ProfileAvatarUploadResult> {
    return this.request(
      '/profile/avatar/upload',
      'POST',
      ProfileAvatarUploadResponseSchema,
      metadata,
    );
  }

  public async uploadAvatar(uploadUrl: string, file: File): Promise<ProfileAvatarUploadComplete> {
    try {
      const response: Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`The avatar upload failed (${response.status}).`);
      }

      return { success: true, data: { uploaded: true } };
    } catch (error: unknown) {
      return handleError<{ uploaded: true }>(error);
    }
  }

  public async finalizeAvatar(uploadId: string): Promise<ProfileAvatarFinalizeResult> {
    return this.request('/profile/avatar/finalize', 'POST', ProfileAvatarFinalizeResponseSchema, {
      uploadId,
    });
  }

  private async request<Data extends object>(
    path: string,
    method: 'GET' | 'PATCH' | 'POST',
    schema: ZodType<Data>,
    body?: object,
  ): Promise<SuccessDataAny<Data>> {
    try {
      const urlResult: ApiUrlResult = this.apiService.getUrl(path);

      if (!urlResult.success) {
        throw new Error(urlResult.errors[0]?.message ?? 'Profile URL resolution failed.');
      }

      if (urlResult.data === undefined) {
        throw new Error('Profile URL resolution returned no data.');
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

      if (!response.ok) {
        throw new Error(`The profile request failed (${response.status}).`);
      }

      const responseBody: unknown = await response.json();
      const data: Data = schema.parse(responseBody);

      return { success: true, data };
    } catch (error: unknown) {
      return handleError<Data>(error);
    }
  }
}
