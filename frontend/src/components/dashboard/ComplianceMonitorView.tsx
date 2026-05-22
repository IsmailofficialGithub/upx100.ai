import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { useAuth } from '@/context/AuthContext';
import { Bot, AlertTriangle, Trash2, Loader2, Building2, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { parseNullableDate, formatNullableDate, formatNullableLocaleDate } from '@/lib/dateFormat';
import {
  readRecordingDisclosureEnabled,
  RECORDING_DISCLOSURE_COMPLIANCE_CODE,
  RECORDING_DISCLOSURE_COMPLIANCE_TITLE,
} from '@/lib/recordingDisclosure';
import {
  PARTICIPANT_ERASURE_COMPLIANCE_CODE,
  PARTICIPANT_ERASURE_COMPLIANCE_TITLE,
  pedElapsedLabel,
  pedLedgerOpenedAt,
  sortPedLedgerRows,
} from '@/lib/participantErasure';
import { Checkbox } from '@/components/ui/checkbox';

type CallLogRow = {
  id: string;
  organization_id?: string | null;
  organization_name?: string | null;
  caller_number?: string | null;
  agent_name?: string | null;
  is_deleted_data?: boolean;
  deleted_data_at?: string | null;
  ended_at?: string | null;
  created_at?: string | null;
};

type AgentRow = {
  id: string;
  name: string;
  organization_id?: string | null;
  user_id?: string | null;
  created_at?: string | null;
  recording_disclosure_enabled?: boolean;
  metadata?: { recording_disclosure_enabled?: boolean };
  organizations?: { name: string } | { name: string }[];
};

type AdminUserRow = {
  id: string;
  email?: string;
  full_name?: string | null;
};

function orgNameFromAgent(agent: AgentRow): string | null {
  const org = agent.organizations;
  if (!org) return null;
  if (Array.isArray(org)) return org[0]?.name ?? null;
  return org.name ?? null;
}

function userLabel(user: AdminUserRow | undefined): string | null {
  if (!user) return null;
  return user.full_name?.trim() || user.email || null;
}

function RagPill({
  status,
  title,
  label,
}: {
  status: 'green' | 'amber' | 'red' | 'pending';
  title?: string;
  label?: string;
}) {
  const styles = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border-v))]',
  };
  const labels = {
    green: 'Pass',
    amber: 'Review',
    red: 'Fail',
    pending: 'Pending',
  };
  return (
    <span
      title={title}
      className={cn(
        'inline-flex font-mono text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide',
        styles[status],
      )}
    >
      {label ?? labels[status]}
    </span>
  );
}

