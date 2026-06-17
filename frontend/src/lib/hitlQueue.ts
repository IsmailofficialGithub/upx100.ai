import type { UploadStatus } from '@/lib/uploadStatus';
import { isUploadPendingReview, normalizeUploadStatus } from '@/lib/uploadStatus';

export type HitlKind = 'csv_upload' | 'script_request' | 'voice_clone' | 'port_request';

export type HitlFilterKind = 'all' | HitlKind;

export const HITL_KIND_META: Record<
  HitlKind,
  { label: string; shortLabel: string; description: string }
> = {
  csv_upload: {
    label: 'CSV upload',
    shortLabel: 'CSV',
    description: 'Target account list uploads',
  },
  script_request: {
    label: 'Script change',
    shortLabel: 'Script',
    description: 'Campaign script change requests',
  },
  voice_clone: {
    label: 'Voice clone',
    shortLabel: 'Voice',
    description: 'Voice persona / clone submissions',
  },
  port_request: {
    label: 'Port request',
    shortLabel: 'Port',
    description: 'Phone number port-in requests',
  },
};

export type HitlItem = {
  id: string;
  kind: HitlKind;
  organizationName: string;
  title: string;
  subtitle?: string;
  status: string;
  statusLabel: string;
  statusClassName: string;
  createdAt: string | null;
  pending: boolean;
  raw: Record<string, unknown>;
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  pending_review: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  submitted: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  deployed: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  processing: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

function statusPresentation(status: string, label?: string) {
  const key = status.toLowerCase();
  return {
    status: key,
    statusLabel: label ?? key.replace(/_/g, ' '),
    statusClassName: STATUS_STYLES[key] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };
}

function orgName(row: { organizations?: { name?: string } | null }) {
  return row.organizations?.name ?? '—';
}

export function isPortPending(row: {
  port_requested?: boolean;
  port_status?: string | null;
}): boolean {
  if (!row.port_requested) return false;
  const s = String(row.port_status ?? '').toLowerCase();
  return !s || s === 'pending' || s === 'submitted' || s === 'requested';
}

export function mapUploadToHitl(row: Record<string, unknown>): HitlItem {
  const status = String(row.status ?? 'pending_review');
  const uploadKey = normalizeUploadStatus(status) as UploadStatus | null;
  const pending = isUploadPendingReview(status);
  const pres = uploadKey
    ? statusPresentation(uploadKey === 'pending_review' ? 'pending_review' : uploadKey)
    : statusPresentation(status);

  return {
    id: String(row.id),
    kind: 'csv_upload',
    organizationName: orgName(row as { organizations?: { name?: string } }),
    title: String(row.file_url ?? 'Target list').split('/').pop() || 'CSV upload',
    subtitle: row.row_count != null ? `${row.row_count} rows` : undefined,
    ...pres,
    createdAt: (row.created_at as string) ?? (row.uploaded_at as string) ?? null,
    pending,
    raw: row,
  };
}

export function mapScriptToHitl(row: Record<string, unknown>): HitlItem {
  const status = String(row.status ?? 'pending');
  const pending = status.toLowerCase() === 'pending';
  const text = String(row.script_text ?? '');
  return {
    id: String(row.id),
    kind: 'script_request',
    organizationName: orgName(row as { organizations?: { name?: string } }),
    title: text.length > 72 ? `${text.slice(0, 72)}…` : text || 'Script change',
    subtitle: row.campaign_type ? String(row.campaign_type) : undefined,
    ...statusPresentation(status, pending ? 'Pending' : status.replace(/_/g, ' ')),
    createdAt: (row.created_at as string) ?? null,
    pending,
    raw: row,
  };
}

export function mapVoiceCloneToHitl(row: Record<string, unknown>): HitlItem {
  const status = String(row.status ?? 'submitted');
  const pending = status.toLowerCase() === 'submitted';
  return {
    id: String(row.id),
    kind: 'voice_clone',
    organizationName: orgName(row as { organizations?: { name?: string } }),
    title: String(row.voice_name ?? 'Voice clone'),
    subtitle: (row.profiles as { full_name?: string })?.full_name
      ? `By ${(row.profiles as { full_name?: string }).full_name}`
      : undefined,
    ...statusPresentation(status, pending ? 'Submitted' : undefined),
    createdAt: (row.created_at as string) ?? null,
    pending,
    raw: row,
  };
}

export function mapPortToHitl(row: Record<string, unknown>): HitlItem {
  const status = String(row.port_status ?? 'submitted');
  const pending = isPortPending(row as { port_requested?: boolean; port_status?: string });
  return {
    id: String(row.id),
    kind: 'port_request',
    organizationName: orgName(row as { organizations?: { name?: string } }),
    title: String(row.phone_number ?? 'Phone number'),
    subtitle: row.label ? String(row.label) : 'Port request',
    ...statusPresentation(pending ? 'submitted' : status, pending ? 'Port pending' : undefined),
    createdAt: (row.created_at as string) ?? null,
    pending,
    raw: row,
  };
}

export function countPendingItems(items: HitlItem[]): number {
  return items.filter((i) => i.pending).length;
}

export function notifyHitlQueueChanged() {
  window.dispatchEvent(new CustomEvent('gcc-hitl-queue-changed'));
}
