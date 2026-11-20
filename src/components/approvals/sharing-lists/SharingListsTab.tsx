'use client';

import type { GardenShareListEntry } from '@kk-garden/shared/schemas';
import { Check, ChevronDown, Eye, RefreshCw, Trash2, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserPreviewCard } from '@/components/user-preview-card/UserPreviewCard';
import { gardenViewRoutePaths } from '@/features/ownership/constants/garden-view-route.constants';
import { getGardenSharingService } from '@/services/garden-sharing/garden-sharing.container';
import { cn } from '@/utils/class-names.utils';
import { sharingListsClassNames as classNames } from './sharing-lists-tab.styles';
import { sharingListsTexts as texts } from './texts';
import { useSharingListsTab, type SharingListsScope } from './use-sharing-lists-tab';

type SharingListsTabProps = {
  scope: SharingListsScope;
};

export const SharingListsTab = ({ scope }: SharingListsTabProps): ReactNode => {
  const {
    requests,
    grants,
    isRefreshing,
    isLoadingMore,
    activeActionKey,
    error,
    reloadLists,
    loadMore,
    runAction,
  } = useSharingListsTab(scope);
  const tabContent = useMemo(() => {
    const isViewerList: boolean = scope === 'my-viewers';
    return {
      isViewerList,
      title: isViewerList ? texts.viewersTitle : texts.accessibleTitle,
      pendingTitle: isViewerList ? texts.pendingApplications : texts.pendingRequests,
      activeTitle: isViewerList ? texts.currentViewers : texts.accessibleGardens,
      pendingEmpty: isViewerList ? texts.noPendingApplications : texts.noPendingRequests,
      activeEmpty: isViewerList ? texts.noViewers : texts.noAccessibleGardens,
    };
  }, [scope]);
  const { isViewerList, title, pendingTitle, activeTitle, pendingEmpty, activeEmpty } = tabContent;
  const isActionDisabled = useMemo(
    (): boolean => activeActionKey !== null || isRefreshing || isLoadingMore !== null,
    [activeActionKey, isLoadingMore, isRefreshing],
  );
  const isReloadDisabled = useMemo(
    (): boolean => isRefreshing || activeActionKey !== null,
    [activeActionKey, isRefreshing],
  );
  const reloadLabel = useMemo(
    (): string => (isRefreshing ? texts.reloading : texts.reload),
    [isRefreshing],
  );
  const showLists = useMemo(
    (): boolean => requests !== null && grants !== null,
    [grants, requests],
  );
  const isInitialLoading = useMemo(
    (): boolean => !showLists && isRefreshing,
    [isRefreshing, showLists],
  );
  const hasPendingRequests = useMemo(
    (): boolean => requests !== null && requests.items.length > 0,
    [requests],
  );
  const hasActiveGrants = useMemo(
    (): boolean => grants !== null && grants.items.length > 0,
    [grants],
  );
  const hasMoreRequests = useMemo(
    (): boolean => requests?.hasNextPage === true,
    [requests?.hasNextPage],
  );
  const hasMoreGrants = useMemo((): boolean => grants?.hasNextPage === true, [grants?.hasNextPage]);
  const isLoadingMoreRequests = useMemo(
    (): boolean => isLoadingMore === 'requests',
    [isLoadingMore],
  );
  const isLoadingMoreGrants = useMemo((): boolean => isLoadingMore === 'grants', [isLoadingMore]);
  const pendingCount = useMemo(
    (): string | null =>
      requests === null ? null : `${requests.items.length}${requests.hasNextPage ? '+' : ''}`,
    [requests],
  );
  const activeCount = useMemo(
    (): string | null =>
      grants === null ? null : `${grants.items.length}${grants.hasNextPage ? '+' : ''}`,
    [grants],
  );

  const renderRequestAction = useCallback(
    (entry: GardenShareListEntry): ReactNode => {
      if (isViewerList) {
        const rejectKey: string = `request:${entry.id}:reject`;
        const acceptKey: string = `request:${entry.id}:accept`;
        return (
          <div className={classNames.actions}>
            <IconActionButton
              disabled={isActionDisabled}
              icon={<X aria-hidden="true" />}
              isBusy={activeActionKey === rejectKey}
              label={texts.reject}
              onClick={(): void => {
                void runAction(rejectKey, () => getGardenSharingService().declineRequest(entry.id));
              }}
              variant="outline"
            />
            <IconActionButton
              disabled={isActionDisabled}
              icon={<Check aria-hidden="true" />}
              isBusy={activeActionKey === acceptKey}
              label={texts.accept}
              onClick={(): void => {
                void runAction(acceptKey, () => getGardenSharingService().acceptRequest(entry.id));
              }}
            />
          </div>
        );
      }

      const cancelKey: string = `request:${entry.id}:cancel`;
      return (
        <IconActionButton
          disabled={isActionDisabled}
          icon={<X aria-hidden="true" />}
          isBusy={activeActionKey === cancelKey}
          label={texts.cancelRequest}
          onClick={(): void => {
            void runAction(cancelKey, () => getGardenSharingService().cancelRequest(entry.id));
          }}
          variant="outline"
        />
      );
    },
    [activeActionKey, isActionDisabled, isViewerList, runAction],
  );

  const renderGrantAction = useCallback(
    (entry: GardenShareListEntry): ReactNode => {
      if (!isViewerList) {
        return <ViewGardenButton grantId={entry.id} />;
      }

      const revokeKey: string = `grant:${entry.id}:revoke`;
      return (
        <IconActionButton
          disabled={isActionDisabled}
          icon={<Trash2 aria-hidden="true" />}
          isBusy={activeActionKey === revokeKey}
          label={texts.revokeAccess}
          onClick={(): void => {
            void runAction(revokeKey, () => getGardenSharingService().revokeGrant(entry.id));
          }}
          variant="outline"
        />
      );
    },
    [activeActionKey, isActionDisabled, isViewerList, runAction],
  );

  const pendingCards = useMemo(
    (): ReactNode[] =>
      requests?.items.map((entry): ReactNode => (
        <li key={entry.id}>
          <UserPreviewCard
            action={renderRequestAction(entry)}
            avatarUrl={entry.avatar?.url ?? null}
            displayName={entry.displayName}
            status="pending"
            statusLabel={texts.pending}
          />
        </li>
      )) ?? [],
    [renderRequestAction, requests?.items],
  );
  const activeCards = useMemo(
    (): ReactNode[] =>
      grants?.items.map((entry): ReactNode => (
        <li key={entry.id}>
          <UserPreviewCard
            action={renderGrantAction(entry)}
            avatarUrl={entry.avatar?.url ?? null}
            displayName={entry.displayName}
            status="approved"
            statusLabel={texts.accessGranted}
          />
        </li>
      )) ?? [],
    [grants?.items, renderGrantAction],
  );
  const handleReload = useCallback((): void => {
    if (!isReloadDisabled) {
      void reloadLists();
    }
  }, [isReloadDisabled, reloadLists]);

  return (
    <section aria-label={title} className={classNames.root}>
      <header className={classNames.header}>
        <IconActionButton
          className={classNames.reloadButton}
          disabled={isReloadDisabled}
          icon={<RefreshCw aria-hidden="true" />}
          isBusy={isRefreshing}
          label={reloadLabel}
          onClick={handleReload}
          variant="outline"
        />
      </header>
      {error !== null ? (
        <p className={classNames.error} role="alert">
          {error}
        </p>
      ) : null}
      {!showLists ? (
        isInitialLoading ? (
          <p className={classNames.loading} role="status">
            <Spinner aria-hidden="true" />
            {texts.loading}
          </p>
        ) : null
      ) : (
        <>
          <section aria-label={pendingTitle} className={classNames.section}>
            <h3 className={classNames.sectionTitle}>
              {pendingTitle}
              {pendingCount !== null ? (
                <span className={classNames.pendingCount}>{pendingCount}</span>
              ) : null}
            </h3>
            {!hasPendingRequests ? (
              <p className={classNames.empty}>{pendingEmpty}</p>
            ) : (
              <ul className={classNames.list}>{pendingCards}</ul>
            )}
            {hasMoreRequests ? (
              <IconActionButton
                disabled={isActionDisabled}
                icon={<ChevronDown aria-hidden="true" />}
                isBusy={isLoadingMoreRequests}
                label={texts.loadMoreRequests}
                onClick={(): void => {
                  void loadMore('requests');
                }}
                variant="outline"
              />
            ) : null}
          </section>
          <section aria-label={activeTitle} className={classNames.section}>
            <h3 className={classNames.sectionTitle}>
              {activeTitle}
              {activeCount !== null ? (
                <span className={classNames.approvedCount}>{activeCount}</span>
              ) : null}
            </h3>
            {!hasActiveGrants ? (
              <p className={classNames.empty}>{activeEmpty}</p>
            ) : (
              <ul className={classNames.list}>{activeCards}</ul>
            )}
            {hasMoreGrants ? (
              <IconActionButton
                disabled={isActionDisabled}
                icon={<ChevronDown aria-hidden="true" />}
                isBusy={isLoadingMoreGrants}
                label={texts.loadMoreGrants}
                onClick={(): void => {
                  void loadMore('grants');
                }}
                variant="outline"
              />
            ) : null}
          </section>
        </>
      )}
    </section>
  );
};

