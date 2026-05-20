import React, { useMemo } from 'react';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { Shield, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type ScrubStatus = 'ACTIVE' | 'PAUSED' | 'FLAGGED';
type LedgerStatus = 'completed' | 'in_progress' | 'queued';

type ClientComplianceRow = {
  id: string;
  name: string;
  country_code: string;
  tps: ScrubStatus;
  ctps: ScrubStatus;
  dnc: ScrubStatus;
  lastScrub: string;
  violations: number;
};

type ErasureRow = {
  id: string;
  reference: string;
  clientName: string;
  organizationId: string;
  requested: string;
  completed: string | null;
  status: LedgerStatus;
  slaDays: number;
};

type DpaRow = {
  contractor: string;
  role: string;
  signed: string;
  status: 'signed' | 'pending' | 'expired';
};

/** Stable demo rows keyed to org id — replace with `/admin/compliance` when API exists. */
function complianceForOrg(orgId: string, countryCode: string): Omit<ClientComplianceRow, 'id' | 'name' | 'country_code'> {
  const uk = countryCode === 'GB';
  const n = orgId.charCodeAt(0) + orgId.charCodeAt(orgId.length - 1);
  const flagged = n % 11 === 0;
  return {
    tps: flagged ? 'FLAGGED' : 'ACTIVE',
    ctps: uk ? (flagged ? 'PAUSED' : 'ACTIVE') : 'ACTIVE',
    dnc: 'ACTIVE',
    lastScrub: flagged ? 'Yesterday 06:00 GMT' : 'Today 06:00 GMT',
    violations: flagged ? 1 : 0,
  };
}

const ERASURE_LEDGER: ErasureRow[] = [
  { id: '1', reference: 'RTEF-2026-0142', clientName: 'Sentinel Cyber UK', organizationId: '', requested: '12 Apr 2026', completed: '16 Apr 2026', status: 'completed', slaDays: 4 },
  { id: '2', reference: 'RTEF-2026-0138', clientName: 'Fortis Managed Services', organizationId: '', requested: '8 Apr 2026', completed: '11 Apr 2026', status: 'completed', slaDays: 3 },
  { id: '3', reference: 'RTEF-2026-0151', clientName: 'CareLogic Systems', organizationId: '', requested: '18 Apr 2026', completed: null, status: 'in_progress', slaDays: 2 },
];

const CONTRACTOR_DPAS: DpaRow[] = [
  { contractor: 'Vapi Inc.', role: 'Voice AI sub-processor', signed: '15 Jan 2026', status: 'signed' },
  { contractor: 'Twilio Ireland Ltd', role: 'Telephony (UK/EU)', signed: '15 Jan 2026', status: 'signed' },
  { contractor: 'Supabase Inc.', role: 'Data hosting', signed: '10 Jan 2026', status: 'signed' },
  { contractor: 'Deepgram Inc.', role: 'Speech-to-text', signed: '22 Feb 2026', status: 'signed' },
];

function StatusPill({ status }: { status: ScrubStatus }) {
  const styles: Record<ScrubStatus, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    PAUSED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    FLAGGED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={cn('font-mono text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide', styles[status])}>
      {status}
    </span>
  );
}

function CompRow({ label, value, valueClassName }: { label: string; value: React.ReactNode; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-[hsl(var(--border-v))] last:border-0 text-xs">
      <span className="font-medium text-[hsl(var(--foreground))]">{label}</span>
      <span className={cn('text-right shrink-0', valueClassName ?? 'text-[hsl(var(--muted-foreground))]')}>{value}</span>
    </div>
  );
}

