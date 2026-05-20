/**
 * Normalize and enrich call direction on call log rows (Vapi → inbound | outbound).
 */

export function normalizeCallDirection(raw) {
  if (raw == null || raw === '') return 'unknown'
  const s = String(raw).toLowerCase()
  if (s === 'inbound' || s.includes('inbound')) return 'inbound'
  if (s === 'outbound' || s.includes('outbound')) return 'outbound'
  return 'unknown'
}

/** Map Vapi call.type to DB values (inbound | outbound), or null if unrecognized. */
export function mapVapiCallDirection(vapiType) {
  const direction = normalizeCallDirection(vapiType)
  return direction === 'unknown' ? null : direction
}

/** Add a consistent `direction` field for API consumers; align call_type / call_direction when known. */
export function enrichCallLogRow(row) {
  if (!row || typeof row !== 'object') return row
  const direction = normalizeCallDirection(row.call_type ?? row.call_direction ?? row.direction)
  return {
    ...row,
    direction,
    ...(direction !== 'unknown'
      ? { call_direction: direction, call_type: direction }
      : {}),
  }
}
