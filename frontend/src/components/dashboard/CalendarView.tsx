import React, { useState } from 'react';
import { meetings, meetingOutcomes } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import StatusBadge from '@/components/shared/StatusBadge';
import AudioPlayer from '@/components/shared/AudioPlayer';
import { ChevronDown, ChevronUp, Globe, Users, DollarSign, MapPin, CalendarDays } from 'lucide-react';

const CalendarView: React.FC = () => {
  const { } = useTheme();
  const [viewMode, setViewMode] = useState<'agenda' | 'grid'>('agenda');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const activeMeeting = meetings.find(m => m.id === selectedMeeting);

  const groupedMeetings = meetings.reduce((acc, meeting) => {
    const date = meeting.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(meeting);
    return acc;
  }, {} as Record<string, typeof meetings>);

  const statusDot = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-400';
      case 'completed': return 'bg-gray-400';
      case 'upcoming': return 'bg-blue-400';
      case 'rescheduled': return 'bg-yellow-400';
      default: return 'bg-gray-400';
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

  const totalMeetings = Object.values(meetingOutcomes).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Meetings List */}
        <div className="lg:col-span-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Meetings</h3>
            <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5">
              {(['agenda', 'grid'] as const).map(v => (
                <button
                  key={v}
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

          {viewMode === 'agenda' ? (
            <div className="space-y-4">
              {Object.entries(groupedMeetings).sort(([a], [b]) => b.localeCompare(a)).map(([date, dayMeetings]) => (
                <div key={date}>
                  <p className="text-[10px] font-mono font-semibold uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="space-y-2">
                    {dayMeetings.map(meeting => (
                      <button
                        key={meeting.id}
                        onClick={() => setSelectedMeeting(selectedMeeting === meeting.id ? null : meeting.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          selectedMeeting === meeting.id
                            ? 'border-[hsl(var(--primary))]/50 bg-[hsl(var(--primary))]/5'
                            : 'border-[hsl(var(--border-v))] hover:border-[hsl(var(--border-v))] hover:bg-[hsl(var(--muted))]'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot(meeting.status)}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[hsl(var(--foreground))]">{meeting.company}</p>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{meeting.contact} · {meeting.time}</p>
                        </div>
                        <StatusBadge status={meeting.status as any} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-mono text-[hsl(var(--muted-foreground))] py-1">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                const dayMeetings = meetings.filter(m => {
                  const d = new Date(m.date).getDate();
                  return d === day && day > 0 && day <= 31;
                });
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md p-1 flex flex-col gap-0.5 ${
                      day > 0 && day <= 31 ? 'bg-[hsl(var(--muted))] cursor-pointer hover:bg-[hsl(var(--muted))]/80' : ''
                    }`}
                    onClick={() => {
                      if (dayMeetings.length > 0) {
                        setSelectedMeeting(dayMeetings[0].id);
                        setViewMode('agenda');
                      }
                    }}
                  >
                    {day > 0 && day <= 31 && (
                      <>
                        <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">{day}</span>
                        {dayMeetings.length > 0 && (
                          <div className="flex gap-0.5 flex-wrap">
                            {dayMeetings.slice(0, 3).map(m => (
                              <span key={m.id} className={`w-1.5 h-1.5 rounded-full ${statusDot(m.status)}`} />
                            ))}
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

        {/* Meeting Detail Panel */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          {activeMeeting ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-display font-semibold text-[hsl(var(--foreground))]">{activeMeeting.company}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                  {new Date(activeMeeting.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {activeMeeting.time}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{activeMeeting.contact} · {activeMeeting.title}</p>
              </div>

              {activeMeeting.enrichment && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-[hsl(var(--muted))] rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Globe size={11} className="text-[hsl(var(--primary))]" />
                      <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Industry</span>
                    </div>
                    <p className="text-[11px] font-medium text-[hsl(var(--foreground))]">{activeMeeting.enrichment.industry}</p>
                  </div>
                  <div className="p-2.5 bg-[hsl(var(--muted))] rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users size={11} className="text-[hsl(var(--primary))]" />
                      <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Employees</span>
                    </div>
                    <p className="text-[11px] font-medium text-[hsl(var(--foreground))]">{activeMeeting.enrichment.employees}</p>
                  </div>
                  <div className="p-2.5 bg-[hsl(var(--muted))] rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign size={11} className="text-[hsl(var(--primary))]" />
                      <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Revenue</span>
                    </div>
                    <p className="text-[11px] font-medium text-[hsl(var(--foreground))]">{activeMeeting.enrichment.revenue}</p>
                  </div>
                  <div className="p-2.5 bg-[hsl(var(--muted))] rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin size={11} className="text-[hsl(var(--primary))]" />
                      <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))]">HQ</span>
                    </div>
                    <p className="text-[11px] font-medium text-[hsl(var(--foreground))]">{activeMeeting.enrichment.hq}</p>
                  </div>
                </div>
              )}

              {activeMeeting.enrichment?.funding && (
                <span className="inline-block px-2 py-0.5 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-[10px] font-mono font-semibold rounded-full">
                  {activeMeeting.enrichment.funding}
                </span>
              )}

              {/* Audio Player */}
              {activeMeeting.transcript.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">Call Recording</p>
                  <AudioPlayer />
                </div>
              )}

              {/* Transcript */}
              {activeMeeting.transcript.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">Transcript</p>
                  <div className="p-3 bg-[hsl(var(--muted))] rounded-lg border border-[hsl(var(--border-v))] max-h-48 overflow-y-auto space-y-2">
                    {activeMeeting.transcript.map((line, i) => (
                      <div key={i} className="text-xs">
                        <span className={`font-mono font-semibold ${line.speaker === 'Eva' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--accent-blue))]'}`}>
                          {line.speaker}:
                        </span>{' '}
                        <span className="text-[hsl(var(--foreground))]">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Strategy */}
              {activeMeeting.aiStrategy && (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <p className="text-[10px] font-mono font-semibold uppercase text-emerald-400 mb-1 tracking-wider">AI Strategy Note</p>
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

      {/* Meeting Outcome Tracker */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Meeting Outcome Tracker</h3>
          <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5">
            {(['month', 'quarter', 'year'] as const).map(p => (
              <button
                key={p}
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
          {Object.entries(meetingOutcomes).map(([outcome, count]) => {
            const pct = (count / totalMeetings) * 100;
            const color = outcomeColors[outcome] || 'bg-gray-400';
            const isExpanded = expandedOutcome === outcome;
            const label = outcome.replace(/([A-Z])/g, ' $1').trim();
            return (
              <div key={outcome}>
                <button
                  className="w-full flex items-center gap-3 text-left"
                  onClick={() => setExpandedOutcome(isExpanded ? null : outcome)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[hsl(var(--foreground))] flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {label}
                      </span>
                      <span className="text-[11px] font-mono text-[hsl(var(--muted-foreground))]">{count} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="h-6 bg-[hsl(var(--muted))] rounded overflow-hidden">
                      <div className={`h-full rounded ${color} transition-all duration-500`} style={{ width: `${pct}%`, opacity: 0.7 }} />
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={14} className="text-[hsl(var(--muted-foreground))]" /> : <ChevronDown size={14} className="text-[hsl(var(--muted-foreground))]" />}
                </button>
                {isExpanded && (
                  <div className="mt-2 ml-4 space-y-1">
                    {meetings
                      .filter(m => m.outcome === outcome)
                      .map(m => (
                        <div key={m.id} className="flex items-center justify-between py-1.5 px-3 bg-[hsl(var(--muted))] rounded">
                          <span className="text-[11px] text-[hsl(var(--foreground))]">{m.company} — {m.contact}</span>
                          <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{m.date}</span>
                        </div>
                      ))}
                    {meetings.filter(m => m.outcome === outcome).length === 0 && (
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))] py-2">No meetings with this outcome</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
