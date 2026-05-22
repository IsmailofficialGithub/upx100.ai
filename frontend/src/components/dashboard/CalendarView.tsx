import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import api from '@/lib/api';
import {
  type CalendarMeeting,
  buildMeetingTimestamp,
  calendarFormToLeadStatus,
  mapLeadToCalendarMeeting,
  parseCallLogTranscript,
} from '@/lib/mapLeadToCalendarMeeting';
import StatusBadge from '@/components/shared/StatusBadge';
import AudioPlayer from '@/components/shared/AudioPlayer';
import {
  aggregateOutcomes,
  buildIcsCalendar,
  downloadTextFile,
  filterByOrganization,
  googleCalendarUrl,
  meetingInCalendarPeriod,
  OUTCOME_KEYS,
} from '@/lib/calendarExport';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  Download,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

type Meeting = CalendarMeeting;

/** Normalize legacy / alternate API spellings to keys used in OUTCOME_KEYS. */
function normalizeOutcomeKey(outcome: string | null | undefined): string | null {
  if (outcome == null || outcome === '') return null;
  if (outcome === 'no-show') return 'noShow';
  return outcome;
}

function formatMeetingClockWithZone(timeStr: string, dateYmd: string): string {
  const m = timeStr?.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return timeStr || '';
  const h = parseInt(m[1], 10);
  const mi = parseInt(m[2], 10);
  const [y, mo, d] = dateYmd.split('-').map(Number);
  if (!y || !mo || !d || Number.isNaN(h) || Number.isNaN(mi)) return timeStr;
  const dt = new Date(y, mo - 1, d, h, mi, 0, 0);
  return dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
}

/** Company / client name on calendar: status + outcome (e.g. no-show → red, closed won → green). */
function calendarEventNameColorClass(meeting: Meeting): string {
  const oc = normalizeOutcomeKey(meeting.outcome);
  if (oc === 'noShow') return 'text-red-600 dark:text-red-400';
  if (oc === 'closedWon') return 'text-emerald-600 dark:text-emerald-400';
  switch (meeting.status) {
    case 'confirmed':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'upcoming':
      return 'text-blue-600 dark:text-blue-400';
    case 'completed':
      return 'text-slate-500 dark:text-slate-400';
    case 'rescheduled':
      return 'text-amber-600 dark:text-amber-400';
    default:
      return 'text-[hsl(var(--foreground))]';
  }
}

const emptyMeeting = (): Meeting => ({
  id: `local-${Date.now()}`,
  organizationId: '',
  date: new Date().toISOString().slice(0, 10),
  time: '10:00',
  company: '',
  contact: '',
  email: '',
  title: '',
  status: 'confirmed',
  outcome: null,
  transcript: [],
});

type CalendarViewProps = {
  /** When set (e.g. GCC client drill-down), calendar is locked to this organization. */
  lockedOrganizationId?: string;
  embedded?: boolean;
};

const MEETING_FORM_FIELD =
  'w-full text-xs rounded-md border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] px-2 py-2 outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]/50';

