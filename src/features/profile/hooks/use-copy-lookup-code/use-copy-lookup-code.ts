'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getLoggerService } from '@/services/logger/logger.container';

type CopyLookupCodeStatus = 'copied' | 'error' | null;

type UseCopyLookupCodeResult = {
  copyLookupCode: () => Promise<void>;
  status: CopyLookupCodeStatus;
};

const copiedStatusDurationMs: number = 2_000;

export const useCopyLookupCode = (lookupCode: string | null): UseCopyLookupCodeResult => {
  const [status, setStatus] = useState<CopyLookupCodeStatus>(null);

  useEffect(() => {
    if (status !== 'copied') {
      return;
    }

    const timeoutId: number = window.setTimeout(() => setStatus(null), copiedStatusDurationMs);

    return (): void => window.clearTimeout(timeoutId);
  }, [status]);

  const copyLookupCode = useCallback(async (): Promise<void> => {
    if (lookupCode === null) {
      return;
    }

    setStatus(null);

    try {
      await navigator.clipboard.writeText(lookupCode);
      setStatus('copied');
    } catch (error: unknown) {
      getLoggerService().error(
        `profile.copyLookupCode: ${error instanceof Error ? error.message : 'Clipboard write failed.'}`,
      );
      setStatus('error');
    }
  }, [lookupCode]);

  return useMemo<UseCopyLookupCodeResult>(
    () => ({ copyLookupCode, status }),
    [copyLookupCode, status],
  );
};
