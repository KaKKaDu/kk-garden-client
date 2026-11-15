'use client';

import type { SuccessDataAny } from '@kk-garden/shared/errors';
import type { GenerateRootResponse } from '@kk-garden/shared/schemas';
import type { OwnedGardenRepository } from './owned-garden.repository';

export class OwnedGardenService {
  public constructor(private readonly ownedGardenRepository: OwnedGardenRepository) {}

  public getOwnedGarden(): Promise<SuccessDataAny<GenerateRootResponse>> {
    return this.ownedGardenRepository.getOwnedGarden();
  }
}
