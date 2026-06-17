const VAPI_RECORDING_TS_RE = /-(\d{13})-/;

const MAX_STARTED_BEFORE_CREATED_MS = 24 * 60 * 60 * 1000;

export function parseVapiRecordingStartedAt(recordingUrl: unknown): string | null {
  if (typeof recordingUrl !== 'string' || !recordingUrl) return null;
  const match = recordingUrl.match(VAPI_RECORDING_TS_RE);
  if (!match) return null;
  const ms = Number(match[1]);
  if (!Number.isFinite(ms) || ms < 1e12) return null;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseIsoTimestamp(value: unknown): string | null {
  if (value == null || value === '') return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function subtractDuration(isoEnd: string, durationSec: unknown): string | null {
  const endMs = new Date(isoEnd).getTime();
  const sec = Number(durationSec);
  if (!Number.isFinite(endMs) || !Number.isFinite(sec) || sec <= 0) return null;
  return new Date(endMs - sec * 1000).toISOString();
}

function startedAtLooksPlausible(startedIso: string, createdIso: string | null): boolean {
  if (!createdIso) return true;
  const startedMs = new Date(startedIso).getTime();
  const createdMs = new Date(createdIso).getTime();
  if (startedMs > createdMs + 5 * 60 * 1000) return false;
  return createdMs - startedMs < MAX_STARTED_BEFORE_CREATED_MS;
}

/** Best-effort call start time (matches backend resolveCallStartedAt). */
export function resolveCallStartedAt(row: {
  recording_url?: string | null;
  started_at?: string | null;
  created_at?: string | null;
  ended_at?: string | null;
  duration_sec?: number | null;
}): string | null {
  const fromRecording = parseVapiRecordingStartedAt(row.recording_url);
  if (fromRecording) return fromRecording;

  const started = parseIsoTimestamp(row.started_at);
  const created = parseIsoTimestamp(row.created_at);
  const ended = parseIsoTimestamp(row.ended_at);

  if (started && startedAtLooksPlausible(started, created)) {
    return started;
  }

  const fromEnded = ended ? subtractDuration(ended, row.duration_sec) : null;
  if (fromEnded) return fromEnded;

  const fromCreated = created ? subtractDuration(created, row.duration_sec) : null;
  if (fromCreated) return fromCreated;

  return created ?? started ?? ended ?? null;
}
