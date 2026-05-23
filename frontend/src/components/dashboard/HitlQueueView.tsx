import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Loader2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import api, { isAuthRedirectInProgress, isAuthSessionError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import {
  countPendingItems,
  HITL_KIND_META,
  mapPortToHitl,
  mapScriptToHitl,
  mapUploadToHitl,
  mapVoiceCloneToHitl,
  notifyHitlQueueChanged,
  type HitlFilterKind,
  type HitlItem,
} from '@/lib/hitlQueue';
import HitlQueueDetailDrawer from './HitlQueueDetailDrawer';
const TYPE_TABS: { id: HitlFilterKind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'csv_upload', label: HITL_KIND_META.csv_upload.shortLabel },
  { id: 'script_request', label: HITL_KIND_META.script_request.shortLabel },
  { id: 'voice_clone', label: HITL_KIND_META.voice_clone.shortLabel },
  { id: 'port_request', label: HITL_KIND_META.port_request.shortLabel },
];

function parseTypeParam(value: string | null): HitlFilterKind {
  if (value === 'csv' || value === 'upload' || value === 'csv_upload') return 'csv_upload';
  if (value === 'script' || value === 'script_request') return 'script_request';
  if (value === 'voice' || value === 'voice_clone') return 'voice_clone';
  if (value === 'port' || value === 'port_request') return 'port_request';
  return 'all';
}

