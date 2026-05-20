import React, { useCallback, useState } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import AdminDataView from './AdminDataView';
import TargetUploadDetailsDrawer, { type TargetUploadRow } from './TargetUploadDetailsDrawer';
import { UploadStatusBadge } from '@/components/shared/UploadStatusBadge';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import { isUploadPendingReview } from '@/lib/uploadStatus';
import { useAuth } from '@/context/AuthContext';

import { notifyHitlQueueChanged } from '@/lib/hitlQueue';

const AdminTargetUploadsView: React.FC = () => {
  const { isGCCAdmin, isGCCReviewer, canApproveScripts } = useAuth();
  const canReview = isGCCAdmin || isGCCReviewer || canApproveScripts;
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<TargetUploadRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const bump = useCallback(() => {
    setRefreshKey((k) => k + 1);
    notifyHitlQueueChanged();
  }, []);

  const approve = async (id: string) => {
    setActingId(id);
    try {
      await api.patch(`/target-uploads/${id}/status`, { status: 'approved' });
      toast.success('Upload approved');
      bump();
    } catch {
      toast.error('Failed to approve upload');
    } finally {
      setActingId(null);
    }
  };

  const reject = async (id: string) => {
    const note = window.prompt('Rejection reason (optional):');
    if (note === null) return;
    setActingId(id);
    try {
      await api.patch(`/target-uploads/${id}/status`, {
        status: 'rejected',
        rejection_note: note.trim() || undefined,
      });
      toast.success('Upload rejected');
      bump();
    } catch {
      toast.error('Failed to reject upload');
    } finally {
      setActingId(null);
    }
  };

  const openDrawer = (row: TargetUploadRow) => {
    setSelected(row);
    setDrawerOpen(true);
  };

  const truncateUrl = (url: string, max = 48) => {
    if (!url || url.length <= max) return url || '—';
    return `${url.slice(0, max)}…`;
  };

  return (
    <div className="relative">
      {canReview && (
        <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40 px-4 py-3 text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed max-w-[1400px] mx-auto mb-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--foreground))]">GCC review · </span>
          Approve target lists from the table with one click, or open a row to spot-check the file before approving.
          {isGCCAdmin ? ' GCC Admin has full approve/reject access.' : ''}
        </div>
      )}

      <AdminDataView
        key={refreshKey}
        title="Target List Uploads"
        endpoint="target-uploads"
        emptyMessage="No target list uploads yet. When client organizations submit CSV target lists, they appear here for HITL review."
        onRowClick={openDrawer}
        columns={[
          {
            key: 'organizations',
            label: 'Org',
            render: (val) => <span className="font-medium">{val?.name || '—'}</span>,
          },
          {
            key: 'file_url',
            label: 'File',
            render: (val: string) =>
              val ? (
                <a
                  href={val}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[hsl(var(--primary))] hover:underline font-mono text-[11px]"
                  title={val}
                >
                  {truncateUrl(val)}
                  <ExternalLink size={11} className="shrink-0" />
                </a>
              ) : (
                '—'
              ),
          },
          {
            key: 'row_count',
            label: 'Rows',
            render: (val) => <span className="font-mono">{val ?? '—'}</span>,
          },
          {
            key: 'status',
            label: 'Status',
            render: (val) => <UploadStatusBadge status={val} />,
          },
          {
            key: 'created_at',
            label: 'Date',
            render: (val, row) => formatNullableLocaleDate(val || row.uploaded_at),
          },
        ]}
        renderActions={
          canReview
            ? (row: TargetUploadRow) => {
                const pending = isUploadPendingReview(row.status);
                const busy = actingId === row.id;
                if (!pending) {
                  return (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer(row);
                      }}
                      className="px-2 py-1 text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    >
                      View
                    </button>
                  );
                }
                return (
                  <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={busy}
                      title="Approve"
                      onClick={() => approve(row.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      <Check size={12} />
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      title="Reject"
                      onClick={() => reject(row.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 text-[10px] font-semibold hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <X size={12} />
                      Reject
                    </button>
                  </div>
                );
              }
            : undefined
        }
      />

      <TargetUploadDetailsDrawer
        upload={selected}
        isOpen={drawerOpen}
        canReview={canReview}
        onClose={() => setDrawerOpen(false)}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  );
};

export default AdminTargetUploadsView;
