import { Phone, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CallDirection = 'inbound' | 'outbound' | 'unknown';

export type CallDirectionFilter = 'all' | CallDirection;

export function normalizeCallDirection(raw: unknown): CallDirection {
  if (raw == null || raw === '') return 'unknown';
  const s = String(raw).toLowerCase();
  if (s === 'inbound' || s.includes('inbound')) return 'inbound';
  if (s === 'outbound' || s.includes('outbound')) return 'outbound';
  return 'unknown';
}

export function getCallDirection(row: {
  call_direction?: unknown;
  direction?: unknown;
  call_type?: unknown;
}): CallDirection {
  return normalizeCallDirection(row.call_direction ?? row.direction ?? row.call_type);
}

export function matchesDirectionFilter(
  direction: CallDirection,
  filter: CallDirectionFilter,
): boolean {
  if (filter === 'all') return true;
  if (filter === 'unknown') return direction === 'unknown';
  return direction === filter;
}

export const CALL_DIRECTION_META: Record<
  CallDirection,
  { label: string; shortLabel: string; Icon: LucideIcon; badgeClass: string; iconClass: string }
> = {
  inbound: {
    label: 'Inbound',
    shortLabel: 'In',
    Icon: PhoneIncoming,
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  outbound: {
    label: 'Outbound',
    shortLabel: 'Out',
    Icon: PhoneOutgoing,
    badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    iconClass: 'text-sky-600 dark:text-sky-400',
  },
  unknown: {
    label: 'Unknown',
    shortLabel: '?',
    Icon: Phone,
    badgeClass: 'bg-[hsl(var(--muted))]/80 text-[hsl(var(--muted-foreground))] border-[hsl(var(--border-v))]',
    iconClass: 'text-[hsl(var(--muted-foreground))]',
  },
};
