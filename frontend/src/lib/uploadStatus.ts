/** Target list upload review statuses (public.upload_status). */
export type UploadStatus = 'pending_review' | 'approved' | 'rejected' | 'processing';

export const UPLOAD_STATUS_META: Record<
  UploadStatus,
  { label: string; className: string }
> = {
  pending_review: {
    label: 'Pending review',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  processing: {
    label: 'Processing',
    className: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  },
};

export function normalizeUploadStatus(raw: unknown): UploadStatus | null {
  const s = String(raw ?? '').toLowerCase();
  if (s === 'pending_review' || s === 'pending' || s === 'submitted') return 'pending_review';
  if (s === 'approved') return 'approved';
  if (s === 'rejected') return 'rejected';
  if (s === 'processing') return 'processing';
  return null;
}

export function isUploadPendingReview(status: unknown): boolean {
  return normalizeUploadStatus(status) === 'pending_review';
}
