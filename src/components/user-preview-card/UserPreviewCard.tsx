import type { ReactNode } from 'react';
import { UserRound } from 'lucide-react';
import { cn } from '@/utils/class-names.utils';
import { userPreviewCardClassNames as classNames } from './user-preview-card.styles';

type UserPreviewCardProps = {
  action?: ReactNode;
  avatarUrl: string | null;
  displayName: string;
  relationshipIndicators?: ReactNode;
  status?: 'approved' | 'pending';
  statusLabel?: string;
};

export const UserPreviewCard = ({
  action,
  avatarUrl,
  displayName,
  relationshipIndicators,
  status,
  statusLabel,
}: UserPreviewCardProps): ReactNode => (
  <article
    className={cn(
      classNames.root,
      status === 'approved' ? classNames.approvedStatus : undefined,
      status === 'pending' ? classNames.pendingStatus : undefined,
    )}
  >
    {relationshipIndicators !== undefined ? (
      <div className={classNames.relationshipIndicators}>{relationshipIndicators}</div>
    ) : null}
    <div className={classNames.profile}>
      <span aria-hidden="true" className={classNames.avatarFrame}>
        <span className={classNames.avatar}>
          {avatarUrl !== null ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className={classNames.avatarImage} src={avatarUrl} />
          ) : (
            <UserRound className={classNames.avatarFallback} />
          )}
        </span>
      </span>
      <div className={classNames.details}>
        <h3 className={classNames.name}>{displayName}</h3>
        {statusLabel !== undefined ? (
          <span
            className={cn(
              classNames.statusLabel,
              status === 'pending' ? classNames.pendingLabel : classNames.approvedLabel,
            )}
          >
            {statusLabel}
          </span>
        ) : null}
      </div>
    </div>
    {action !== undefined ? <div className={classNames.action}>{action}</div> : null}
  </article>
);
