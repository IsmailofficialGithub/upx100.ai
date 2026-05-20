import React from 'react';
import { CALL_DIRECTION_META, type CallDirection } from '@/lib/callDirection';
import { cn } from '@/lib/utils';

type Props = {
  direction: CallDirection;
  /** Icon size inside the badge (default 20). */
  size?: number;
  className?: string;
  showLabel?: boolean;
};

/** Prominent inbound/outbound indicator beside a phone number. */
export function CallDirectionBadge({ direction, size = 20, className, showLabel = false }: Props) {
  const meta = CALL_DIRECTION_META[direction];
  const Icon = meta.Icon;

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
          meta.badgeClass,
        )}
        title={`${meta.label} call`}
      >
        <Icon size={size} strokeWidth={2.25} className={meta.iconClass} />
      </span>
      {showLabel && (
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          {meta.label}
        </span>
      )}
    </span>
  );
}
