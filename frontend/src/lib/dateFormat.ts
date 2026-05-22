import { format } from 'date-fns';

export const EMPTY_DATE = '—';

export function parseNullableDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

export function formatNullableDate(value: unknown, pattern = 'MMM d, yyyy') {
  const date = parseNullableDate(value);
  return date ? format(date, pattern) : EMPTY_DATE;
}

export function formatNullableLocaleDate(value: unknown) {
  const date = parseNullableDate(value);
  return date ? date.toLocaleDateString() : EMPTY_DATE;
}

/** Whole calendar days between a date (local) and today — 0 = same day, 1 = yesterday, etc. */
export function calendarDaysSince(value: unknown): number | null {
  const date = parseNullableDate(value);
  if (!date) return null;
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffMs = todayStart.getTime() - start.getTime();
  if (diffMs < 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatCalendarDaysAgo(days: number | null): string {
  if (days == null) return EMPTY_DATE;
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}
