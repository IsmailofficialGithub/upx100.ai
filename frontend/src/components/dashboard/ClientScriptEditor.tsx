import React, { useCallback, useEffect, useState } from 'react';
import { Bot, FileText, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import { stripAgentConfigHeader } from '@/lib/agentPrompt';

type AgentRow = {
  id: string;
  name: string;
  script: string | null;
  status: string;
  agent_type?: string | null;
};

type AuditRow = {
  id: string;
  agent_id: string;
  agent_name: string | null;
  actor_name: string | null;
  action: string;
  campaign_type: string | null;
  created_at: string;
};

type Props = {
  organizationId: string;
  organizationName: string;
};

const ClientScriptEditor: React.FC<Props> = ({ organizationId, organizationName }) => {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [auditLog, setAuditLog] = useState<AuditRow[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [draftScript, setDraftScript] = useState('');
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loadingAudit, setLoadingAudit] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAgents = useCallback(async () => {
    setLoadingAgents(true);
    try {
      const res = await api.get<{ data: AgentRow[] }>(
        `/admin/organizations/${organizationId}/agents`,
      );
      const rows = res.data?.data ?? [];
      setAgents(rows);
      setSelectedAgentId((prev) => {
        if (prev && rows.some((a) => a.id === prev)) return prev;
        return rows[0]?.id ?? '';
      });
    } catch {
      toast.error('Failed to load agents for this client');
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  }, [organizationId]);

  const loadAudit = useCallback(async () => {
    setLoadingAudit(true);
    try {
      const res = await api.get<{ data: AuditRow[] }>(
        `/admin/organizations/${organizationId}/script-audit-log`,
      );
      setAuditLog(res.data?.data ?? []);
    } catch {
      setAuditLog([]);
    } finally {
      setLoadingAudit(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadAgents();
    loadAudit();
  }, [loadAgents, loadAudit]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  useEffect(() => {
    if (!selectedAgent) {
      setDraftScript('');
      return;
    }
    setDraftScript(stripAgentConfigHeader(selectedAgent.script) || '');
  }, [selectedAgentId, selectedAgent?.script, selectedAgent?.id]);

  const handleSave = async () => {
    if (!selectedAgentId) return;
    setSaving(true);
    try {
      await api.patch(`/admin/organizations/${organizationId}/agents/${selectedAgentId}/script`, {
        script: draftScript,
        campaign_type: selectedAgent?.agent_type || undefined,
      });
      toast.success('Script saved and recorded in audit log');
      await Promise.all([loadAgents(), loadAudit()]);
    } catch {
      toast.error('Failed to save script');
    } finally {
      setSaving(false);
    }
  };

  if (loadingAgents) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="rounded-xl border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 p-6 text-center">
        <Bot className="mx-auto mb-2 h-8 w-8 text-[hsl(var(--muted-foreground))]" />
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          No agents for {organizationName} yet. Provision an agent before editing live scripts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 px-3 py-2 text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed">
        Direct script editor for GCC staff. Changes save immediately to the agent and are written to the audit log.
        Client script change requests and CSV uploads are reviewed in{' '}
        <span className="font-mono text-[hsl(var(--primary))]">HITL Queue</span>.
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">
          Agent
        </label>
        <select
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}
          className="w-full rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] px-3 py-2 text-xs"
        >
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} · {a.status}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">
          Live script
        </label>
        <textarea
          value={draftScript}
          onChange={(e) => setDraftScript(e.target.value)}
          rows={14}
          className="w-full resize-y rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30 px-3 py-2 font-mono text-[11px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
          placeholder="Agent conversation script…"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !selectedAgentId}
            className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-xs font-semibold text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save script
          </button>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-[hsl(var(--border-v))]">
        <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider flex items-center gap-1.5">
          <FileText size={12} /> Audit log
        </p>
        {loadingAudit ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--muted-foreground))]" />
          </div>
        ) : auditLog.length === 0 ? (
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] italic">No script edits recorded yet.</p>
        ) : (
          <ul className="max-h-40 space-y-1.5 overflow-y-auto">
            {auditLog.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] px-2.5 py-2 text-[10px]"
              >
                <span className="font-medium text-[hsl(var(--foreground))]">
                  {row.agent_name || 'Agent'}
                </span>
                <span className="text-[hsl(var(--muted-foreground))]">
                  {' '}
                  · {row.actor_name || 'Staff'} · {formatNullableLocaleDate(row.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientScriptEditor;

