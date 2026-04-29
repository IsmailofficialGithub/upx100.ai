import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import MetricCard from '@/components/shared/MetricCard';
import StatusBadge from '@/components/shared/StatusBadge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Phone, Headphones, Mic, ChevronRight, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DashboardView: React.FC = () => {
  const { isUK, currencySymbol, complianceLabel } = useTheme();
  const [activityPeriod, setActivityPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [transcriptIndex, setTranscriptIndex] = useState(2);
  const [showContacts, setShowContacts] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);

  // Live Data State
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard metrics');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  
  const metrics = stats?.metrics || {
    outreach: { value: 0, label: 'Call Logs' },
    agents: { value: 0, label: 'Agents Assigned' },
    phoneNumbers: { value: 0, label: 'Numbers Imported' },
    callTime: { value: '0h 0m', label: 'Total Call Time' }
  };
  const funnelData = stats?.funnelData || [];
  const liveCalls = stats?.liveCalls || [];
  const contactsData = stats?.contactsData || [];
  const meetings = stats?.meetings || [];
  const outreachChartData = stats?.outreachActivity || {
    daily: { labels: [], data: [] },
    weekly: { labels: [], data: [] },
    monthly: { labels: [], data: [] }
  };
  const regionalData = stats?.regionalData || [];
  const emailPerformance = stats?.emailStats || { sent: 0, openRate: 0, replyRate: 0 };
  const networkBenchmarks = stats?.benchmarks || {
    meetings: { yours: 0, network: 0, top25: 0, unit: '/week' },
    connection: { yours: 0, network: 0, top25: 0, unit: '%' },
    response: { yours: 0, network: 0, top25: 0, unit: '%' }
  };

  const activeCall = liveCalls.find((c: any) => c.id === selectedTranscript) || liveCalls[0];

  useEffect(() => {
    if (activeCall?.status !== 'in_progress') {
      setTranscriptIndex(activeCall?.transcript?.length || 0);
      return;
    }
    
    // Simulate transcript updates for live calls
    if (!activeCall?.transcript) return;
    setTranscriptIndex(1); // Start at beginning for live
    const interval = setInterval(() => {
      setTranscriptIndex(prev => Math.min(prev + 1, activeCall.transcript.length - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleMetricClick = (label: string) => {
    if (label === 'Outreach Activity' || label === 'Outreach') setShowContacts(true);
    else if (label === 'Meetings Booked' || label === 'Meetings') setShowMeetings(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Call Logs"
          value={metrics.outreach.value.toLocaleString()}
          subtext="Total processed"
          onClick={() => handleMetricClick('Outreach')}
        />
        <MetricCard
          label="Agents Assigned"
          value={metrics.agents.value.toString()}
          subtext="Active AI engines"
        />
        <MetricCard
          label="Numbers Imported"
          value={metrics.phoneNumbers.value.toLocaleString()}
          subtext="Active inbound lines"
        />
        <MetricCard
          label="Total Call Time"
          value={metrics.callTime.value}
          subtext="Cumulative duration"
        />
      </div>

      {/* Live Calls + Funnel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live Calls */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Live Calls</h3>
          </div>

          <div className="space-y-3">
            {liveCalls.length > 0 ? liveCalls.map(call => (
              <div
                key={call.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedTranscript === call.id
                    ? 'border-[hsl(var(--primary))]/50 bg-[hsl(var(--primary))]/5'
                    : 'border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]'
                }`}
                onClick={() => {
                  setSelectedTranscript(call.id);
                  setTranscriptIndex(1);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[hsl(var(--primary))]" />
                    <span className="text-xs font-mono font-medium text-[hsl(var(--foreground))]">{call.agent}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{call.duration}</span>
                </div>
                <p className="text-xs text-[hsl(var(--foreground))]">{call.prospect} · {call.company}</p>
              </div>
            )) : (
              <div className="py-8 text-center border border-dashed border-[hsl(var(--border-v))] rounded-lg">
                <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] uppercase tracking-widest">No active calls</p>
              </div>
            )}
          </div>

          {/* Transcript */}
          {liveCalls.length > 0 && (
            <>
              <div className="mt-3 p-3 bg-[hsl(var(--muted))] rounded-lg border border-[hsl(var(--border-v))] max-h-40 overflow-y-auto">
                {activeCall?.transcript?.slice(0, transcriptIndex + 1).map((line: any, i: number) => (
                  <div key={i} className="mb-1.5 text-xs">
                    <span className={`font-mono font-semibold ${line.speaker === 'Eva' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--accent-blue))]'}`}>
                      {line.speaker}:
                    </span>{' '}
                    <span className="text-[hsl(var(--foreground))]">{line.text}</span>
                  </div>
                ))}
                {activeCall?.status === 'in_progress' && transcriptIndex < activeCall.transcript.length - 1 && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="w-1.5 h-1.5 bg-[hsl(var(--primary))] rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">Live transcription...</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-emerald-500/40 text-emerald-400 text-xs font-medium hover:bg-emerald-500/10 transition-colors">
                  <Headphones size={14} /> Listen In
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-500/40 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors">
                  <Mic size={14} /> Take Over
                </button>
              </div>
            </>
          )}
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Pipeline Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((stage, i) => {
              const maxCount = funnelData[0].count;
              const width = Math.max(20, (stage.count / maxCount) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-[hsl(var(--foreground))]">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold" style={{ color: stage.color }}>
                        {stage.count.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-7 bg-[hsl(var(--muted))] rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md transition-all duration-700 flex items-center px-2"
                      style={{ width: `${width}%`, backgroundColor: stage.color, opacity: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity + Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Outreach Activity Chart */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Outreach Activity</h3>
            <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5">
              {(['daily', 'weekly', 'monthly'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setActivityPeriod(p)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase transition-colors ${
                    activityPeriod === p
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outreachChartData[activityPeriod].labels.map((label: string, i: number) => ({ name: label, value: outreachChartData[activityPeriod].data[i] }))}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border-v))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {outreachChartData[activityPeriod].data.map((_: any, i: number) => (
                    <Cell key={i} fill={i === outreachChartData[activityPeriod].data.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--accent-blue))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Map/Chart */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">
            {isUK ? 'UK Regions' : 'US States'}
          </h3>
          <div className="space-y-2.5">
            {regionalData.map((item: any, i: number) => {
              const maxCount = regionalData[0]?.count || 1;
              const width = (item.count / maxCount) * 100;
              const label = item.state ? `${item.state} - ${item.label}` : item.region;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[hsl(var(--foreground))]">{label}</span>
                    <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{item.count}</span>
                  </div>
                  <div className="h-5 bg-[hsl(var(--muted))] rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-700"
                      style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent-blue)))`,
                        opacity: 0.7 + (i * 0.03),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Email Performance + Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Email Performance */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Email Performance</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[hsl(var(--muted))] rounded-lg">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Sent</p>
              <p className="text-xl font-bold font-display text-[hsl(var(--foreground))] mt-1">{emailPerformance.sent}</p>
            </div>
            <div className="text-center p-3 bg-[hsl(var(--muted))] rounded-lg">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Open Rate</p>
              <p className="text-xl font-bold font-display text-[hsl(var(--primary))] mt-1">{emailPerformance.openRate}%</p>
            </div>
            <div className="text-center p-3 bg-[hsl(var(--muted))] rounded-lg">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Reply Rate</p>
              <p className="text-xl font-bold font-display text-[hsl(var(--accent-blue))] mt-1">{emailPerformance.replyRate}%</p>
            </div>
          </div>
        </div>

        {/* Network Benchmarks */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Network Benchmarks</h3>
            <span className="px-2 py-0.5 bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))] text-[10px] font-mono font-semibold rounded-full">
              Top 22% of network
            </span>
          </div>
          <div className="space-y-4">
            {Object.entries(networkBenchmarks).map(([key, data]: [string, any]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-[hsl(var(--foreground))]">
                    {key === 'meetings' ? 'Meetings Booked' : key === 'connection' ? 'Connection Rate' : 'Response Rate'}
                  </span>
                  <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{data.unit}</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Your Rate', value: data.yours, color: 'hsl(var(--primary))' },
                    { label: 'Network Avg', value: data.network, color: 'hsl(var(--accent-blue))' },
                    { label: 'Top 25%', value: data.top25, color: '#888' },
                  ].map(bar => {
                    const maxVal = Math.max(data.yours, data.network, data.top25);
                    const pct = (bar.value / maxVal) * 100;
                    return (
                      <div key={bar.label} className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))] w-20 text-right flex-shrink-0">{bar.label}</span>
                        <div className="flex-1 h-4 bg-[hsl(var(--muted))] rounded overflow-hidden">
                          <div
                            className="h-full rounded transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: bar.color, opacity: 0.7 }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-[hsl(var(--foreground))] w-8 flex-shrink-0">{bar.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact/Meeting Drilldown */}
      {(showContacts || showMeetings) && (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          {showContacts && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-xs text-[hsl(var(--muted-foreground))]">
                <button onClick={() => setShowContacts(false)} className="hover:text-[hsl(var(--foreground))]">Dashboard</button>
                <ChevronRight size={12} />
                <span className="text-[hsl(var(--foreground))]">Outreach Contacts</span>
              </div>
              <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-3">Contacts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border-v))]">
                      <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Name</th>
                      <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Company</th>
                      <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
                      <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">DNC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactsData.map(contact => (
                      <tr key={contact.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                        <td className="py-2 px-2 text-[hsl(var(--foreground))]">{contact.name}</td>
                        <td className="py-2 px-2 text-[hsl(var(--foreground))]">{contact.company}</td>
                        <td className="py-2 px-2"><StatusBadge status={contact.status as any} /></td>
                        <td className="py-2 px-2">
                          <span className={`text-[10px] font-mono ${contact.dncStatus === 'Clean' ? 'text-emerald-400' : contact.dncStatus === 'Pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {contact.dncStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showMeetings && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-xs text-[hsl(var(--muted-foreground))]">
                <button onClick={() => setShowMeetings(false)} className="hover:text-[hsl(var(--foreground))]">Dashboard</button>
                <ChevronRight size={12} />
                <span className="text-[hsl(var(--foreground))]">Meetings</span>
              </div>
              <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-3">Meetings</h3>
              <div className="space-y-2">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="border border-[hsl(var(--border-v))] rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-[hsl(var(--muted))] transition-colors"
                      onClick={() => setExpandedMeeting(expandedMeeting === meeting.id ? null : meeting.id)}
                    >
                      <div className="flex items-center gap-3">
                        <StatusBadge status={meeting.status as any} />
                        <span className="text-xs font-medium text-[hsl(var(--foreground))]">{meeting.company}</span>
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{meeting.contact}</span>
                      </div>
                      {expandedMeeting === meeting.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {expandedMeeting === meeting.id && (
                      <div className="px-3 pb-3 border-t border-[hsl(var(--border))]">
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                          <div><span className="text-[hsl(var(--muted-foreground))]">Date:</span> <span className="text-[hsl(var(--foreground))]">{meeting.date}</span></div>
                          <div><span className="text-[hsl(var(--muted-foreground))]">Time:</span> <span className="text-[hsl(var(--foreground))]">{meeting.time}</span></div>
                          <div><span className="text-[hsl(var(--muted-foreground))]">Title:</span> <span className="text-[hsl(var(--foreground))]">{meeting.title}</span></div>
                          <div><span className="text-[hsl(var(--muted-foreground))]">Email:</span> <span className="text-[hsl(var(--foreground))]">{meeting.email}</span></div>
                        </div>
                        {meeting.outcome && (
                          <div className="mt-2">
                            <StatusBadge status={meeting.outcome as any} label={meeting.outcome.replace(/([A-Z])/g, ' $1').trim()} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardView;
