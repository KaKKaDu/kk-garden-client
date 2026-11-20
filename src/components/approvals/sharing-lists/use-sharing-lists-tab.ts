'use client';

import type { GardenShareDirection, GardenShareListResponse } from '@kk-garden/shared/schemas';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getGardenSharingService } from '@/services/garden-sharing/garden-sharing.container';
import type {
  GardenShareActionResult,
  GardenShareListResult,
} from '@/services/garden-sharing/garden-sharing.types';
import { sharingListsTexts as texts } from './texts';

export type SharingListsScope = 'accessible-gardens' | 'my-viewers';
export type SharingListKind = 'requests' | 'grants';
export type SharingListsAction = (
  actionKey: string,
  action: () => Promise<GardenShareActionResult>,
) => Promise<void>;

export type UseSharingListsTabResult = {
  requests: GardenShareListResponse | null;
  grants: GardenShareListResponse | null;
  isRefreshing: boolean;
  isLoadingMore: SharingListKind | null;
  activeActionKey: string | null;
  error: string | null;
  reloadLists: () => Promise<void>;
  loadMore: (kind: SharingListKind) => Promise<void>;
  runAction: SharingListsAction;
};

const pageSize: number = 50;

const getListResultError = (result: GardenShareListResult): string | null => {
  if (!result.success) {
    return result.errors[0]?.message ?? texts.loadError;
  }
  return result.data === undefined ? texts.loadError : null;
};

export const useSharingListsTab = (scope: SharingListsScope): UseSharingListsTabResult => {
  const { requestDirection, grantDirection } = useMemo(
    (): { requestDirection: GardenShareDirection; grantDirection: GardenShareDirection } => ({
      requestDirection: scope === 'my-viewers' ? 'incoming' : 'outgoing',
      grantDirection: scope === 'my-viewers' ? 'outgoing' : 'incoming',
    }),
    [scope],
  );

  const [requests, setRequests] = useState<GardenShareListResponse | null>(null);
  const [grants, setGrants] = useState<GardenShareListResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<SharingListKind | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadSequence = useRef<number>(0);
  const actionLock = useRef<boolean>(false);

  const reloadLists = useCallback(async (): Promise<void> => {
    const sequence: number = loadSequence.current + 1;
    loadSequence.current = sequence;
    setIsRefreshing(true);
    setIsLoadingMore(null);
    setError(null);

    const [requestResult, grantResult] = await Promise.all([
      getGardenSharingService().listRequests({
        direction: requestDirection,
        page: 1,
        pageSize,
      }),
      getGardenSharingService().listGrants({
        direction: grantDirection,
        page: 1,
        pageSize,
      }),
    ]);

    if (loadSequence.current !== sequence) {
      return;
    }

    const requestError: string | null = getListResultError(requestResult);
    const grantError: string | null = getListResultError(grantResult);
    if (requestError !== null || grantError !== null) {
      setError(requestError ?? grantError);
      setIsRefreshing(false);
      return;
    }

    if (
      !requestResult.success ||
      requestResult.data === undefined ||
      !grantResult.success ||
      grantResult.data === undefined
    ) {
      setError(texts.loadError);
      setIsRefreshing(false);
      return;
    }

    setRequests(requestResult.data);
    setGrants(grantResult.data);
    setIsRefreshing(false);
  }, [grantDirection, requestDirection]);

  useEffect((): (() => void) => {
    const timeoutId: number = window.setTimeout((): void => {
      void reloadLists();
    }, 0);
    return (): void => {
      window.clearTimeout(timeoutId);
      loadSequence.current += 1;
    };
  }, [reloadLists]);

  const loadMore = useCallback(
    async (kind: SharingListKind): Promise<void> => {
      const currentList: GardenShareListResponse | null = kind === 'requests' ? requests : grants;
      if (
        currentList === null ||
        !currentList.hasNextPage ||
        isLoadingMore !== null ||
        isRefreshing ||
        activeActionKey !== null
      ) {
        return;
      }

      const sequence: number = loadSequence.current;
      setIsLoadingMore(kind);
      setError(null);
      const query = {
        direction: kind === 'requests' ? requestDirection : grantDirection,
        page: currentList.page + 1,
        pageSize,
      };
      const result: GardenShareListResult =
        kind === 'requests'
          ? await getGardenSharingService().listRequests(query)
          : await getGardenSharingService().listGrants(query);

      if (loadSequence.current !== sequence) {
        return;
      }

      const resultError: string | null = getListResultError(result);
      if (resultError !== null) {
        setError(resultError);
        setIsLoadingMore(null);
        return;
      }
      if (!result.success || result.data === undefined) {
        setError(texts.loadError);
        setIsLoadingMore(null);
        return;
      }

      const nextPage: GardenShareListResponse = result.data;
      const appendPage = (previous: GardenShareListResponse | null): GardenShareListResponse =>
        previous === null
          ? nextPage
          : { ...nextPage, items: [...previous.items, ...nextPage.items] };

      if (kind === 'requests') {
        setRequests(appendPage);
      } else {
        setGrants(appendPage);
      }
      setIsLoadingMore(null);
    },
    [
      activeActionKey,
      grantDirection,
      isLoadingMore,
      isRefreshing,
      requestDirection,
      requests,
      grants,
    ],
  );

  const runAction = useCallback(
    async (actionKey: string, action: () => Promise<GardenShareActionResult>): Promise<void> => {
      if (actionLock.current || isRefreshing || isLoadingMore !== null) {
        return;
      }

      actionLock.current = true;
      setActiveActionKey(actionKey);
      setError(null);
      const result: GardenShareActionResult = await action();

      if (!result.success || result.data?.success !== true) {
        setError(
          result.success ? texts.actionError : (result.errors[0]?.message ?? texts.actionError),
        );
        actionLock.current = false;
        setActiveActionKey(null);
        return;
      }

      await reloadLists();
      actionLock.current = false;
      setActiveActionKey(null);
    },
    [isLoadingMore, isRefreshing, reloadLists],
  );

  return useMemo(
    (): UseSharingListsTabResult => ({
      requests,
      grants,
      isRefreshing,
      isLoadingMore,
      activeActionKey,
      error,
      reloadLists,
      loadMore,
      runAction,
    }),
    [
      requests,
      grants,
      isRefreshing,
      isLoadingMore,
      activeActionKey,
      error,
      reloadLists,
      loadMore,
      runAction,
    ],
  );
};
