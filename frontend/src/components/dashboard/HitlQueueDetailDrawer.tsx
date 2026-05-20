import React, { useState } from 'react';
import { X, Check, ExternalLink, FileSpreadsheet, BookOpen, Mic, Phone } from 'lucide-react';
import type { HitlItem } from '@/lib/hitlQueue';
import { HITL_KIND_META } from '@/lib/hitlQueue';
import { formatNullableLocaleDate } from '@/lib/dateFormat';

type Props = {
  item: HitlItem | null;
  isOpen: boolean;
  canReview: boolean;
  onClose: () => void;
  onApprove: (item: HitlItem) => Promise<void>;
  onReject: (item: HitlItem) => Promise<void>;
};

const KIND_ICONS = {
  csv_upload: FileSpreadsheet,
  script_request: BookOpen,
  voice_clone: Mic,
  port_request: Phone,
};

const HitlQueueDetailDrawer: React.FC<Props> = ({
  item,
  isOpen,
  canReview,
  onClose,
  onApprove,
  onReject,
}) => {
  const [busy, setBusy] = useState(false);
  if (!item) return null;

  const Icon = KIND_ICONS[item.kind];
  const meta = HITL_KIND_META[item.kind];
  const raw = item.raw;

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
            <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center border border-[hsl(var(--primary))]/20 shrink-0">
              <Icon size={22} className="text-[hsl(var(--primary))]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">{meta.label}</p>
              <h2 className="text-lg font-display font-bold text-[hsl(var(--foreground))] truncate">{item.title}</h2>
              <span
                className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${item.statusClassName}`}
              >
                {item.statusLabel}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <DetailRow label="Organization" value={item.organizationName} />
          <DetailRow label="Submitted" value={formatNullableLocaleDate(item.createdAt)} />

          {item.kind === 'csv_upload' && (
            <>
              <DetailRow label="Rows" value={String(raw.row_count ?? '—')} />
              <div>
                <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">File</p>
                <a
                  href={String(raw.file_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--primary))] hover:underline break-all inline-flex items-center gap-1"
                >
                  {String(raw.file_url)}
                  <ExternalLink size={11} />
                </a>
              </div>
            </>
          )}

          {item.kind === 'script_request' && (
            <>
              <DetailRow label="Campaign" value={String(raw.campaign_type ?? '—')} />
              <div>
                <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Requested script</p>
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-[hsl(var(--foreground))] bg-[hsl(var(--muted))]/30 rounded-lg p-3 border border-[hsl(var(--border-v))]">
                  {String(raw.script_text ?? '—')}
                </p>
              </div>
            </>
          )}

          {item.kind === 'voice_clone' && (
            <>
              <DetailRow label="Voice name" value={String(raw.voice_name ?? '—')} />
              <div>
                <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Sample</p>
                <a
                  href={String(raw.sample_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--primary))] hover:underline break-all inline-flex items-center gap-1"
                >
                  {String(raw.sample_url)}
                  <ExternalLink size={11} />
                </a>
              </div>
            </>
          )}

          {item.kind === 'port_request' && (
            <>
              <DetailRow label="Number" value={String(raw.phone_number ?? '—')} />
              <DetailRow label="Line status" value={String(raw.status ?? '—')} />
              <DetailRow label="Port status" value={String(raw.port_status ?? '—')} />
            </>
          )}

          {raw.rejection_note ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-[10px] font-mono uppercase text-red-400 mb-1">Rejection note</p>
              <p className="text-xs leading-relaxed">{String(raw.rejection_note)}</p>
            </div>
          ) : null}
        </div>

        {canReview && item.pending ? (
          <div className="p-6 border-t border-[hsl(var(--border-v))] flex gap-3 bg-[hsl(var(--muted))]/10">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => onReject(item))}
              className="flex-1 px-4 py-2.5 rounded-lg border border-red-500/40 text-red-400 text-xs font-semibold hover:bg-red-500/10 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => onApprove(item))}
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

export default HitlQueueDetailDrawer;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">{label}</p>
      <p className="text-sm font-medium text-[hsl(var(--foreground))]">{value}</p>
    </div>
  );
}

