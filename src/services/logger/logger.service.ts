import type { AppError, SuccessDataAny } from '@kk-garden/shared/errors';

type LogLevel = 'info' | 'error' | 'warn';

export class LoggerService {
  public log(level: LogLevel, message: string): void {
    switch (level) {
      case 'info':
        console.info(message);
        break;
      case 'error':
        console.error(message);
        break;
      case 'warn':
        console.warn(message);
        break;
    }
  }

  public error(message: string): void {
    this.log('error', message);
  }

  public info(message: string): void {
    this.log('info', message);
  }

  public warn(message: string): void {
    this.log('warn', message);
  }

  public report(context: string, data: SuccessDataAny): void {
    if (data.success) {
      this.info(`Operation successful: ${context}`);
      return;
    }

    const errorDetails: string = data.errors
      .map((error: AppError): string => `- ${error.status ?? ''}: ${error.message}`)
      .join('\n');

    this.error(`Operation failed: ${context}\nErrors: ${errorDetails}`);
  }
}
