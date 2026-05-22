/** Fixed AI/recording disclosure played at call start when enabled. */
export const RECORDING_DISCLOSURE_MESSAGE =
  'This call may be recorded and processed by AI for quality and service purposes.';

export function parseRecordingDisclosureEnabled(value, fallback = true) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return Boolean(value);
}

export function resolveRecordingDisclosureEnabled(agentData = {}, existing = null) {
  if (agentData.recording_disclosure_enabled !== undefined) {
    return parseRecordingDisclosureEnabled(agentData.recording_disclosure_enabled, true);
  }
  if (existing?.recording_disclosure_enabled !== undefined) {
    return parseRecordingDisclosureEnabled(existing.recording_disclosure_enabled, true);
  }
  if (existing?.metadata?.recording_disclosure_enabled !== undefined) {
    return parseRecordingDisclosureEnabled(existing.metadata.recording_disclosure_enabled, true);
  }
  return true;
}

/** Webhook + voice pipeline: full message when enabled, empty string when disabled. */
export function resolveRecordingDisclosureMessage(enabled) {
  return enabled ? RECORDING_DISCLOSURE_MESSAGE : '';
}
