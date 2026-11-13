import { ApiService } from './api.service';
import { getEnvService } from '@/services/env/env.container';

const apiService: ApiService = new ApiService(getEnvService());

export const getApiService = (): ApiService => apiService;
