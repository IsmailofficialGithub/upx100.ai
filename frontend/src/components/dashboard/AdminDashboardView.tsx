import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Ban,
  Headphones,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { liveCalls } from '@/data/mockData';
import MetricCard from '@/components/shared/MetricCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AdminStats = {
  organizations?: number;
  activeCalls?: number;
  meetingsThisMonth?: number;
  mrr?: number | string;
  pendingScripts?: number;
  pendingUploads?: number;
  pendingClones?: number;
};

const fallbackStats = {
  organizations: 42,
  activeCalls: liveCalls.length,
  meetingsThisMonth: 128,
  mrr: '$186K',
  hitlQueue: 17,
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

const clientHealth = [
  {
    client: 'CloudScale Inc',
    liveCalls: 3,
    meetings: 18,
    mrr: '$12K',
    health: 96,
    status: 'Healthy',
  },
  {
    client: 'DataFirst Corp',
    liveCalls: 2,
    meetings: 14,
    mrr: '$9K',
    health: 84,
    status: 'Stable',
  },
  {
    client: 'Meridian Injury Group',
    liveCalls: 1,
    meetings: 9,
    mrr: '$6K',
    health: 71,
    status: 'Needs Review',
  },
  {
    client: 'Capstone Commercial Realty',
    liveCalls: 0,
    meetings: 7,
    mrr: '$4K',
    health: 68,
    status: 'At Risk',
  },
];

const formatCurrency = (value: AdminStats['mrr']) => {
  if (typeof value === 'number') {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(value);
  }

  return value || fallbackStats.mrr;
};

const AdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const gccScope = useGccTenantScope();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data?.data ?? null);
      } catch (error) {
        console.log(error)
        setStats(null);
      }
    };

    fetchStats();
  }, [gccScope.scopeOrgId]);

  const kpis = useMemo(() => {
    const hitlQueue =
      (stats?.pendingScripts ?? 7) +
      (stats?.pendingUploads ?? 6) +
      (stats?.pendingClones ?? 4);

    return [
      {
        label: 'Total Clients',
        value: stats?.organizations ?? fallbackStats.organizations,
        subtext: 'Across all tenant scopes',
        onClick: () => navigate('/admin/organizations'),
      },
      {
        label: 'Live Calls Now',
        value: stats?.activeCalls ?? fallbackStats.activeCalls,
        subtext: 'Monitored in real time',
        onClick: () => navigate('/admin/call-logs'),
      },
      {
        label: 'Meetings/Mo',
        value: stats?.meetingsThisMonth ?? fallbackStats.meetingsThisMonth,
        subtext: 'Booked this month',
        onClick: () => navigate('/admin/calendar'),
      },
      {
        label: 'MRR',
        value: formatCurrency(stats?.mrr),
        subtext: 'Active recurring revenue',
        onClick: () => navigate('/admin/commissions'),
      },
      {
        label: 'HITL Queue',
        value: stats ? hitlQueue : fallbackStats.hitlQueue,
        subtext: 'Scripts, uploads, clones',
        onClick: () => navigate('/admin/hitl'),
      },
    ];
  }, [navigate, stats]);

  const handleCallAction = (action: string, prospect: string) => {
    toast.success(`${action} requested for ${prospect}`);
  };

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

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] gap-4">
        <section className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[hsl(var(--border-v))]">
            <div>
              <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Active Live Calls</h2>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                Listen, intervene, or stop campaigns from the operations floor.
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              {liveCalls.length} live
            </Badge>
          </div>

          <div className="divide-y divide-[hsl(var(--border-v))]">
            {liveCalls.map((call) => (
              <div key={call.id} className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm text-[hsl(var(--foreground))]">
                        {call.prospect}
                      </p>
                      <Badge
                        className="font-mono bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        variant="outline"
                      >
                        {call.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {call.company} · {call.agent} · {call.duration}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCallAction('Listen', call.prospect)}
                    >
                      <Headphones />
                      Listen
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCallAction('Take over', call.prospect)}
                    >
                      <PhoneCall />
                      Take Over
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCallAction('Kill campaign', call.prospect)}
                    >
                      <Ban />
                      Kill Campaign
                    </Button>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/25 p-3">
                  <p className="text-[11px] font-mono uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-1">
                    Latest transcript
                  </p>
                  <p className="text-xs leading-relaxed text-[hsl(var(--foreground))]">
                    {call.transcript.at(-1)?.speaker}: {call.transcript.at(-1)?.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

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
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {alert.label}
                      </p>
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
            {clientHealth.map((client) => (
              <TableRow key={client.client}>
                <TableCell className="font-medium text-[hsl(var(--foreground))]">{client.client}</TableCell>
                <TableCell className="font-mono">{client.liveCalls}</TableCell>
                <TableCell className="font-mono">{client.meetings}</TableCell>
                <TableCell className="font-mono">{client.mrr}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default AdminDashboardView;
