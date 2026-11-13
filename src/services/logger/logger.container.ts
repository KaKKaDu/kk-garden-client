import { LoggerService } from './logger.service';

const loggerService: LoggerService = new LoggerService();

export const getLoggerService = (): LoggerService => loggerService;
