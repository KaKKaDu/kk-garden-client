'use client';

import { getApiService } from '@/services/api/api.container';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

const profileRepository: ProfileRepository = new ProfileRepository(getApiService());
const profileService: ProfileService = new ProfileService(profileRepository);

export const getProfileService = (): ProfileService => profileService;
