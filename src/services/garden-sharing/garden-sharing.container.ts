'use client';

import { getApiService } from '@/services/api/api.container';
import { GardenSharingRepository } from './garden-sharing.repository';
import { GardenSharingService } from './garden-sharing.service';

const gardenSharingRepository: GardenSharingRepository = new GardenSharingRepository(
  getApiService(),
);
const gardenSharingService: GardenSharingService = new GardenSharingService(
  gardenSharingRepository,
);

export const getGardenSharingService = (): GardenSharingService => gardenSharingService;
