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
