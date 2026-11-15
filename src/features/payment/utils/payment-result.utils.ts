import type { SuccessDataAny } from '@kk-garden/shared/errors';

export const getPaymentResultData = <Data extends object>(
  result: SuccessDataAny<Data>,
  fallbackMessage: string,
): Data => {
  if (!result.success) {
    throw result.errors[0] ?? new Error(fallbackMessage);
  }

  if (result.data === undefined) {
    throw new Error(fallbackMessage);
  }

  return result.data;
};

export const getPaymentErrorMessage = (error: unknown, fallbackMessage: string): string =>
  error instanceof Error ? error.message : fallbackMessage;
