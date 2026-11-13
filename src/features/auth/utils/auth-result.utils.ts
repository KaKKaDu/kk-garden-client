import type { SuccessDataAny } from '@kk-garden/shared/errors';

export const getAuthOperationErrorMessage = <Data extends object>(
  result: SuccessDataAny<Data>,
  fallbackMessage: string,
): string | null => {
  if (result.success) {
    return null;
  }

  return result.errors[0]?.message ?? fallbackMessage;
};
