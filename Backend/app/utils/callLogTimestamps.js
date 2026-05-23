/** Vapi storage URLs embed a 13-digit Unix ms timestamp before the final UUID segment. */
const VAPI_RECORDING_TS_RE = /-(\d{13})-/

/** Calls logged long after they ended often have a stale shared started_at from bad imports. */
const MAX_STARTED_BEFORE_CREATED_MS = 24 * 60 * 60 * 1000

export function parseVapiRecordingStartedAt(recordingUrl) {
  if (!recordingUrl || typeof recordingUrl !== 'string') return null
  const match = recordingUrl.match(VAPI_RECORDING_TS_RE)
  if (!match) return null
  const ms = Number(match[1])
  if (!Number.isFinite(ms) || ms < 1e12) return null
  const date = new Date(ms)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function parseIsoTimestamp(value) {
  if (value == null || value === '') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function subtractDuration(isoEnd, durationSec) {
  const endMs = new Date(isoEnd).getTime()
  const sec = Number(durationSec)
  if (!Number.isFinite(endMs) || !Number.isFinite(sec) || sec <= 0) return null
  return new Date(endMs - sec * 1000).toISOString()
}

function startedAtLooksPlausible(startedIso, createdIso) {
  if (!startedIso || !createdIso) return Boolean(startedIso)
  const startedMs = new Date(startedIso).getTime()
  const createdMs = new Date(createdIso).getTime()
  if (startedMs > createdMs + 5 * 60 * 1000) return false
  return createdMs - startedMs < MAX_STARTED_BEFORE_CREATED_MS
}

/**
 * Best-effort call start time for display, search, and sorting.
 * Prefers Vapi recording URL timestamps, then plausible started_at, then derived times.
 */
export function resolveCallStartedAt(row) {
  if (!row || typeof row !== 'object') return null

  const fromRecording = parseVapiRecordingStartedAt(row.recording_url)
  if (fromRecording) return fromRecording

  const started = parseIsoTimestamp(row.started_at)
  const created = parseIsoTimestamp(row.created_at)
  const ended = parseIsoTimestamp(row.ended_at)
  const durationSec = row.duration_sec

  if (started && startedAtLooksPlausible(started, created)) {
    return started
  }

  const fromEnded = ended ? subtractDuration(ended, durationSec) : null
  if (fromEnded) return fromEnded

  const fromCreated = created ? subtractDuration(created, durationSec) : null
  if (fromCreated) return fromCreated

  return created ?? started ?? ended ?? null
}

/** Normalize Vapi webhook / call object timestamps onto log insert payloads. */
export function extractVapiCallTimestamps(source = {}) {
  const call = source.call ?? source
  const startedAt =
    parseIsoTimestamp(call.startedAt ?? call.started_at) ??
    parseIsoTimestamp(source.startedAt ?? source.started_at)

  const endedAt =
    parseIsoTimestamp(call.endedAt ?? call.ended_at) ??
    parseIsoTimestamp(source.endedAt ?? source.ended_at)

  const createdAt =
    parseIsoTimestamp(call.createdAt ?? call.created_at) ??
    parseIsoTimestamp(source.createdAt ?? source.created_at)

  const durationSec = Math.round(
    Number(call.duration ?? call.durationSeconds ?? source.duration ?? 0) || 0,
  )

  const recordingUrl = call.recordingUrl ?? call.recording_url ?? source.recordingUrl

  let resolvedStarted =
    startedAt ??
    parseVapiRecordingStartedAt(recordingUrl) ??
    (endedAt ? subtractDuration(endedAt, durationSec) : null) ??
    (createdAt ? subtractDuration(createdAt, durationSec) : null) ??
    createdAt

  return {
    started_at: resolvedStarted,
    ended_at: endedAt,
    duration_sec: durationSec,
  }
}
