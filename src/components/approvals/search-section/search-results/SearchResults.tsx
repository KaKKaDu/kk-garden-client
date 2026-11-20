'use client';

import type { GardenShareLookupResponse } from '@kk-garden/shared/schemas';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserPreviewCard } from '@/components/user-preview-card/UserPreviewCard';
import type { SearchRequestFeedback } from '../search-section.types';
import { searchResultsClassNames as classNames } from './search-results.styles';
import { searchResultsTexts as texts } from './texts';

type SearchResultsProps = {
  error: string | null;
  hasLookupInput: boolean;
  isSearching: boolean;
  isSelf: boolean;
  profile: GardenShareLookupResponse | null;
  requestAction: ReactNode;
  requestFeedback: SearchRequestFeedback | null;
};

export const SearchResults = ({
  error,
  hasLookupInput,
  isSearching,
  isSelf,
  profile,
  requestAction,
  requestFeedback,
}: SearchResultsProps): ReactNode => {
  const avatarUrl: string | null = useMemo(
    (): string | null => profile?.avatar?.url ?? null,
    [profile?.avatar?.url],
  );
  const isEmpty: boolean = useMemo(
    (): boolean => !isSearching && error === null && profile === null,
    [error, isSearching, profile],
  );
  const emptyMessage: string = useMemo(
    (): string => (hasLookupInput ? texts.completeLookupCode : texts.prompt),
    [hasLookupInput],
  );
  const relationshipIndicators: ReactNode = useMemo((): ReactNode => {
    if (profile === null || isSelf) {
      return null;
    }
    return (
      <>
        <AccessIndicator
          direction="incoming"
          granted={profile.targetHasAccessToRequesterGarden}
          label={
            profile.targetHasAccessToRequesterGarden
              ? texts.theyCanAccessYourGarden
              : texts.theyCannotAccessYourGarden
          }
        />
        <AccessIndicator
          direction="outgoing"
          granted={profile.requesterHasAccessToTargetGarden}
          label={
            profile.requesterHasAccessToTargetGarden
              ? texts.youCanAccessTheirGarden
              : texts.youCannotAccessTheirGarden
          }
        />
      </>
    );
  }, [isSelf, profile]);
  const cardStatus = useMemo(
    (): 'approved' | 'pending' | undefined =>
      isSelf
        ? undefined
        : profile?.requesterHasAccessToTargetGarden === true
          ? 'approved'
          : profile?.requesterHasPendingRequestToTarget === true
            ? 'pending'
            : undefined,
    [
      isSelf,
      profile?.requesterHasAccessToTargetGarden,
      profile?.requesterHasPendingRequestToTarget,
    ],
  );
  return (
    <section aria-label={texts.sectionLabel} className={classNames.root}>
      {isSearching ? (
        <p aria-live="polite" className={classNames.status} role="status">
          <Spinner aria-hidden="true" />
          {texts.searching}
        </p>
      ) : null}
      {error !== null ? (
        <p className={classNames.error} role="alert">
          {error}
        </p>
      ) : null}
      {profile !== null ? (
        <ul className={classNames.list}>
          <li>
            <UserPreviewCard
              action={isSelf ? undefined : requestAction}
              avatarUrl={avatarUrl}
              displayName={profile.displayName}
              relationshipIndicators={relationshipIndicators}
              status={cardStatus}
              statusLabel={isSelf ? texts.youBadge : undefined}
            />
          </li>
        </ul>
      ) : null}
      {requestFeedback?.kind === 'error' ? (
        <p className={classNames.error} role="alert">
          {requestFeedback.message}
        </p>
      ) : null}
      {isEmpty ? <p className={classNames.empty}>{emptyMessage}</p> : null}
    </section>
  );
};

type AccessIndicatorProps = {
  direction: 'incoming' | 'outgoing';
  granted: boolean;
  label: string;
};

const AccessIndicator = ({ direction, granted, label }: AccessIndicatorProps): ReactNode => {
  const ArrowIcon = direction === 'incoming' ? ArrowLeft : ArrowRight;
  const indicatorClassName = !granted
    ? classNames.indicatorInactive
    : direction === 'incoming'
      ? classNames.incomingIndicator
      : classNames.outgoingIndicator;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            aria-label={label}
            className={`${classNames.indicator} ${indicatorClassName}`}
            role="img"
            tabIndex={0}
          />
        }
      >
        <ArrowIcon aria-hidden="true" className={classNames.indicatorIcon} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
