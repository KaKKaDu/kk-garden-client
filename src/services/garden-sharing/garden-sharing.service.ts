'use client';

import type {
  CreateGardenShareRequest,
  GardenShareListQuery,
  ProfileLookupCardRequest,
} from '@kk-garden/shared/schemas';
import type { GardenShareGrantId, GardenShareRequestId } from '@kk-garden/shared/types';
import type { GardenSharingRepository } from './garden-sharing.repository';
import type {
  GardenShareActionResult,
  GardenShareListResult,
  GardenShareLookupResult,
  GardenShareRequestResult,
  GardenViewResult,
} from './garden-sharing.types';

export class GardenSharingService {
  public constructor(private readonly gardenSharingRepository: GardenSharingRepository) {}

  public lookupProfileCard(
    lookupCode: ProfileLookupCardRequest['lookupCode'],
  ): Promise<GardenShareLookupResult> {
    return this.gardenSharingRepository.lookupProfileCard(lookupCode);
  }

  public getGardenViewByGrantId(grantId: string): Promise<GardenViewResult> {
    return this.gardenSharingRepository.getGardenViewByGrantId(grantId);
  }

  public createRequest(
    lookupCode: CreateGardenShareRequest['lookupCode'],
  ): Promise<GardenShareRequestResult> {
    return this.gardenSharingRepository.createRequest(lookupCode);
  }

  public listRequests(query: GardenShareListQuery): Promise<GardenShareListResult> {
    return this.gardenSharingRepository.listRequests(query);
  }

  public acceptRequest(requestId: GardenShareRequestId): Promise<GardenShareActionResult> {
    return this.gardenSharingRepository.acceptRequest(requestId);
  }

  public declineRequest(requestId: GardenShareRequestId): Promise<GardenShareActionResult> {
    return this.gardenSharingRepository.declineRequest(requestId);
  }

  public cancelRequest(requestId: GardenShareRequestId): Promise<GardenShareActionResult> {
    return this.gardenSharingRepository.cancelRequest(requestId);
  }

  public listGrants(query: GardenShareListQuery): Promise<GardenShareListResult> {
    return this.gardenSharingRepository.listGrants(query);
  }

  public revokeGrant(grantId: GardenShareGrantId): Promise<GardenShareActionResult> {
    return this.gardenSharingRepository.revokeGrant(grantId);
  }
}
