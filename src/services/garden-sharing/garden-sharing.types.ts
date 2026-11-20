import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type {
  CreateGardenShareRequestResponse,
  GardenShareActionResponse,
  GardenShareListResponse,
  GardenShareLookupResponse,
  GardenViewResponse,
} from '@kk-garden/shared/schemas';

export type GardenShareLookupResult = SuccessDataAny<GardenShareLookupResponse>;
export type GardenShareRequestResult = SuccessDataAny<CreateGardenShareRequestResponse>;
export type GardenShareListResult = SuccessDataAny<GardenShareListResponse>;
export type GardenShareActionResult = SuccessDataAny<GardenShareActionResponse>;
export type GardenViewResult = SuccessDataAny<GardenViewResponse>;