const ComplianceMonitorView: React.FC = () => {
  const navigate = useNavigate();
  const gccScope = useGccTenantScope();
  const { isGCCAdmin } = useAuth();
  const [callLogs, setCallLogs] = useState<CallLogRow[]>([]);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [usersById, setUsersById] = useState<Map<string, AdminUserRow>>(new Map());
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [purging, setPurging] = useState(false);

  const scopedOrgs = useMemo(() => {
    if (gccScope.scopeOrgId === 'all') return gccScope.organizations;
    return gccScope.organizations.filter((o) => o.id === gccScope.scopeOrgId);
  }, [gccScope.organizations, gccScope.scopeOrgId]);

  const scopedOrgIds = useMemo(() => new Set(scopedOrgs.map((o) => o.id)), [scopedOrgs]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const [logsRes, agentsRes, usersRes] = await Promise.all([
          api.get<{ data: CallLogRow[] }>('/admin/call-logs'),
          api.get<{ data: AgentRow[] }>('/admin/agents'),
          api.get<{ data: AdminUserRow[] }>('/admin/users'),
        ]);
        if (cancelled) return;

        const logs = (logsRes.data?.data ?? []).filter(
          (row) => row.organization_id && scopedOrgIds.has(row.organization_id),
        );
        setCallLogs(logs);

        const userMap = new Map<string, AdminUserRow>();
        for (const user of usersRes.data?.data ?? []) {
          userMap.set(user.id, user);
        }
        setUsersById(userMap);

        const scopedAgents = (agentsRes.data?.data ?? []).filter(
          (agent) => agent.organization_id && scopedOrgIds.has(agent.organization_id),
        );
        scopedAgents.sort((a, b) => {
          const ta = parseNullableDate(a.created_at)?.getTime() ?? 0;
          const tb = parseNullableDate(b.created_at)?.getTime() ?? 0;
          return tb - ta;
        });
        setAgents(scopedAgents);
      } catch {
        if (!cancelled) {
          setCallLogs([]);
          setAgents([]);
          setUsersById(new Map());
          setFetchError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [gccScope.scopeOrgId, scopedOrgIds, reloadKey]);

  const deletedCallLogs = useMemo(
    () => sortPedLedgerRows(callLogs.filter((row) => Boolean(row.is_deleted_data))),
    [callLogs],
  );

  const allDeletedSelected =
    deletedCallLogs.length > 0 && deletedCallLogs.every((row) => selectedLogIds.has(row.id));

  const purgeCallLogs = useCallback(
    async (ids: string[]) => {
      if (!ids.length || !isGCCAdmin) return;
      setPurging(true);
      try {
        await api.post<{ data: { deleted: number } }>('/admin/call-logs/delete', { ids });
        setCallLogs((prev) => prev.filter((row) => !ids.includes(row.id)));
        setSelectedLogIds((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
        toast.success(`Removed ${ids.length} call log${ids.length === 1 ? '' : 's'}`);
      } catch {
        toast.error('Failed to delete call logs');
        setReloadKey((k) => k + 1);
      } finally {
        setPurging(false);
      }
    },
    [isGCCAdmin],
  );

  const confirmAndPurge = useCallback(
    (ids: string[]) => {
      if (!ids.length) return;
      const message = `Permanently purge ${ids.length} call log${ids.length === 1 ? '' : 's'} from the ${PARTICIPANT_ERASURE_COMPLIANCE_CODE} ledger? This cannot be undone.`;
      if (!window.confirm(message)) return;
      void purgeCallLogs(ids);
    },
    [purgeCallLogs],
  );

  const toggleSelectAllDeleted = useCallback(() => {
    if (allDeletedSelected) {
      setSelectedLogIds(new Set());
      return;
    }
    setSelectedLogIds(new Set(deletedCallLogs.map((row) => row.id)));
  }, [allDeletedSelected, deletedCallLogs]);

  const summary = useMemo(() => {
    const disclosureOff = agents.filter((a) => !readRecordingDisclosureEnabled(a)).length;
    const orgIdsWithDeleted = new Set(
      deletedCallLogs.map((row) => row.organization_id).filter(Boolean) as string[],
    );
    return {
      agents: agents.length,
      disclosureOff,
      deletedLogs: deletedCallLogs.length,
      clientsWithDeleted: orgIdsWithDeleted.size,
    };
  }, [agents, deletedCallLogs]);

  return (
    <div key={gccScope.scopeOrgId} className="space-y-6 max-w-[1400px]">
      <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--foreground))]">Compliance monitor · </span>
        Agent RCD and open PED (participant erasure disposition) cases from live call logs. US and UK clients only in tenant scope.
      </p>

      {fetchError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          Could not load call logs. Check the API and refresh the page.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricChip label="Agents in scope" value={loading ? '…' : String(summary.agents)} />
        <MetricChip
          label={`${RECORDING_DISCLOSURE_COMPLIANCE_CODE} fail`}
          value={loading ? '…' : String(summary.disclosureOff)}
          tone={summary.disclosureOff > 0 ? 'warn' : 'ok'}
        />
        <MetricChip
          label={`${PARTICIPANT_ERASURE_COMPLIANCE_CODE} open`}
          value={loading ? '…' : String(summary.deletedLogs)}
          tone={summary.deletedLogs > 0 ? 'warn' : 'ok'}
        />
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">
              Agents — {RECORDING_DISCLOSURE_COMPLIANCE_CODE}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/agents')}
            className="text-[10px] font-mono uppercase tracking-wide text-[hsl(var(--primary))] hover:underline"
          >
            Manage agents
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-[hsl(var(--muted-foreground))]">
            <Loader2 size={16} className="animate-spin text-[hsl(var(--primary))]" />
            Loading…
          </div>
        ) : agents.length === 0 ? (
          <p className="text-xs text-[hsl(var(--muted-foreground))] py-6 text-center">No agents in this client scope.</p>
        ) : (
          <table className="w-full text-xs min-w-[720px]">
            <thead>
              <tr className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider border-b border-[hsl(var(--border-v))]">
                <th className="text-left py-2 pr-4">Agent</th>
                <th className="text-left py-2 pr-4">Client organization</th>
                <th className="text-left py-2 pr-4">Assigned user</th>
                <th className="text-left py-2 pr-4">Created</th>
                <th className="text-right py-2" title={RECORDING_DISCLOSURE_COMPLIANCE_TITLE}>
                  {RECORDING_DISCLOSURE_COMPLIANCE_CODE}
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => {
                const disclosureOn = readRecordingDisclosureEnabled(agent);
                const orgName = orgNameFromAgent(agent);
                const assignedUser = agent.user_id ? usersById.get(agent.user_id) : undefined;
                const assignedLabel = userLabel(assignedUser);
                return (
                  <tr key={agent.id} className="border-b border-[hsl(var(--border-v))]/60 last:border-0">
                    <td className="py-2.5 pr-4">
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{agent.id.slice(0, 8)}…</p>
                    </td>
                    <td className="py-2.5 pr-4">
                      {orgName ? (
                        <span className="inline-flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                          <Building2 size={12} className="text-[hsl(var(--muted-foreground))] shrink-0" />
                          {orgName}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">—</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-4">
                      {assignedLabel ? (
                        <span className="inline-flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                          <User size={12} className="text-[hsl(var(--muted-foreground))] shrink-0" />
                          <span>
                            {assignedLabel}
                            {assignedUser?.email && assignedUser.full_name ? (
                              <span className="block text-[10px] text-[hsl(var(--muted-foreground))]">{assignedUser.email}</span>
                            ) : null}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">—</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-[10px] text-[hsl(var(--muted-foreground))]">
                      {formatNullableLocaleDate(agent.created_at)}
                    </td>
                    <td className="py-2.5 text-right">
                      <RagPill
                        status={disclosureOn ? 'green' : 'red'}
                        label={disclosureOn ? 'Pass' : 'Fail'}
                        title={
                          disclosureOn
                            ? `${RECORDING_DISCLOSURE_COMPLIANCE_CODE}: Pass — pre-call recording notice enabled`
                            : `${RECORDING_DISCLOSURE_COMPLIANCE_CODE}: Fail — pre-call recording notice disabled`
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Trash2 size={14} className="text-[hsl(var(--primary))]" />
            <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">
              {PARTICIPANT_ERASURE_COMPLIANCE_CODE} — erasure ledger
            </h3>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {isGCCAdmin && deletedCallLogs.length > 0 && (
              <>
                <button
                  type="button"
                  disabled={purging || selectedLogIds.size === 0}
                  onClick={() => confirmAndPurge([...selectedLogIds])}
                  className="text-[10px] font-mono uppercase tracking-wide text-red-400 hover:underline disabled:opacity-40 disabled:no-underline"
                >
                  Purge selected ({selectedLogIds.size})
                </button>
                <button
                  type="button"
                  disabled={purging}
                  onClick={() => confirmAndPurge(deletedCallLogs.map((row) => row.id))}
                  className="text-[10px] font-mono uppercase tracking-wide text-red-400 hover:underline disabled:opacity-40"
                >
                  Purge all ({deletedCallLogs.length})
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => navigate('/admin/call-logs')}
              className="text-[10px] font-mono uppercase tracking-wide text-[hsl(var(--primary))] hover:underline"
            >
              Open live calls
            </button>
          </div>
        </div>
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] mb-3">
          Open <span className="font-mono">{PARTICIPANT_ERASURE_COMPLIANCE_CODE}</span> cases ({PARTICIPANT_ERASURE_COMPLIANCE_TITLE}).
          Elapsed uses calendar days from call log <span className="font-mono">created_at</span>: <span className="font-medium">Today</span> on day
          0, <span className="font-medium">1 day ago</span> on the next calendar day. <span className="font-medium">Opened</span> shows erasure
          stamp when set. GCC admins can purge ledger rows after review.
        </p>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-[hsl(var(--muted-foreground))]">
            <Loader2 size={16} className="animate-spin text-[hsl(var(--primary))]" />
            Loading call logs…
          </div>
        ) : deletedCallLogs.length === 0 ? (
          <p className="text-xs text-[hsl(var(--muted-foreground))] py-6 text-center">
            No open {PARTICIPANT_ERASURE_COMPLIANCE_CODE} cases in this scope.
          </p>
        ) : (
          <table className="w-full text-xs min-w-[800px]">
            <thead>
              <tr className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border-v))]">
                {isGCCAdmin && (
                  <th className="text-left py-2 pr-2 w-8">
                    <Checkbox
                      checked={allDeletedSelected}
                      onCheckedChange={toggleSelectAllDeleted}
                      aria-label={`Select all ${PARTICIPANT_ERASURE_COMPLIANCE_CODE} ledger rows`}
                      disabled={purging}
                    />
                  </th>
                )}
                <th className="text-left py-2">Client</th>
                <th className="text-left py-2">Participant</th>
                <th className="text-left py-2">Agent</th>
                <th className="text-left py-2" title={PARTICIPANT_ERASURE_COMPLIANCE_TITLE}>
                  {PARTICIPANT_ERASURE_COMPLIANCE_CODE}
                </th>
                <th className="text-left py-2">Elapsed</th>
                <th className="text-left py-2">Opened</th>
                <th className="text-right py-2">Call date</th>
                {isGCCAdmin && <th className="text-right py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {deletedCallLogs.map((row) => {
                const callDate = row.ended_at ?? row.created_at;
                const elapsed = pedElapsedLabel(row);
                const openedAt = pedLedgerOpenedAt(row);
                const selected = selectedLogIds.has(row.id);
                return (
                  <tr key={row.id} className="border-b border-[hsl(var(--border-v))]/60 last:border-0">
                    {isGCCAdmin && (
                      <td className="py-2 pr-2">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={(checked) => {
                            setSelectedLogIds((prev) => {
                              const next = new Set(prev);
                              if (checked) next.add(row.id);
                              else next.delete(row.id);
                              return next;
                            });
                          }}
                          aria-label={`Select call log ${row.id}`}
                          disabled={purging}
                        />
                      </td>
                    )}
                    <td className="py-2 font-medium">{row.organization_name || '—'}</td>
                    <td className="py-2 font-mono text-[10px]">{row.caller_number || 'Unknown'}</td>
                    <td className="py-2 text-[hsl(var(--muted-foreground))]">{row.agent_name || '—'}</td>
                    <td className="py-2">
                      <RagPill status="red" label="Open" title={`${PARTICIPANT_ERASURE_COMPLIANCE_CODE}: participant PII erasure on file`} />
                    </td>
                    <td className="py-2 font-mono text-[10px]" title={elapsed.title}>
                      {elapsed.label}
                    </td>
                    <td className="py-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                      {formatNullableDate(openedAt, 'MMM d, yyyy')}
                    </td>
                    <td className="py-2 text-right font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                      {formatNullableDate(callDate, 'MMM d, yyyy')}
                    </td>
                    {isGCCAdmin && (
                      <td className="py-2 text-right">
                        <button
                          type="button"
                          disabled={purging}
                          onClick={() => confirmAndPurge([row.id])}
                          className="text-[10px] font-mono uppercase tracking-wide text-red-400 hover:underline disabled:opacity-40"
                        >
                          Purge
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {summary.clientsWithDeleted > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 text-xs text-[hsl(var(--foreground))]">
          <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
          <p>
            {summary.clientsWithDeleted} client(s) have open {PARTICIPANT_ERASURE_COMPLIANCE_CODE} cases. Review the erasure ledger
            or Live Calls before resuming outreach.
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
