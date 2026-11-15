import { getApiService } from '@/services/api/api.container';
import { OwnedGardenRepository } from './owned-garden.repository';
import { OwnedGardenService } from './owned-garden.service';

const ownedGardenRepository: OwnedGardenRepository = new OwnedGardenRepository(getApiService());
const ownedGardenService: OwnedGardenService = new OwnedGardenService(ownedGardenRepository);

export const getOwnedGardenService = (): OwnedGardenService => ownedGardenService;
