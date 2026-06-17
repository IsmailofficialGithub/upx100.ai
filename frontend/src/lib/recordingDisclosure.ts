export const RECORDING_DISCLOSURE_MESSAGE =
  'This call may be recorded and processed by AI for quality and service purposes.';

/** Compliance matrix code (same style as TPS / CTPS / DNC). */
export const RECORDING_DISCLOSURE_COMPLIANCE_CODE = 'RCD';

export const RECORDING_DISCLOSURE_COMPLIANCE_TITLE =
  'Recording call disclosure — pre-call notice to participants (PECR / two-party states)';

export function parseRecordingDisclosureEnabled(
  value: unknown,
  fallback = true,
): boolean {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return Boolean(value);
}

export function readRecordingDisclosureEnabled(agent?: {
  recording_disclosure_enabled?: boolean;
  metadata?: { recording_disclosure_enabled?: boolean };
}): boolean {
  if (agent?.recording_disclosure_enabled !== undefined) {
    return parseRecordingDisclosureEnabled(agent.recording_disclosure_enabled, true);
  }
  if (agent?.metadata?.recording_disclosure_enabled !== undefined) {
    return parseRecordingDisclosureEnabled(agent.metadata.recording_disclosure_enabled, true);
  }
  return true;
}
