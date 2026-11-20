'use client';

import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { CircleButton } from '@/components/ui/circle-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { approvalRoutePaths } from '@/features/approvals/constants/approval-route.constants';
import { ProjectStyleMenuIcon } from '../ProjectStyleMenuIcon/ProjectStyleMenuIcon';
import {
  gardenSharingButtonClassNames as classNames,
  getGardenSharingButtonClassName,
} from './garden-sharing-button.styles';
import { gardenSharingButtonTexts as texts } from './texts';

type GardenSharingButtonProps = {
  isActive: boolean;
  isMenuOpen: boolean;
  isMobile: boolean | null;
  onNavigate: () => void;
};

export const GardenSharingButton = ({
  isActive,
  isMenuOpen,
  isMobile,
  onNavigate,
}: GardenSharingButtonProps): ReactNode => {
  const isMobileMenuClosed: boolean = useMemo(
    (): boolean => isMobile !== false && !isMenuOpen,
    [isMenuOpen, isMobile],
  );
  const triggerClassName: string = useMemo(
    (): string => getGardenSharingButtonClassName(isMenuOpen, isActive),
    [isActive, isMenuOpen],
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <CircleButton
            aria-current={isActive ? 'page' : undefined}
            aria-hidden={isMobileMenuClosed}
            aria-label={texts.openApprovals}
            className={triggerClassName}
            nativeButton={false}
            onClick={onNavigate}
            render={<Link href={approvalRoutePaths.page} />}
            tabIndex={isMobileMenuClosed ? -1 : 0}
          />
        }
      >
        <ProjectStyleMenuIcon className={classNames.icon} name="list" />
      </TooltipTrigger>
      <TooltipContent align="center" side="right">
        {texts.openApprovals}
      </TooltipContent>
    </Tooltip>
  );
};
