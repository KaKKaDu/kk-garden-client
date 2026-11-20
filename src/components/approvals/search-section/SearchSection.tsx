'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Clock, Send } from 'lucide-react';
import {
  ProfileLookupCardRequestSchema,
  type ProfileLookupCardRequest,
  type GardenShareLookupResponse,
} from '@kk-garden/shared/schemas';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileStore } from '@/features/profile/store/profile.store';
import { getGardenSharingService } from '@/services/garden-sharing/garden-sharing.container';
import type { GardenShareRequestResult } from '@/services/garden-sharing/garden-sharing.types';
import { SearchBar } from './search-bar/SearchBar';
import { SearchResults } from './search-results/SearchResults';
import { searchSectionClassNames as classNames } from './search-section.styles';
import { searchSectionTexts as texts } from './texts';
import type { SearchRequestFeedback } from './search-section.types';

const profileLookupDebounceMs: number = 350;

export const SearchSection = (): ReactNode => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<ProfileLookupCardRequest>({
    defaultValues: { lookupCode: '' },
    mode: 'onChange',
    resolver: zodResolver(ProfileLookupCardRequestSchema),
  });
  const watchedLookupCode = useWatch({ control, name: 'lookupCode' });
  const lookupCode: string = useMemo((): string => watchedLookupCode ?? '', [watchedLookupCode]);
  const currentProfileLookupCode = useProfileStore((state) => state.profile?.lookupCode ?? null);
  const lookupValidation = useMemo(
    () => ProfileLookupCardRequestSchema.safeParse({ lookupCode }),
    [lookupCode],
  );
  const isLookupCodeValid: boolean = useMemo(
    (): boolean => lookupValidation.success,
    [lookupValidation],
  );
  const validLookupCode: string = useMemo(
    (): string => (lookupValidation.success ? lookupValidation.data.lookupCode : ''),
    [lookupValidation],
  );
  const isSelfLookup: boolean = useMemo(
    (): boolean =>
      currentProfileLookupCode !== null && validLookupCode === currentProfileLookupCode,
    [currentProfileLookupCode, validLookupCode],
  );
  const hasLookupInput: boolean = useMemo(
    (): boolean => lookupCode.trim().length > 0,
    [lookupCode],
  );
  const lookupCodeError: string | null = useMemo((): string | null => {
    if (!hasLookupInput || lookupCode.length < 16 || isLookupCodeValid) {
      return null;
    }

    return errors.lookupCode?.message ?? texts.invalidLookupCode;
  }, [errors.lookupCode?.message, hasLookupInput, isLookupCodeValid, lookupCode.length]);

  const [profileCard, setProfileCard] = useState<GardenShareLookupResponse | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<boolean>(false);
  const [requestFeedback, setRequestFeedback] = useState<SearchRequestFeedback | null>(null);
  const lookupSequence = useRef<number>(0);
  const isRequestInProgress = useRef<boolean>(false);
  const isSearchPending: boolean = useMemo(
    (): boolean => isLookupCodeValid && profileCard === null && lookupError === null,
    [isLookupCodeValid, lookupError, profileCard],
  );
  const visibleRequestFeedback: SearchRequestFeedback | null = useMemo(
    (): SearchRequestFeedback | null =>
      requestFeedback?.lookupCode === validLookupCode ? requestFeedback : null,
    [requestFeedback, validLookupCode],
  );
  const hasRequestBeenSent: boolean = useMemo(
    (): boolean => visibleRequestFeedback?.kind === 'success',
    [visibleRequestFeedback?.kind],
  );
  const requestButtonLabel: string = useMemo((): string => {
    if (isSubmittingRequest) {
      return texts.requestingAccess;
    }
    if (hasRequestBeenSent) {
      return texts.requestSentButton;
    }
    if (profileCard?.requesterHasAccessToTargetGarden) {
      return texts.alreadyHasAccess;
    }
    if (profileCard?.requesterHasPendingRequestToTarget) {
      return texts.requestPending;
    }
    return texts.requestAccess;
  }, [
    hasRequestBeenSent,
    isSubmittingRequest,
    profileCard?.requesterHasAccessToTargetGarden,
    profileCard?.requesterHasPendingRequestToTarget,
  ]);
  const isRequestActionDisabled: boolean = useMemo(
    (): boolean =>
      isSelfLookup ||
      isSubmittingRequest ||
      hasRequestBeenSent ||
      Boolean(
        profileCard?.requesterHasAccessToTargetGarden ||
        profileCard?.requesterHasPendingRequestToTarget,
      ),
    [
      hasRequestBeenSent,
      isSelfLookup,
      isSubmittingRequest,
      profileCard?.requesterHasAccessToTargetGarden,
      profileCard?.requesterHasPendingRequestToTarget,
    ],
  );
  const requestButtonIcon: ReactNode = useMemo((): ReactNode => {
    if (isSubmittingRequest) {
      return <Spinner aria-hidden="true" />;
    }
    if (hasRequestBeenSent || profileCard?.requesterHasAccessToTargetGarden) {
      return <Check aria-hidden="true" />;
    }
    if (profileCard?.requesterHasPendingRequestToTarget) {
      return <Clock aria-hidden="true" />;
    }
    return <Send aria-hidden="true" />;
  }, [
    hasRequestBeenSent,
    isSubmittingRequest,
    profileCard?.requesterHasAccessToTargetGarden,
    profileCard?.requesterHasPendingRequestToTarget,
  ]);

  const handleLookupCodeChange = useCallback(
    (nextLookupCode: string): void => {
      if (nextLookupCode === lookupCode) {
        return;
      }

      lookupSequence.current += 1;
      setValue('lookupCode', nextLookupCode, { shouldDirty: true, shouldValidate: true });
      setProfileCard(null);
      setLookupError(null);
      setRequestFeedback(null);
    },
    [lookupCode, setValue],
  );

  const handleRequestAccess = useCallback(async (): Promise<void> => {
    if (profileCard === null || !isLookupCodeValid) {
      setRequestFeedback({
        kind: 'error',
        lookupCode: validLookupCode,
        message: texts.searchBeforeRequest,
      });
      return;
    }

    if (isSelfLookup) {
      return;
    }

    if (isRequestActionDisabled || isRequestInProgress.current) {
      return;
    }

    const requestLookupCode: string = validLookupCode;
    const requestLookupSequence: number = lookupSequence.current;
    isRequestInProgress.current = true;
    setIsSubmittingRequest(true);
    setRequestFeedback(null);

    try {
      const result: GardenShareRequestResult =
        await getGardenSharingService().createRequest(requestLookupCode);

      if (!result.success) {
        setRequestFeedback({
          kind: 'error',
          lookupCode: requestLookupCode,
          message: result.errors[0]?.message ?? texts.requestError,
        });
        return;
      }

      if (result.data === undefined) {
        setRequestFeedback({
          kind: 'error',
          lookupCode: requestLookupCode,
          message: texts.requestError,
        });
        return;
      }

      if (lookupSequence.current === requestLookupSequence) {
        setProfileCard((current) =>
          current === null ? null : { ...current, requesterHasPendingRequestToTarget: true },
        );
      }
      setRequestFeedback({
        kind: 'success',
        lookupCode: requestLookupCode,
      });
    } finally {
      isRequestInProgress.current = false;
      setIsSubmittingRequest(false);
    }
  }, [isLookupCodeValid, isRequestActionDisabled, isSelfLookup, profileCard, validLookupCode]);

  useEffect((): (() => void) | void => {
    if (!isLookupCodeValid) {
      return;
    }

    const sequence: number = lookupSequence.current + 1;
    lookupSequence.current = sequence;
    const timeoutId: number = window.setTimeout((): void => {
      void getGardenSharingService()
        .lookupProfileCard(validLookupCode)
        .then((result): void => {
          if (lookupSequence.current !== sequence) {
            return;
          }

          if (!result.success) {
            setLookupError(result.errors[0]?.message ?? texts.lookupError);
            return;
          }

          if (result.data === undefined) {
            setLookupError(texts.lookupError);
            return;
          }

          setProfileCard(result.data);
        });
    }, profileLookupDebounceMs);

    return (): void => {
      window.clearTimeout(timeoutId);
      lookupSequence.current += 1;
    };
  }, [isLookupCodeValid, lookupCode, validLookupCode]);

  const requestAction: ReactNode = useMemo(
    (): ReactNode =>
      profileCard === null || isSelfLookup ? null : (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-disabled={isRequestActionDisabled}
                aria-label={requestButtonLabel}
                className={classNames.requestButton}
                onClick={handleRequestAccess}
                size="icon-lg"
                type="button"
                variant="default"
              />
            }
          >
            {requestButtonIcon}
          </TooltipTrigger>
          <TooltipContent>{requestButtonLabel}</TooltipContent>
        </Tooltip>
      ),
    [
      handleRequestAccess,
      isRequestActionDisabled,
      isSelfLookup,
      profileCard,
      requestButtonIcon,
      requestButtonLabel,
    ],
  );

  return (
    <section aria-label={texts.sectionLabel} className={classNames.root}>
      <SearchBar
        errorMessage={lookupCodeError}
        lookupCode={lookupCode}
        onLookupCodeChange={handleLookupCodeChange}
      />
      <SearchResults
        error={lookupError}
        hasLookupInput={hasLookupInput}
        isSearching={isSearchPending}
        isSelf={isSelfLookup}
        profile={profileCard}
        requestAction={requestAction}
        requestFeedback={visibleRequestFeedback}
      />
    </section>
  );
};
