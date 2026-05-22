import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { CALL_LOGS_EMPTY_MESSAGE } from '@/components/dashboard/callLogsEmptyMessage';
import { formatCurrencyForSource } from '@/lib/currency';
import MetricCard from '@/components/shared/MetricCard';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ClientHealthRow = {
  organizationId: string;
  client: string;
  country_code?: string | null;
  liveCalls: number;
  meetings: number;
  mrrValue: number;
  health: number;
  status: string;
};

type AdminStats = {
  organizations?: number;
  activeCalls?: number;
  meetingsThisMonth?: number;
  mrr?: number;
  pendingScripts?: number;
  pendingUploads?: number;
  pendingClones?: number;
  clientHealth?: ClientHealthRow[];
};

type CallLogRow = {
  id: string;
  caller_number?: string | null;
  organization_name?: string | null;
  organizations?: { name?: string | null } | null;
  agent_name?: string | null;
  agents?: { name?: string | null } | null;
  duration_sec?: number;
  status?: string;
  transcript?: string | null;
  summary?: string | null;
};

type DashboardCallCard = {
  id: string;
  prospect: string;
  company: string;
  agent: string;
  duration: string;
  status: string;
  transcriptPreview: string;
};

const SAMPLE_CALL_COUNT = 5;

const pickRandomItems = <T,>(items: T[], count: number): T[] => {
  if (items.length <= count) return [...items];
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
};

const formatDuration = (seconds?: number) => {
  const total = Math.max(0, Math.floor(seconds ?? 0));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatStatusLabel = (status?: string) =>
  (status || 'unknown').replace(/_/g, ' ');

const statusBadgeClass = (status?: string) => {
  switch (status) {
    case 'success':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'follow_up':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'in_progress':
      return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
    default:
      return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border-v))]';
  }
};

const transcriptPreviewFromLog = (log: CallLogRow) => {
  const lines = (log.transcript || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes(':'));

  if (lines.length > 0) {
    const last = lines[lines.length - 1];
    const colon = last.indexOf(':');
    const speaker = last.slice(0, colon).trim();
    const text = last.slice(colon + 1).trim();
    return `${speaker}: ${text}`;
  }

  if (log.summary?.trim()) return log.summary.trim();

  return 'No transcript available for this call.';
};

const orgNameFromLog = (log: CallLogRow) =>
  log.organization_name?.trim() || log.organizations?.name?.trim() || null;

const agentNameFromLog = (log: CallLogRow) =>
  log.agent_name?.trim() || log.agents?.name?.trim() || null;

const mapCallLogToCard = (log: CallLogRow): DashboardCallCard => {
  const agentName = agentNameFromLog(log);
  return {
  id: log.id,
  prospect: log.caller_number?.trim() || 'Unknown caller',
  company: orgNameFromLog(log) || 'Unknown organization',
  agent: agentName ? `Agent: ${agentName}` : 'AI Agent',
  duration: formatDuration(log.duration_sec),
  status: log.status || 'unknown',
  transcriptPreview: transcriptPreviewFromLog(log),
};
};

const alerts = [
  {
    id: 'a1',
    label: 'Compliance phrase missed',
    client: 'Meridian Injury Group',
    priority: 'High',
    detail: 'Disclosure skipped on 2 live calls',
  },
  {
    id: 'a2',
    label: 'Script request aging',
    client: 'Capstone Commercial Realty',
    priority: 'Medium',
    detail: 'Waiting 18h for reviewer approval',
  },
  {
    id: 'a3',
    label: 'Connect-rate drop',
    client: 'DataFirst Corp',
    priority: 'Watch',
    detail: 'Down 9% against seven-day baseline',
  },
];

const formatPortfolioMrr = (value: number | undefined) => {
  if (value == null || !Number.isFinite(value)) return '—';
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);
};

const AdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { isGCCReviewer } = useAuth();
  const gccScope = useGccTenantScope();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [sampledCalls, setSampledCalls] = useState<DashboardCallCard[]>([]);
  const [callsLoading, setCallsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await api.get<{ data: AdminStats }>('/admin/stats');
        if (!cancelled) setStats(response.data?.data ?? null);
      } catch (error) {
        console.error(error);
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [gccScope.scopeOrgId]);

  useEffect(() => {
    let cancelled = false;
    const fetchCallLogs = async () => {
      setCallsLoading(true);
      try {
        const response = await api.get<{ data: CallLogRow[] }>('/admin/call-logs');
        const logs = response.data?.data ?? [];
        if (!cancelled) {
          setSampledCalls(pickRandomItems(logs, SAMPLE_CALL_COUNT).map(mapCallLogToCard));
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setSampledCalls([]);
      } finally {
        if (!cancelled) setCallsLoading(false);
      }
    };

    fetchCallLogs();
    return () => {
      cancelled = true;
    };
  }, [gccScope.scopeOrgId]);

  const clientHealthRows = stats?.clientHealth ?? [];

  const kpis = useMemo(() => {
    const hitlQueue =
      (stats?.pendingScripts ?? 0) + (stats?.pendingUploads ?? 0) + (stats?.pendingClones ?? 0);

    return [
      {
        label: 'Total Clients',
        value: statsLoading ? '…' : (stats?.organizations ?? 0),
        subtext: 'Across all tenant scopes',
        onClick: () => navigate('/admin/organizations'),
      },
      {
        label: 'Live Calls Now',
        value: statsLoading ? '…' : (stats?.activeCalls ?? 0),
        subtext: 'Monitored in real time',
        onClick: () => navigate('/admin/call-logs'),
      },
      {
        label: 'Meetings/Mo',
        value: statsLoading ? '…' : (stats?.meetingsThisMonth ?? 0),
        subtext: 'Success leads this month',
        onClick: () => navigate('/admin/leads'),
      },
      {
        label: 'MRR',
        value: statsLoading ? '…' : formatPortfolioMrr(stats?.mrr),
        subtext: 'Latest collected MRR (portfolio)',
        onClick: () => navigate('/admin/commissions'),
      },
      {
        label: 'HITL Queue',
        value: statsLoading ? '…' : hitlQueue,
        subtext: 'Scripts, uploads, clones',
        onClick: () => navigate('/admin/hitl'),
      },
    ];
  }, [navigate, stats, statsLoading]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <MetricCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            subtext={kpi.subtext}
            className="gcc-metric-tile min-h-[116px]"
            valueMono
            onClick={kpi.onClick}
            tooltip={kpi.label}
          />
        ))}
      </div>

      <div
        className={
          isGCCReviewer
            ? 'grid grid-cols-1 gap-4'
            : 'grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] gap-4'
        }
      >
        <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[hsl(var(--border-v))]">
            <div>
              <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Active Live Calls</h2>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                Random sample from your call log feed.
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              {callsLoading ? '…' : `${sampledCalls.length} shown`}
            </Badge>
          </div>

          <div className="divide-y divide-[hsl(var(--border-v))]">
            {callsLoading ? (
              <p className="p-6 text-center text-xs text-[hsl(var(--muted-foreground))]">Loading calls…</p>
            ) : sampledCalls.length === 0 ? (
              <p className="p-6 text-center text-xs text-[hsl(var(--muted-foreground))]">{CALL_LOGS_EMPTY_MESSAGE}</p>
            ) : (
              sampledCalls.map((call) => (
                <button
                  key={call.id}
                  type="button"
                  onClick={() => navigate('/admin/call-logs')}
                  className="w-full text-left p-4 hover:bg-[hsl(var(--muted))]/35 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm text-[hsl(var(--foreground))]">{call.prospect}</p>
                      <Badge className={`font-mono ${statusBadgeClass(call.status)}`} variant="outline">
                        {formatStatusLabel(call.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {call.company} · {call.agent} · {call.duration}
                    </p>
                    <p className="text-xs leading-relaxed text-[hsl(var(--foreground))] line-clamp-2">
                      {call.transcriptPreview}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {!isGCCReviewer && (
          <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[hsl(var(--border-v))]">
              <div>
                <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Alerts & Flags</h2>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                  Items requiring operator attention.
                </p>
              </div>
              <ShieldAlert size={18} className="text-amber-500" />
            </div>

            <div className="divide-y divide-[hsl(var(--border-v))]">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => navigate('/admin/hitl')}
                  className="w-full text-left p-4 hover:bg-[hsl(var(--muted))]/35 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md bg-amber-500/10 p-2 text-amber-500">
                      <AlertTriangle size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">{alert.label}</p>
                        <Badge variant="outline" className="font-mono">
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                        {alert.client} · {alert.detail}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[hsl(var(--border-v))]">
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Client Health Overview</h2>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Portfolio health across live calling, meetings, revenue, and review signals.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[hsl(var(--muted))]/35">
              <TableHead>Client</TableHead>
              <TableHead>Live Calls</TableHead>
              <TableHead>Meetings/Mo</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                  Loading portfolio health…
                </TableCell>
              </TableRow>
            ) : clientHealthRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
                  No clients in scope. Add organizations or adjust tenant scope in the header.
                </TableCell>
              </TableRow>
            ) : (
              clientHealthRows.map((client) => (
                <TableRow
                  key={client.organizationId}
                  className="cursor-pointer hover:bg-[hsl(var(--muted))]/30"
                  onClick={() => navigate('/admin/organizations')}
                >
                  <TableCell className="font-medium text-[hsl(var(--foreground))]">{client.client}</TableCell>
                  <TableCell className="font-mono">{client.liveCalls}</TableCell>
                  <TableCell className="font-mono">{client.meetings}</TableCell>
                  <TableCell className="font-mono">
                    {formatCurrencyForSource(client.mrrValue, { country_code: client.country_code }, {
                      notation: 'compact',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="h-2 flex-1 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[hsl(var(--primary))]"
                          style={{ width: `${client.health}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
                        {client.health}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        client.status === 'At Risk'
                          ? 'border-red-500/30 text-red-500'
                          : client.status === 'Needs Review'
                            ? 'border-amber-500/30 text-amber-500'
                            : 'border-emerald-500/30 text-emerald-500'
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default AdminDashboardView;
