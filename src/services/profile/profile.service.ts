'use client';

import { handleError } from '@kk-garden/shared/errors';
import {
  ProfileAvatarUploadRequestSchema,
  type ProfileAvatarFinalizeResponse,
} from '@kk-garden/shared/schemas';
import type { ProfileRepository } from './profile.repository';
import type {
  ProfileAvatarFinalizeResult,
  ProfileResult,
  ProfileUpdateFields,
  ProfileUpdateResult,
} from './profile.types';

export class ProfileService {
  public constructor(private readonly profileRepository: ProfileRepository) {}

  public getProfile(): Promise<ProfileResult> {
    return this.profileRepository.getProfile();
  }

  public updateProfile(fields: ProfileUpdateFields): Promise<ProfileUpdateResult> {
    return this.profileRepository.updateProfile(fields);
  }

  public async uploadAvatar(file: File): Promise<ProfileAvatarFinalizeResult> {
    const metadataResult = ProfileAvatarUploadRequestSchema.safeParse({
      contentType: file.type,
      byteSize: file.size,
    });

    if (!metadataResult.success) {
      return handleError<ProfileAvatarFinalizeResponse>(metadataResult.error);
    }

    const uploadResult = await this.profileRepository.requestAvatarUpload(metadataResult.data);

    if (!uploadResult.success) {
      return { success: false, errors: uploadResult.errors };
    }

    if (uploadResult.data === undefined) {
      return handleError<ProfileAvatarFinalizeResponse>(
        new Error('Avatar upload request returned no data.'),
      );
    }

    const fileResult = await this.profileRepository.uploadAvatar(uploadResult.data.uploadUrl, file);

    if (!fileResult.success) {
      return { success: false, errors: fileResult.errors };
    }

    return this.profileRepository.finalizeAvatar(uploadResult.data.uploadId);
  }
}
