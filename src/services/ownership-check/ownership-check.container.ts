import { getApiService } from '@/services/api/api.container';
import { OwnershipCheckRepository } from './ownership-check.repository';
import { OwnershipCheckService } from './ownership-check.service';

const ownershipCheckRepository: OwnershipCheckRepository = new OwnershipCheckRepository(
  getApiService(),
);
const ownershipCheckService: OwnershipCheckService = new OwnershipCheckService(
  ownershipCheckRepository,
);

export const getOwnershipCheckService = (): OwnershipCheckService => ownershipCheckService;
