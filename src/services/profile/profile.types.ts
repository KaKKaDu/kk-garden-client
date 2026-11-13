import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type {
  ProfileAvatarFinalizeResponse,
  ProfileAvatarUploadResponse,
  ProfileOwnerResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
} from '@kk-garden/shared/schemas';

export type ProfileResult = SuccessDataAny<ProfileOwnerResponse>;
export type ProfileUpdateResult = SuccessDataAny<ProfileUpdateResponse>;
export type ProfileAvatarUploadResult = SuccessDataAny<ProfileAvatarUploadResponse>;
export type ProfileAvatarFinalizeResult = SuccessDataAny<ProfileAvatarFinalizeResponse>;
export type ProfileUpdateFields = ProfileUpdateRequest;
export type ProfileAvatarUploadComplete = SuccessDataAny<{ uploaded: true }>;