const HitlQueueView: React.FC = () => {
  const { isGCCAdmin, isGCCReviewer } = useAuth();
  const gccScope = useGccTenantScope();
  const canReview = isGCCAdmin || isGCCReviewer;
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState<HitlItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<HitlFilterKind>(() => parseTypeParam(searchParams.get('type')));
  const [pendingOnly, setPendingOnly] = useState(true);
  const [selected, setSelected] = useState<HitlItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actingKey, setActingKey] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const [uploadsRes, scriptsRes, clonesRes, phonesRes] = await Promise.all([
        api.get('/admin/target-uploads'),
        api.get('/admin/script-requests'),
        api.get('/admin/voice-clones'),
        api.get('/admin/phone-numbers'),
      ]);

      const merged: HitlItem[] = [
        ...(uploadsRes.data.data ?? []).map((r: Record<string, unknown>) => mapUploadToHitl(r)),
        ...(scriptsRes.data.data ?? []).map((r: Record<string, unknown>) => mapScriptToHitl(r)),
        ...(clonesRes.data.data ?? []).map((r: Record<string, unknown>) => mapVoiceCloneToHitl(r)),
        ...(phonesRes.data.data ?? [])
          .filter((r: Record<string, unknown>) => r.port_requested)
          .map((r: Record<string, unknown>) => mapPortToHitl(r)),
      ];

      merged.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

      setItems(merged);
    } catch (error) {
      if (!isAuthSessionError(error) && !isAuthRedirectInProgress()) {
        toast.error('Failed to load HITL queue');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    const bump = () => fetchQueue();
    window.addEventListener('gcc-tenant-scope-changed', bump);
    window.addEventListener('gcc-hitl-queue-changed', bump);
    return () => {
      window.removeEventListener('gcc-tenant-scope-changed', bump);
      window.removeEventListener('gcc-hitl-queue-changed', bump);
    };
  }, [fetchQueue]);

  useEffect(() => {
    setTypeFilter(parseTypeParam(searchParams.get('type')));
  }, [searchParams]);

  const filtered = useMemo(() => {
    let rows = items;
    if (gccScope.scopeOrgId !== 'all') {
      const orgId = gccScope.scopeOrgId;
      const orgName = gccScope.organizations.find((o) => o.id === orgId)?.name;
      rows = rows.filter((r) => {
        const rid = (r.raw as { organization_id?: string } | undefined)?.organization_id;
        if (rid) return rid === orgId;
        return orgName ? r.organizationName === orgName : true;
      });
    }
    if (pendingOnly) rows = rows.filter((r) => r.pending);
    if (typeFilter !== 'all') rows = rows.filter((r) => r.kind === typeFilter);
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.organizationName.toLowerCase().includes(q) ||
          r.statusLabel.toLowerCase().includes(q) ||
          HITL_KIND_META[r.kind].label.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [items, pendingOnly, typeFilter, searchTerm, gccScope.scopeOrgId, gccScope.organizations]);

  const pendingCount = useMemo(() => countPendingItems(items), [items]);

  const approve = async (item: HitlItem) => {
    const key = `${item.kind}:${item.id}`;
    setActingKey(key);
    try {
      switch (item.kind) {
        case 'csv_upload':
          await api.patch(`/target-uploads/${item.id}/status`, { status: 'approved' });
          break;
        case 'script_request':
          await api.patch(`/script-requests/${item.id}/review`, { status: 'approved' });
          break;
        case 'voice_clone':
          await api.patch(`/voice-clones/${item.id}/review`, { status: 'approved' });
          break;
        case 'port_request':
          await api.patch(`/phone-numbers/${item.id}/port-review`, { status: 'approved' });
          break;
      }
      toast.success('Approved');
      notifyHitlQueueChanged();
      await fetchQueue();
    } catch {
      toast.error('Failed to approve');
    } finally {
      setActingKey(null);
    }
  };

  const reject = async (item: HitlItem) => {
    const note = window.prompt('Rejection reason (optional):');
    if (note === null) return;
    const key = `${item.kind}:${item.id}`;
    setActingKey(key);
    try {
      switch (item.kind) {
        case 'csv_upload':
          await api.patch(`/target-uploads/${item.id}/status`, {
            status: 'rejected',
            rejection_note: note.trim() || undefined,
          });
          break;
        case 'script_request':
          await api.patch(`/script-requests/${item.id}/review`, {
            status: 'rejected',
            notes: note.trim() || undefined,
          });
          break;
        case 'voice_clone':
          await api.patch(`/voice-clones/${item.id}/review`, { status: 'rejected' });
          break;
        case 'port_request':
          await api.patch(`/phone-numbers/${item.id}/port-review`, { status: 'rejected' });
          break;
      }
      toast.success('Rejected');
      notifyHitlQueueChanged();
      await fetchQueue();
    } catch {
      toast.error('Failed to reject');
    } finally {
      setActingKey(null);
    }
  };

  const openDrawer = (item: HitlItem) => {
    setSelected(item);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="admin-data-view flex flex-col gap-4 w-full min-w-0 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[hsl(var(--foreground))] tracking-tight">HITL Queue</h2>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1 max-w-xl">
            Human-in-the-loop review for CSV uploads, script changes, voice clones, and number port requests.
            {pendingCount > 0 && (
              <span className="text-amber-400 font-medium"> {pendingCount} pending.</span>
            )}
          </p>
        </div>
        <div className="relative w-full sm:max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} />
          <input
            type="text"
            placeholder="Search queue…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[40px] bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-[10px] py-2.5 pl-10 pr-4 text-xs"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap bg-[hsl(var(--muted))] rounded-lg p-0.5 gap-0.5 w-fit">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-mono font-semibold uppercase transition-colors ${
                typeFilter === tab.id
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))] cursor-pointer">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={(e) => setPendingOnly(e.target.checked)}
            className="rounded border-[hsl(var(--border-v))]"
          />
          Pending only
        </label>
      </div>

      <div className="admin-data-panel bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-sm">
        <table className="admin-data-table w-full text-xs text-left">
          <thead className="border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Type</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Organization</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Summary</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Submitted</th>
              {canReview && (
                <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))] text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={canReview ? 6 : 5} className="px-5 py-14 text-center text-sm text-[hsl(var(--muted-foreground))]">
                  {items.length === 0
                    ? 'Queue is empty. Submissions from clients will appear here for review.'
                    : 'No items match your filters.'}
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const busy = actingKey === `${row.kind}:${row.id}`;
                return (
                  <tr
                    key={`${row.kind}-${row.id}`}
                    onClick={() => openDrawer(row)}
                    className="border-b border-[hsl(var(--border))] last:border-b-0 hover:bg-[hsl(var(--muted))]/40 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-[hsl(var(--foreground))]">
                        {HITL_KIND_META[row.kind].shortLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{row.organizationName}</td>
                    <td className="px-4 py-3.5 min-w-0 max-w-[280px]">
                      <span className="block truncate font-medium">{row.title}</span>
                      {row.subtitle && (
                        <span className="block text-[10px] text-[hsl(var(--muted-foreground))] truncate">{row.subtitle}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${row.statusClassName}`}
                      >
                        {row.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[hsl(var(--muted-foreground))]">
                      {formatNullableLocaleDate(row.createdAt)}
                    </td>
                    {canReview && (
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        {row.pending ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => approve(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/10 disabled:opacity-50"
                            >
                              <Check size={12} />
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => reject(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 text-[10px] font-semibold hover:bg-red-500/10 disabled:opacity-50"
                            >
                              <X size={12} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openDrawer(row)}
                            className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                          >
                            View
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <HitlQueueDetailDrawer
        item={selected}
        isOpen={drawerOpen}
        canReview={canReview}
        onClose={() => setDrawerOpen(false)}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  );
};

export default HitlQueueView;
