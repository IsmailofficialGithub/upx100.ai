import { calendarDaysSince, formatCalendarDaysAgo, formatNullableDate, parseNullableDate } from '@/lib/dateFormat';

/** Compliance matrix code — participant erasure disposition (PII removed from call record). */
export const PARTICIPANT_ERASURE_COMPLIANCE_CODE = 'PED';

export const PARTICIPANT_ERASURE_COMPLIANCE_TITLE =
  'Participant erasure disposition — caller PII removed; call metadata may remain for audit';

export type PedLedgerRow = {
  created_at?: string | null;
  deleted_data_at?: string | null;
};

/** When erasure was recorded (display). */
export function pedLedgerOpenedAt(row: PedLedgerRow): string | null {
  return row.deleted_data_at ?? row.created_at ?? null;
}

/** Elapsed clock starts when the call log record was created. */
export function pedElapsedAnchor(row: PedLedgerRow): string | null {
  return row.created_at ?? row.deleted_data_at ?? null;
}

export function pedElapsedLabel(row: PedLedgerRow): { label: string; title: string; openedAt: string | null } {
  const anchor = pedElapsedAnchor(row);
  if (!anchor) {
    return { label: '—', title: 'No created_at on this call log', openedAt: null };
  }
  const days = calendarDaysSince(anchor);
  return {
    label: formatCalendarDaysAgo(days),
    openedAt: anchor,
    title: `PED case opened on call log created ${formatNullableDate(anchor, 'MMM d, yyyy')}. Day 0 = Today; day 1 = next calendar day (1 day ago).`,
  };
}

export function sortPedLedgerRows<T extends PedLedgerRow>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const ta = parseNullableDate(pedElapsedAnchor(a))?.getTime() ?? 0;
    const tb = parseNullableDate(pedElapsedAnchor(b))?.getTime() ?? 0;
    return tb - ta;
  });
}
