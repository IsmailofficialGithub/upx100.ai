import type { OutcomeKey } from '@/lib/calendarExport';

export type CalendarMeeting = {
  id: string;
  organizationId: string;
  date: string;
  time: string;
  company: string;
  contact: string;
  email: string;
  title: string;
  status: 'confirmed' | 'upcoming' | 'completed' | 'rescheduled';
  outcome: OutcomeKey | null;
  transcript: { speaker: string; text: string }[];
  notes?: string;
  phone?: string;
  agentName?: string;
  meetingTimezone?: string;
  aiStrategy?: string;
  /** true when lead was created from an AI agent call booking */
  bookedByAgent?: boolean;
};

type ApiLead = {
  id: string;
  organization_id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  notes?: string | null;
  meeting_time?: string | null;
  meeting_date?: string | null;
  meeting_timezone?: string | null;
  meeting_outcome?: string | null;
  organization_name?: string | null;
  agent_name?: string | null;
  agent_id?: string | null;
  call_log_id?: string | null;
  created_at?: string | null;
};

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function localYmdHm(d: Date): { date: string; time: string } {
  return {
    date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    time: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
  };
}

function localTodayYmd(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

function isScheduledInPast(dateStr: string, timeStr: string): boolean {
  const today = localTodayYmd();
  if (dateStr < today) return true;
  if (dateStr > today) return false;

  const [h, mi] = timeStr.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(mi)) return false;

  const now = new Date();
  const meetingDt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, mi, 0, 0);
  return meetingDt.getTime() < now.getTime();
}

function normalizeStoredOutcome(raw: string | null | undefined): OutcomeKey | null {
  if (raw == null || raw === '') return null;
  if (raw === 'no-show' || raw === 'no_show') return 'noShow';
  if (raw === 'closed-won' || raw === 'closed_won') return 'closedWon';
  const keys: OutcomeKey[] = [
    'qualified',
    'proposal',
    'negotiation',
    'closedWon',
    'noShow',
    'unqualified',
  ];
  return keys.includes(raw as OutcomeKey) ? (raw as OutcomeKey) : null;
}

function resolveSchedule(lead: ApiLead): { date: string; time: string } | null {
  if (lead.meeting_time) {
    const d = new Date(lead.meeting_time);
    if (!Number.isNaN(d.getTime())) return localYmdHm(d);
  }
  if (lead.meeting_date) {
    const m = String(lead.meeting_date).match(/(\d{4}-\d{2}-\d{2})/);
    if (m) return { date: m[1], time: '10:00' };
  }
  if (lead.status === 'success' || lead.status === 'follow_up') {
    if (lead.created_at) {
      const d = new Date(lead.created_at);
      if (!Number.isNaN(d.getTime())) return localYmdHm(d);
    }
  }
  return null;
}

function mapLeadStatusToCalendar(
  leadStatus: string,
  dateStr: string,
  timeStr: string
): CalendarMeeting['status'] {
  const isPast = isScheduledInPast(dateStr, timeStr);
  if (isPast) return 'completed';

  switch (leadStatus) {
    case 'success':
      return 'confirmed';
    case 'follow_up':
    case 'warm':
    case 'new':
      return 'upcoming';
    case 'cold':
      return 'completed';
    default:
      return 'upcoming';
  }
}

function mapLeadStatusToOutcome(
  leadStatus: string,
  calendarStatus: CalendarMeeting['status']
): OutcomeKey | null {
  switch (leadStatus) {
    case 'success':
      return calendarStatus === 'confirmed' ? 'closedWon' : null;
    case 'follow_up':
    case 'warm':
      return 'qualified';
    case 'cold':
      return 'unqualified';
    default:
      return null;
  }
}

/** Outcome for tracker: stored value, status mapping, or default for any scheduled meeting. */
export function resolveMeetingOutcome(
  lead: ApiLead,
  calendarStatus: CalendarMeeting['status']
): OutcomeKey | null {
  const stored = normalizeStoredOutcome(lead.meeting_outcome);
  if (stored) return stored;

  const fromStatus = mapLeadStatusToOutcome(lead.status || 'new', calendarStatus);
  if (fromStatus) return fromStatus;

  if (lead.meeting_time || lead.meeting_date) {
    if (lead.status === 'cold') return 'unqualified';
    return 'qualified';
  }

  return null;
}

export function mapLeadToCalendarMeeting(lead: ApiLead): CalendarMeeting | null {
  const schedule = resolveSchedule(lead);
  if (!schedule) return null;

  const status = lead.status || 'new';
  const calendarStatus = mapLeadStatusToCalendar(status, schedule.date, schedule.time);
  const bookedByAgent = Boolean(lead.call_log_id || lead.agent_id);

  return {
    id: lead.id,
    organizationId: lead.organization_id || '',
    date: schedule.date,
    time: schedule.time,
    company: lead.organization_name || lead.notes || 'Lead',
    contact: lead.name || 'Unknown contact',
    email: lead.email || '',
    title: lead.agent_name ? `Agent: ${lead.agent_name}` : 'Meeting',
    status: calendarStatus,
    outcome: resolveMeetingOutcome(lead, calendarStatus),
    transcript: [],
    notes: lead.notes || undefined,
    phone: lead.phone || undefined,
    agentName: lead.agent_name || undefined,
    meetingTimezone: lead.meeting_timezone || undefined,
    bookedByAgent,
  };
}

export function buildMeetingTimestamp(date: string, time: string): string {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  return new Date(y, mo - 1, d, h, mi, 0, 0).toISOString();
}

/** Map calendar form status/outcome to inbound.lead_status. */
export function calendarFormToLeadStatus(
  calendarStatus: string,
  outcome: string | null
): 'new' | 'warm' | 'cold' | 'success' | 'follow_up' {
  if (outcome === 'closedWon') {
    return calendarStatus === 'confirmed' ? 'success' : 'follow_up';
  }
  if (outcome === 'unqualified' || outcome === 'noShow') return 'cold';
  if (outcome === 'qualified' || outcome === 'proposal' || outcome === 'negotiation') return 'warm';
  switch (calendarStatus) {
    case 'completed':
      return 'warm';
    case 'upcoming':
      return 'warm';
    case 'rescheduled':
      return 'follow_up';
    case 'confirmed':
    default:
      return 'follow_up';
  }
}

export function parseCallLogTranscript(raw: string | null | undefined): { speaker: string; text: string }[] {
  if (!raw?.trim()) return [];
  return raw
    .split('\n')
    .filter((line) => line.includes(':'))
    .map((line) => {
      const [speaker, ...rest] = line.split(':');
      return { speaker: speaker.trim(), text: rest.join(':').trim() };
    });
}
