/** Operational line status shown in UI (provider is internal only). */
export type PhoneLineStatus = 'active' | 'porting' | 'suspended';

const PORTING_STATUSES = new Set([
  'porting',
  'pending',
  'submitted',
  'in_progress',
  'processing',
]);

const SUSPENDED_STATUSES = new Set(['suspended', 'inactive', 'disabled', 'revoked']);

const ACTIVE_STATUSES = new Set(['active', 'live', 'ready', 'online']);

export function resolvePhoneLineStatus(row: {
  status?: string | null;
  port_requested?: boolean | null;
  port_status?: string | null;
}): PhoneLineStatus {
  const raw = String(row.status ?? '').toLowerCase();
  if (row.port_requested || PORTING_STATUSES.has(raw)) return 'porting';
  if (SUSPENDED_STATUSES.has(raw)) return 'suspended';
  if (ACTIVE_STATUSES.has(raw)) return 'active';
  if (raw === 'porting') return 'porting';
  return 'active';
}

export function phoneLineStatusLabel(status: PhoneLineStatus): string {
  switch (status) {
    case 'porting':
      return 'Porting';
    case 'suspended':
      return 'Suspended';
    default:
      return 'Active';
  }
}

export function phoneLineStatusClass(status: PhoneLineStatus): string {
  switch (status) {
    case 'porting':
      return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
    case 'suspended':
      return 'bg-red-500/10 text-red-500 border border-red-500/20';
    default:
      return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
  }
}