const CalendarView: React.FC<CalendarViewProps> = ({ lockedOrganizationId, embedded = false }) => {
  const { mode } = useTheme();
  const formColorScheme = { colorScheme: mode } as React.CSSProperties;
  const { user, isGCC, isSP } = useAuth();
  const gccScope = useGccTenantScope();
  const [viewMode, setViewMode] = useState<'agenda' | 'grid'>('agenda');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [meetingsState, setMeetingsState] = useState<Meeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(true);
  const [orgOptions, setOrgOptions] = useState<{ id: string; name: string }[]>([
    { id: 'all', name: 'All companies' },
  ]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Meeting>(() => emptyMeeting());
  const [savingMeeting, setSavingMeeting] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const companyFilterId = lockedOrganizationId
    ? lockedOrganizationId
    : isGCC
      ? gccScope.scopeOrgId === 'all'
        ? 'all'
        : gccScope.scopeOrgId
      : selectedCompanyId;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (isGCC) {
        const rows = gccScope.organizations;
        if (!cancelled) {
          setOrgOptions([{ id: 'all', name: 'All companies' }, ...rows.map((o) => ({ id: o.id, name: o.name }))]);
        }
        return;
      }
      if (isSP) {
        try {
          const res = await api.get<{ data: { id: string; name: string }[] }>('/admin/organizations');
          const rows = res.data?.data;
          if (!cancelled && rows?.length) {
            setOrgOptions([{ id: 'all', name: 'All companies' }, ...rows.map((o) => ({ id: o.id, name: o.name }))]);
            return;
          }
        } catch {
          /* keep default "All companies" only */
        }
        return;
      }
      if (!cancelled && user?.orgId) {
        setOrgOptions([{ id: user.orgId, name: user.entityName || 'My organization' }]);
        setSelectedCompanyId(user.orgId);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isGCC, isSP, user?.orgId, user?.entityName, gccScope.organizations]);

  useEffect(() => {
    let cancelled = false;
    const fetchMeetings = async () => {
      setMeetingsLoading(true);
      try {
        const res = await api.get<{ data: Record<string, unknown>[] }>('/leads');
        const rows = res.data?.data ?? [];
        if (!cancelled) {
          const mapped = rows
            .map((row) => mapLeadToCalendarMeeting(row as Parameters<typeof mapLeadToCalendarMeeting>[0]))
            .filter((m): m is Meeting => m != null);
          setMeetingsState(mapped);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setMeetingsState([]);
          toast.error('Failed to load calendar meetings');
        }
      } finally {
        if (!cancelled) setMeetingsLoading(false);
      }
    };
    fetchMeetings();
    return () => {
      cancelled = true;
    };
  }, [gccScope.scopeOrgId]);

  useEffect(() => {
    if (!selectedMeeting) return;
    let cancelled = false;
    const loadDetail = async () => {
      setDetailLoading(true);
      try {
        const res = await api.get<{ data: Record<string, unknown> }>(`/leads/${selectedMeeting}`);
        const lead = res.data?.data;
        if (cancelled || !lead) return;
        const callLog = (lead.call_logs ?? lead.call_log) as { transcript?: string; summary?: string } | null;
        const transcript = parseCallLogTranscript(callLog?.transcript);
        const aiStrategy = typeof callLog?.summary === 'string' ? callLog.summary : undefined;
        setMeetingsState((prev) =>
          prev.map((m) =>
            m.id === selectedMeeting
              ? {
                  ...m,
                  transcript,
                  aiStrategy,
                  notes: (lead.notes as string) || m.notes,
                  phone: (lead.phone as string) || m.phone,
                  email: (lead.email as string) || m.email,
                  contact: (lead.name as string) || m.contact,
                }
              : m
          )
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    };
    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [selectedMeeting]);

  const periodMeetings = useMemo(() => {
    const ref = new Date();
    return filterByOrganization(meetingsState, companyFilterId).filter((m) =>
      meetingInCalendarPeriod(m.date, period, ref)
    );
  }, [meetingsState, companyFilterId, period]);

  const outcomeCounts = useMemo(() => {
    const ref = new Date();
    return aggregateOutcomes(meetingsState, period, companyFilterId, ref);
  }, [meetingsState, period, companyFilterId]);

  const totalOutcomes = useMemo(() => OUTCOME_KEYS.reduce((a, k) => a + outcomeCounts[k], 0), [outcomeCounts]);

  const activeMeeting = meetingsState.find((m) => m.id === selectedMeeting);

  const groupedMeetings = useMemo(() => {
    return periodMeetings.reduce(
      (acc, meeting) => {
        const date = meeting.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(meeting);
        return acc;
      },
      {} as Record<string, Meeting[]>
    );
  }, [periodMeetings]);

  const statusDot = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-400';
      case 'completed':
        return 'bg-gray-400';
      case 'upcoming':
        return 'bg-blue-400';
      case 'rescheduled':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
    }
  };

  const outcomeColors: Record<string, string> = {
    qualified: 'bg-emerald-400',
    proposal: 'bg-blue-400',
    negotiation: 'bg-purple-400',
    closedWon: 'bg-emerald-500',
    noShow: 'bg-red-400',
    unqualified: 'bg-gray-400',
  };

  const openAddDialog = useCallback(() => {
    const m = emptyMeeting();
    const scopeId = companyFilterId;
    const defaultOrg =
      scopeId !== 'all' ? scopeId : orgOptions.find((o) => o.id !== 'all')?.id || '';
    m.organizationId = defaultOrg;
    setForm(m);
    setAddOpen(true);
  }, [companyFilterId, orgOptions]);

  const submitNewMeeting = async () => {
    if (!form.company.trim() || !form.contact.trim() || !form.organizationId) {
      toast.error('Company, contact, and organization are required.');
      return;
    }
    if (!form.date || !form.time) {
      toast.error('Date and time are required.');
      return;
    }

    setSavingMeeting(true);
    try {
      const notes = [form.company.trim(), form.title.trim()].filter(Boolean).join(' · ');
      const res = await api.post<{ data: Record<string, unknown> }>('/leads', {
        organization_id: form.organizationId,
        name: form.contact.trim(),
        email: form.email.trim() || null,
        notes: notes || null,
        meeting_time: buildMeetingTimestamp(form.date, form.time),
        meeting_date: form.date,
        status: calendarFormToLeadStatus(form.status, form.outcome),
      });

      const mapped = mapLeadToCalendarMeeting(res.data?.data as Parameters<typeof mapLeadToCalendarMeeting>[0]);
      if (mapped) {
        setMeetingsState((prev) => [mapped, ...prev]);
        setSelectedMeeting(mapped.id);
      }
      setAddOpen(false);
      toast.success('Meeting saved');
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to save meeting';
      toast.error(msg);
      console.error(error);
    } finally {
      setSavingMeeting(false);
    }
  };

  const exportVisibleToIcs = () => {
    if (!periodMeetings.length) {
      toast.error('No meetings in the current view to export.');
      return;
    }
    const ics = buildIcsCalendar(periodMeetings);
    downloadTextFile(`meetings-${period}.ics`, ics, 'text/calendar;charset=utf-8');
    toast.success('Calendar file downloaded');
  };

  const lockedOrgName =
    lockedOrganizationId &&
    (orgOptions.find((o) => o.id === lockedOrganizationId)?.name ||
      gccScope.organizations.find((o) => o.id === lockedOrganizationId)?.name);

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {!lockedOrganizationId && (
            <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] whitespace-nowrap shrink-0">
              {isSP ? 'Strategic sales partners' : 'Company'}
            </label>
          )}
          {lockedOrganizationId ? (
            <span className="text-xs text-[hsl(var(--muted-foreground))] max-w-md leading-snug">
              Meetings for{' '}
              <span className="text-[hsl(var(--foreground))] font-medium">{lockedOrgName || 'this client'}</span> only.
            </span>
          ) : isGCC ? (
            <span className="text-xs text-[hsl(var(--muted-foreground))] max-w-md leading-snug">
              Scope:{' '}
              <span className="text-[hsl(var(--foreground))] font-medium">
                {gccScope.scopeOrgId === 'all'
                  ? 'All clients'
                  : gccScope.organizations.find((o) => o.id === gccScope.scopeOrgId)?.name || 'Selected client'}
              </span>
            </span>
          ) : (
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="text-xs rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] px-2 py-1.5 min-w-[min(100%,220px)] max-w-[320px]"
            >
              {orgOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={openAddDialog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 shrink-0"
          >
            <Plus size={14} />
            Add meeting
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={exportVisibleToIcs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80"
          >
            <Download size={14} />
            Download .ics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <div className="flex flex-col gap-1 mb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Meetings</h3>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 max-w-xl leading-relaxed">
                Times below use each meeting date with your browser&apos;s local zone (e.g. EST/PST). Use the calendar
                export or Google Calendar link to confirm the final wall time with attendees.
              </p>
            </div>
            <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5">
              {(['agenda', 'grid'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono font-semibold uppercase transition-colors ${
                    viewMode === v
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {meetingsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={28} />
            </div>
          ) : viewMode === 'agenda' ? (
            <div className="space-y-4">
              {Object.entries(groupedMeetings)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, dayMeetings]) => (
                  <div key={date}>
                    <p className="text-[10px] font-mono font-semibold uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">
                      {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="space-y-2">
                      {dayMeetings.map((meeting) => (
                        <button
                          key={meeting.id}
                          type="button"
                          onClick={() => setSelectedMeeting(selectedMeeting === meeting.id ? null : meeting.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                            selectedMeeting === meeting.id
                              ? 'border-[hsl(var(--primary))]/50 bg-[hsl(var(--primary))]/5'
                              : 'border-[hsl(var(--border-v))] hover:border-[hsl(var(--border-v))] hover:bg-[hsl(var(--muted))]'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot(meeting.status)}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${calendarEventNameColorClass(meeting)}`}>
                              {meeting.company}
                            </p>
                            <p className={`text-[10px] ${calendarEventNameColorClass(meeting)} opacity-90`}>
                              {meeting.contact} · {formatMeetingClockWithZone(meeting.time, meeting.date)}
                            </p>
                          </div>
                          <StatusBadge status={meeting.status as 'confirmed' | 'upcoming' | 'completed' | 'rescheduled'} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              {periodMeetings.length === 0 && (
                <p className="text-sm text-[hsl(var(--muted-foreground))] py-6 text-center">
                  No scheduled meetings for this company and period. Leads with a meeting time or success status appear here.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-[10px] font-mono text-[hsl(var(--muted-foreground))] py-1">
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                const dayMeetings = periodMeetings.filter((m) => {
                  const d = new Date(m.date + 'T12:00:00').getDate();
                  return d === day && day > 0 && day <= 31;
                });
                return (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    className={`aspect-square rounded-md p-1 flex flex-col gap-0.5 ${
                      day > 0 && day <= 31 ? 'bg-[hsl(var(--muted))] cursor-pointer hover:bg-[hsl(var(--muted))]/80' : ''
                    }`}
                    onClick={() => {
                      if (dayMeetings.length > 0) {
                        setSelectedMeeting(dayMeetings[0].id);
                        setViewMode('agenda');
                      }
                    }}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && dayMeetings.length > 0) {
                        setSelectedMeeting(dayMeetings[0].id);
                        setViewMode('agenda');
                      }
                    }}
                  >
                    {day > 0 && day <= 31 && (
                      <>
                        <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">{day}</span>
                        {dayMeetings.length > 0 && (
                          <div className="flex flex-col gap-0.5 min-h-0 flex-1 overflow-hidden">
                            <div className="flex gap-0.5 flex-wrap shrink-0">
                              {dayMeetings.slice(0, 3).map((m) => (
                                <span key={m.id} className={`w-1.5 h-1.5 rounded-full ${statusDot(m.status)}`} />
                              ))}
                            </div>
                            <div className="flex flex-col gap-0 min-h-0">
                              {dayMeetings.slice(0, 2).map((m) => (
                                <span
                                  key={m.id}
                                  className={`text-[7px] font-medium leading-tight truncate ${calendarEventNameColorClass(m)}`}
                                  title={`${m.company || m.contact}${m.outcome ? ` · ${normalizeOutcomeKey(m.outcome)}` : ''}`}
                                >
                                  {m.company || m.contact}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          {activeMeeting ? (
            <div className="space-y-4">
              {detailLoading && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                  <Loader2 size={12} className="animate-spin" />
                  Loading details…
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <a
                  href={googleCalendarUrl(activeMeeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80"
                >
                  <ExternalLink size={12} />
                  Google Calendar
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const ics = buildIcsCalendar([activeMeeting]);
                    downloadTextFile(`meeting-${activeMeeting.id}.ics`, ics, 'text/calendar;charset=utf-8');
                    toast.success('Downloaded .ics');
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium border border-[hsl(var(--border-v))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                >
                  <Download size={12} />
                  .ics file
                </button>
              </div>
              <div>
                <h3 className={`text-base font-display font-semibold ${calendarEventNameColorClass(activeMeeting)}`}>
                  {activeMeeting.company}
                </h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                  {new Date(activeMeeting.date + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  · {formatMeetingClockWithZone(activeMeeting.time, activeMeeting.date)}
                </p>
                <p className={`text-xs ${calendarEventNameColorClass(activeMeeting)}`}>
                  {activeMeeting.contact} · {activeMeeting.title}
                </p>
                {activeMeeting.email && (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">{activeMeeting.email}</p>
                )}
                {activeMeeting.phone && (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{activeMeeting.phone}</p>
                )}
                {activeMeeting.meetingTimezone && (
                  <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-1">
                    Timezone: {activeMeeting.meetingTimezone}
                  </p>
                )}
              </div>

              {activeMeeting.notes && (
                <div className="p-3 bg-[hsl(var(--muted))] rounded-lg border border-[hsl(var(--border-v))]">
                  <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 tracking-wider">Notes</p>
                  <p className="text-[11px] text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">{activeMeeting.notes}</p>
                </div>
              )}

              {activeMeeting.transcript.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">
                    Transcript audio
                  </p>
                  <AudioPlayer transcript={activeMeeting.transcript} />
                </div>
              )}

              {activeMeeting.transcript.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">Transcript</p>
                  <div className="p-3 bg-[hsl(var(--muted))] rounded-lg border border-[hsl(var(--border-v))] max-h-48 overflow-y-auto space-y-2">
                    {activeMeeting.transcript.map((line, i) => (
                      <div key={i} className="text-xs">
                        <span
                          className={`font-mono font-semibold ${
                            line.speaker === 'Eva' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--accent-blue))]'
                          }`}
                        >
                          {line.speaker}:
                        </span>{' '}
                        <span className="text-[hsl(var(--foreground))]">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeMeeting.aiStrategy && (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <p className="text-[10px] font-mono font-semibold uppercase text-emerald-400 mb-1 tracking-wider">Call summary</p>
                  <p className="text-[11px] text-[hsl(var(--foreground))] leading-relaxed">{activeMeeting.aiStrategy}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <CalendarDays size={32} className="text-[hsl(var(--border-v))] mb-3" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Select a meeting to view details</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Meeting Outcome Tracker</h3>
          <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5">
            {(['month', 'quarter', 'year'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase transition-colors ${
                  period === p
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {OUTCOME_KEYS.map((outcome) => {
            const count = outcomeCounts[outcome];
            const pct = totalOutcomes > 0 ? (count / totalOutcomes) * 100 : 0;
            const color = outcomeColors[outcome] || 'bg-gray-400';
            const isExpanded = expandedOutcome === outcome;
            const label = outcome.replace(/([A-Z])/g, ' $1').trim();
            const expandedRows = periodMeetings.filter((m) => m.outcome === outcome);
            return (
              <div key={outcome}>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 text-left"
                  onClick={() => setExpandedOutcome(isExpanded ? null : outcome)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[hsl(var(--foreground))] flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {label}
                      </span>
                      <span className="text-[11px] font-mono text-[hsl(var(--muted-foreground))]">
                        {count} ({Math.round(pct)}%)
                      </span>
                    </div>
                    <div className="h-6 bg-[hsl(var(--muted))] rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${color} transition-all duration-500`}
                        style={{ width: `${totalOutcomes ? pct : 0}%`, opacity: 0.7 }}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-[hsl(var(--muted-foreground))]" />
                  ) : (
                    <ChevronDown size={14} className="text-[hsl(var(--muted-foreground))]" />
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-2 ml-4 space-y-1">
                    {expandedRows.map((m) => (
                      <div key={m.id} className="flex items-center justify-between py-1.5 px-3 bg-[hsl(var(--muted))] rounded">
                        <span className={`text-[11px] font-medium ${calendarEventNameColorClass(m)}`}>
                          {m.company} — {m.contact}
                        </span>
                        <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{m.date}</span>
                      </div>
                    ))}
                    {expandedRows.length === 0 && (
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))] py-2">No meetings with this outcome in this view</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md bg-[hsl(var(--card))] border-[hsl(var(--border-v))]">
          <DialogHeader>
            <DialogTitle>Add meeting</DialogTitle>
            <DialogDescription>Saves a lead with a scheduled meeting time to your database.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <label className="grid gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Organization</span>
              <select
                value={form.organizationId}
                onChange={(e) => setForm((f) => ({ ...f, organizationId: e.target.value }))}
                className={MEETING_FORM_FIELD}
                style={formColorScheme}
              >
                <option value="">Select…</option>
                {orgOptions
                  .filter((o) => o.id !== 'all')
                  .map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Company</span>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className={MEETING_FORM_FIELD}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Contact</span>
              <input
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                className={MEETING_FORM_FIELD}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Email</span>
              <input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={MEETING_FORM_FIELD}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Title / role</span>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={MEETING_FORM_FIELD}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1">
                <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className={MEETING_FORM_FIELD}
                  style={formColorScheme}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Time</span>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className={MEETING_FORM_FIELD}
                  style={formColorScheme}
                />
              </label>
            </div>
            <label className="grid gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Status</span>
              <select
                value={form.status}
                onChange={(e) => {
                  const status = e.target.value as Meeting['status'];
                  setForm((f) => ({
                    ...f,
                    status,
                    outcome:
                      status !== 'confirmed' && f.outcome === 'closedWon' ? null : f.outcome,
                  }));
                }}
                className={MEETING_FORM_FIELD}
                style={formColorScheme}
              >
                <option value="confirmed">confirmed</option>
                <option value="upcoming">upcoming</option>
                <option value="completed">completed</option>
                <option value="rescheduled">rescheduled</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Outcome (optional)</span>
              <select
                value={form.outcome ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    outcome: (e.target.value || null) as Meeting['outcome'],
                  }))
                }
                className={MEETING_FORM_FIELD}
                style={formColorScheme}
              >
                <option value="">—</option>
                {OUTCOME_KEYS.filter((k) => k !== 'closedWon' || form.status === 'confirmed').map((k) => (
                  <option key={k} value={k}>
                    {k === 'closedWon' ? 'Closed won' : k.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="px-3 py-2 text-xs rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitNewMeeting}
              disabled={savingMeeting}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] disabled:opacity-60"
            >
              {savingMeeting && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