const ComplianceMonitorView: React.FC = () => {
  const gccScope = useGccTenantScope();

  const scopedOrgs = useMemo(() => {
    if (gccScope.scopeOrgId === 'all') return gccScope.organizations;
    return gccScope.organizations.filter((o) => o.id === gccScope.scopeOrgId);
  }, [gccScope.organizations, gccScope.scopeOrgId]);

  const clientRows: ClientComplianceRow[] = useMemo(
    () =>
      scopedOrgs.map((o) => ({
        id: o.id,
        name: o.name,
        country_code: o.country_code || 'US',
        ...complianceForOrg(o.id, o.country_code || 'US'),
      })),
    [scopedOrgs],
  );

  const networkSummary = useMemo(() => {
    const violations = clientRows.reduce((s, r) => s + r.violations, 0);
    const flagged = clientRows.filter((r) => r.tps === 'FLAGGED' || r.ctps === 'FLAGGED').length;
    const ukClients = clientRows.filter((r) => r.country_code === 'GB').length;
    return { violations, flagged, ukClients, total: clientRows.length };
  }, [clientRows]);

  const erasureRows = useMemo(() => {
    const names = new Set(scopedOrgs.map((o) => o.name));
    if (gccScope.scopeOrgId === 'all') return ERASURE_LEDGER;
    return ERASURE_LEDGER.filter((r) => names.has(r.clientName));
  }, [gccScope.scopeOrgId, scopedOrgs]);

  const isUkNetwork = networkSummary.ukClients > 0 && networkSummary.ukClients === networkSummary.total;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--foreground))]">Compliance monitor · </span>
        TPS / CTPS / DNC, PECR / GDPR signals, contractor DPAs, and erasure ledger.
        <span className="text-[hsl(var(--foreground))]/80"> Reference data until the compliance API is wired.</span>
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricChip label="Clients in scope" value={String(networkSummary.total)} />
        <MetricChip
          label="Violations (month)"
          value={String(networkSummary.violations)}
          tone={networkSummary.violations > 0 ? 'danger' : 'ok'}
        />
        <MetricChip label="Flagged scrubs" value={String(networkSummary.flagged)} tone={networkSummary.flagged > 0 ? 'warn' : 'ok'} />
        <MetricChip label="UK clients" value={String(networkSummary.ukClients)} sub={isUkNetwork ? 'PECR / CTPS applies' : 'Mixed regions'} />
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={14} className="text-[hsl(var(--primary))]" />
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">TPS / CTPS / DNC — per client</h3>
        </div>
        {clientRows.length === 0 ? (
          <p className="text-xs text-[hsl(var(--muted-foreground))] py-6 text-center">No clients in scope. Adjust tenant scope or add organizations.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider border-b border-[hsl(var(--border-v))]">
                <th className="text-left py-2 pr-4">Client</th>
                <th className="text-left py-2 pr-4">Region</th>
                <th className="text-left py-2 pr-3">TPS</th>
                <th className="text-left py-2 pr-3">CTPS</th>
                <th className="text-left py-2 pr-3">DNC</th>
                <th className="text-left py-2 pr-4">Last scrub</th>
                <th className="text-right py-2">Violations</th>
              </tr>
            </thead>
            <tbody>
              {clientRows.map((row) => (
                <tr key={row.id} className="border-b border-[hsl(var(--border-v))]/60 last:border-0">
                  <td className="py-2.5 pr-4 font-medium">{row.name}</td>
                  <td className="py-2.5 pr-4 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                    {row.country_code === 'GB' ? 'UK · GBP' : 'US · USD'}
                  </td>
                  <td className="py-2.5 pr-3"><StatusPill status={row.tps} /></td>
                  <td className="py-2.5 pr-3">
                    {row.country_code === 'GB' ? <StatusPill status={row.ctps} /> : <span className="text-[10px] text-[hsl(var(--muted-foreground))]">N/A</span>}
                  </td>
                  <td className="py-2.5 pr-3"><StatusPill status={row.dnc} /></td>
                  <td className="py-2.5 pr-4 text-[hsl(var(--muted-foreground))]">{row.lastScrub}</td>
                  <td className={cn('py-2.5 text-right font-mono font-semibold', row.violations > 0 ? 'text-red-400' : 'text-emerald-400')}>
                    {row.violations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
            TPS / CTPS / DNC status
          </h3>
          <CompRow label="TPS scrub" value={<span className="font-mono text-[10px] text-emerald-400">ACTIVE</span>} />
          <CompRow
            label="CTPS scrub"
            value={<span className="font-mono text-[10px] text-emerald-400">ACTIVE</span>}
          />
          <CompRow label="Last scrub run" value="Today 06:00 GMT" />
          <CompRow label="Numbers suppressed (lifetime)" value={<span className="font-mono text-[hsl(var(--foreground))]">1,847</span>} />
          <CompRow
            label="Violations this month"
            value={<span className="font-mono text-emerald-400">{networkSummary.violations}</span>}
          />
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
            PECR / GDPR audit panel
          </h3>
          <CompRow label="AI disclosure played" value={<span className="font-mono text-[10px] text-emerald-400">100%</span>} />
          <CompRow label="Right to erasure requests" value="3 processed (avg 4 days)" />
          <CompRow label="Data retention" value="90-day auto-purge active" />
          <CompRow label="Contractor DPAs" value={<span className="font-mono text-[10px] text-emerald-400">ALL SIGNED</span>} />
          <CompRow label="Sub-processor register" value="Last updated 8 Apr 2026" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Contractor DPA status</h3>
          </div>
          <div className="space-y-2">
            {CONTRACTOR_DPAS.map((d) => (
              <div
                key={d.contractor}
                className="flex items-center justify-between gap-2 py-2 border-b border-[hsl(var(--border-v))] last:border-0 text-xs"
              >
                <div>
                  <p className="font-medium">{d.contractor}</p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{d.role}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] text-emerald-400 uppercase">{d.status}</span>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{d.signed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Right-to-erasure ledger</h3>
          </div>
          {erasureRows.length === 0 ? (
            <p className="text-xs text-[hsl(var(--muted-foreground))] py-4">No erasure requests for clients in this scope.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border-v))]">
                  <th className="text-left py-2">Reference</th>
                  <th className="text-left py-2">Client</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-right py-2">SLA</th>
                </tr>
              </thead>
              <tbody>
                {erasureRows.map((row) => (
                  <tr key={row.id} className="border-b border-[hsl(var(--border-v))]/60 last:border-0">
                    <td className="py-2 font-mono text-[10px]">{row.reference}</td>
                    <td className="py-2">{row.clientName}</td>
                    <td className="py-2">
                      <span
                        className={cn(
                          'font-mono text-[9px] uppercase',
                          row.status === 'completed' ? 'text-emerald-400' : 'text-yellow-500',
                        )}
                      >
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                      {row.status === 'completed' ? `${row.slaDays}d` : `${row.slaDays}d elapsed`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {networkSummary.violations > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-xs text-[hsl(var(--foreground))]">
          <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
          <p>
            One or more clients have scrub violations this month. Review flagged rows above and pause outbound for affected tenants until lists are re-scrubbed.
          </p>
        </div>
      )}
    </div>
  );
};

function MetricChip({
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'neutral' | 'ok' | 'warn' | 'danger';
}) {
  const valueColor =
    tone === 'ok' ? 'text-emerald-400' : tone === 'warn' ? 'text-yellow-500' : tone === 'danger' ? 'text-red-400' : 'text-[hsl(var(--primary))]';
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2.5">
      <p className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">{label}</p>
      <p className={cn('text-xl font-bold font-mono mt-1', valueColor)}>{value}</p>
      {sub && <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{sub}</p>}
    </div>
  );
}

export default ComplianceMonitorView;