type IconActionButtonProps = {
  className?: string;
  disabled: boolean;
  icon: ReactNode;
  isBusy: boolean;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive';
};

const IconActionButton = ({
  className,
  disabled,
  icon,
  isBusy,
  label,
  onClick,
  variant = 'default',
}: IconActionButtonProps): ReactNode => {
  const triggerClassName: string = useMemo(
    (): string => cn(classNames.iconButton, className),
    [className],
  );
  const buttonIcon: ReactNode = useMemo(
    (): ReactNode => (isBusy ? <Spinner aria-hidden="true" /> : icon),
    [icon, isBusy],
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-disabled={disabled}
            aria-label={label}
            className={triggerClassName}
            onClick={onClick}
            size="icon"
            type="button"
            variant={variant}
          />
        }
      >
        {buttonIcon}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

type ViewGardenButtonProps = {
  grantId: string;
};

const ViewGardenButton = ({ grantId }: ViewGardenButtonProps): ReactNode => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          aria-label={texts.viewGarden}
          className={classNames.iconButton}
          nativeButton={false}
          render={<Link href={gardenViewRoutePaths.viewByGrantId(grantId)} />}
          size="icon"
          variant="outline"
        />
      }
    >
      <Eye aria-hidden="true" />
    </TooltipTrigger>
    <TooltipContent>{texts.viewGarden}</TooltipContent>
  </Tooltip>
);
