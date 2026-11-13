import { EnvService } from './env.service';

const envService: EnvService = new EnvService();

export const getEnvService = (): EnvService => envService;
