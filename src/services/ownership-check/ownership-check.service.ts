'use client';

import type { VerifyRootRequest } from '@kk-garden/shared/schemas';
import type { OwnershipCheckRepository } from './ownership-check.repository';
import type { OwnershipCheckResult } from './ownership-check.types';

export class OwnershipCheckService {
  public constructor(private readonly ownershipCheckRepository: OwnershipCheckRepository) {}

  public checkOwnership(userId: VerifyRootRequest['userId']): Promise<OwnershipCheckResult> {
    return this.ownershipCheckRepository.checkOwnership(userId);
  }
}
