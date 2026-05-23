/** Calendar helpers: period filters, outcome rollups, Google Calendar + ICS export. */

export const OUTCOME_KEYS = [
  'qualified',
  'proposal',
  'negotiation',
  'closedWon',
  'noShow',
  'unqualified',
] as const;

export type OutcomeKey = (typeof OUTCOME_KEYS)[number];

export type OutcomeCounts = Record<OutcomeKey, number>;

function parseLocalDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

/** True if `dateStr` falls in the calendar month / quarter / year of `ref` (local time). */
export function meetingInCalendarPeriod(
  dateStr: string,
  period: 'month' | 'quarter' | 'year',
  ref: Date = new Date()
): boolean {
  const d = parseLocalDay(dateStr);
  const y = ref.getFullYear();
  if (d.getFullYear() !== y) {
    return false;
  }
  if (period === 'year') {
    return true;
  }
  const refMonth = ref.getMonth();
  if (period === 'quarter') {
    const refQ = Math.floor(refMonth / 3);
    const dq = Math.floor(d.getMonth() / 3);
    return dq === refQ;
  }
  return d.getMonth() === refMonth;
}

export function filterByOrganization<T extends { organizationId?: string }>(
  rows: T[],
  companyId: string | 'all'
): T[] {
  if (companyId === 'all') return rows;
  return rows.filter((r) => r.organizationId === companyId);
}

export function aggregateOutcomes(
  rows: { date: string; outcome: string | null; organizationId?: string }[],
  period: 'month' | 'quarter' | 'year',
  companyId: string | 'all',
  ref: Date = new Date()
): OutcomeCounts {
  const counts = OUTCOME_KEYS.reduce(
    (acc, k) => {
      acc[k] = 0;
      return acc;
    },
    {} as OutcomeCounts
  );
  const scoped = filterByOrganization(rows, companyId).filter((m) =>
    meetingInCalendarPeriod(m.date, period, ref)
  );
  for (const m of scoped) {
    if (!m.outcome) continue;
    const raw = m.outcome === 'no-show' ? 'noShow' : m.outcome;
    const k = raw as OutcomeKey;
    if (counts[k] !== undefined) counts[k] += 1;
  }
  return counts;
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function gcalDateRange(dateStr: string, timeStr: string, durationMin = 30): string {
  const [Y, M, D] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const start = new Date(Y, M - 1, D, h, mi, 0);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  const f = (d: Date) =>
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
  return `${f(start)}/${f(end)}`;
}

export function googleCalendarUrl(meeting: {
  company: string;
  contact: string;
  date: string;
  time: string;
  title?: string;
  email?: string;
}): string {
  const text = encodeURIComponent(`${meeting.company} — ${meeting.contact}`);
  const details = encodeURIComponent([meeting.title, meeting.email].filter(Boolean).join(' · '));
  const dates = encodeURIComponent(gcalDateRange(meeting.date, meeting.time));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
}

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function icsUtcRange(dateStr: string, timeStr: string, durationMin = 30): { start: string; end: string } {
  const [Y, M, D] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const start = new Date(Y, M - 1, D, h, mi, 0);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  const f = (d: Date) =>
    `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}00Z`;
  return { start: f(start), end: f(end) };
}

export function buildIcsCalendar(
  events: Array<{
    id: string;
    company: string;
    contact: string;
    date: string;
    time: string;
    title?: string;
    email?: string;
  }>
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UP100X//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}00Z`;
  for (const m of events) {
    const uid = `${m.id}@up100x.calendar`;
    const { start: dtStart, end: dtEnd } = icsUtcRange(m.date, m.time);
    const summary = escapeIcsText(`${m.company} — ${m.contact}`);
    const desc = escapeIcsText([m.title, m.email].filter(Boolean).join(' · '));
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${desc}`,
      'END:VEVENT'
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
