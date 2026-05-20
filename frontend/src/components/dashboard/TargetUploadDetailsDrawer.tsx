import React, { useState } from 'react';
import { X, FileSpreadsheet, Building2, Check, ExternalLink } from 'lucide-react';
import { UploadStatusBadge } from '@/components/shared/UploadStatusBadge';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import { isUploadPendingReview } from '@/lib/uploadStatus';

export type TargetUploadRow = {
  id: string;
  file_url: string;
  row_count?: number | null;
  status: string;
  created_at?: string | null;
  uploaded_at?: string | null;
  reviewed_at?: string | null;
  rejection_note?: string | null;
  organizations?: { name?: string } | null;
  profiles?: { full_name?: string } | null;
};

type Props = {
  upload: TargetUploadRow | null;
  isOpen: boolean;
  canReview: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
};

const TargetUploadDetailsDrawer: React.FC<Props> = ({
  upload,
  isOpen,
  canReview,
  onClose,
  onApprove,
  onReject,
}) => {
  const [busy, setBusy] = useState(false);

  if (!upload) return null;

  const pending = isUploadPendingReview(upload.status);
  const submittedAt = upload.uploaded_at || upload.created_at;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-lg bg-[hsl(var(--background))] border-l border-[hsl(var(--border-v))] shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-[hsl(var(--border-v))] flex items-start justify-between gap-4 bg-[hsl(var(--muted))]/30">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20 shrink-0">
              <FileSpreadsheet size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-display font-bold text-[hsl(var(--foreground))]">Target list upload</h2>
              <div className="mt-2">
                <UploadStatusBadge status={upload.status} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg text-[hsl(var(--muted-foreground))]"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <dl className="space-y-4 text-xs">
            <div>
              <dt className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Organization</dt>
              <dd className="flex items-center gap-2 font-medium text-[hsl(var(--foreground))]">
                <Building2 size={14} className="text-[hsl(var(--muted-foreground))]" />
                {upload.organizations?.name || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Submitted by</dt>
              <dd className="text-[hsl(var(--foreground))]">{upload.profiles?.full_name || '—'}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Row count</dt>
              <dd className="font-mono text-[hsl(var(--foreground))]">{upload.row_count ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Submitted</dt>
              <dd className="text-[hsl(var(--foreground))]">{formatNullableLocaleDate(submittedAt)}</dd>
            </div>
            {upload.reviewed_at ? (
              <div>
                <dt className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Reviewed</dt>
                <dd className="text-[hsl(var(--foreground))]">{formatNullableLocaleDate(upload.reviewed_at)}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">File</dt>
              <dd>
                <a
                  href={upload.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[hsl(var(--primary))] hover:underline break-all"
                >
                  {upload.file_url}
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              </dd>
            </div>
            {upload.rejection_note ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <dt className="text-[10px] font-mono uppercase text-red-400 mb-1">Rejection note</dt>
                <dd className="text-xs text-[hsl(var(--foreground))] leading-relaxed">{upload.rejection_note}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        {canReview && pending ? (
          <div className="p-6 border-t border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/10 flex gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => onReject(upload.id))}
              className="flex-1 px-4 py-2.5 rounded-lg border border-red-500/40 text-red-400 text-xs font-semibold hover:bg-red-500/10 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => onApprove(upload.id))}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50"
            >
              <Check size={14} />
              Approve
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default TargetUploadDetailsDrawer;
