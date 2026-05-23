/** Valid meeting_outcome values stored on inbound.leads (camelCase). */
export const MEETING_OUTCOME_KEYS = [
  'qualified',
  'proposal',
  'negotiation',
  'closedWon',
  'noShow',
  'unqualified',
]

const MEETING_OUTCOME_SET = new Set(MEETING_OUTCOME_KEYS)

/** Normalize API / legacy spellings to stored camelCase keys. */
export function normalizeMeetingOutcome(raw) {
  if (raw == null || raw === '') return null
  const s = String(raw).trim()
  if (s === 'no-show' || s === 'no_show') return 'noShow'
  if (s === 'closed-won' || s === 'closed_won') return 'closedWon'
  if (MEETING_OUTCOME_SET.has(s)) return s
  return null
}

export function isValidMeetingOutcome(raw) {
  return normalizeMeetingOutcome(raw) != null
}
