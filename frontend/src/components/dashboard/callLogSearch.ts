import { format } from 'date-fns';
import { parseNullableDate, TIME_12H_PATTERN, TIME_12H_SECONDS_PATTERN } from '@/lib/dateFormat';
import { resolveCallStartedAt } from '@/lib/callLogTimestamps';

/** Searchable text: call dates, transcript, result (status), assigned agent. */
export function buildCallLogSearchHaystack(row: Record<string, unknown>): string {
  const parts: string[] = [];

  const callStarted = resolveCallStartedAt(row as Parameters<typeof resolveCallStartedAt>[0]);
  const dateKeys: Array<'started_at' | 'created_at' | 'ended_at'> = ['created_at', 'ended_at'];
  const dates = [
    parseNullableDate(callStarted),
    ...dateKeys.map((key) => parseNullableDate(row[key])),
  ].filter((date): date is Date => date != null);

  for (const date of dates) {
    parts.push(
      format(date, 'MMMM d, yyyy'),
      format(date, 'MMM d, yyyy'),
      format(date, 'MMM d yyyy'),
      format(date, 'yyyy-MM-dd'),
      format(date, 'M/d/yyyy'),
      format(date, TIME_12H_PATTERN),
      format(date, TIME_12H_SECONDS_PATTERN),
      format(date, 'HH:mm'),
      format(date, 'HH:mm:ss'),
    );
  }

  if (row.transcript != null && row.transcript !== '') {
    parts.push(String(row.transcript));
  }

  if (row.status != null && row.status !== '') {
    const status = String(row.status);
    parts.push(status, status.replace(/_/g, ' '));
  }

  if (row.agent_name != null && row.agent_name !== '') {
    parts.push(String(row.agent_name));
  }

  if (typeof row.is_deleted_data === 'boolean') {
    parts.push(row.is_deleted_data ? 'deleted data true' : 'deleted data false', 'active');
  }

  return parts.join(' ').toLowerCase();
}

export function matchCallLogSearch(row: Record<string, unknown>, queryLower: string): boolean {
  if (!queryLower) return true;
  return buildCallLogSearchHaystack(row).includes(queryLower);
}
