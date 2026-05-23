import {
  normalizeMeetingOutcome,
  MEETING_OUTCOME_KEYS,
} from '../utils/meetingOutcome.js'

describe('meetingOutcome', () => {
  it('normalizes legacy spellings', () => {
    expect(normalizeMeetingOutcome('no-show')).toBe('noShow')
    expect(normalizeMeetingOutcome('closedWon')).toBe('closedWon')
  })

  it('rejects unknown values', () => {
    expect(normalizeMeetingOutcome('invalid')).toBeNull()
  })

  it('exports all tracker keys', () => {
    expect(MEETING_OUTCOME_KEYS).toContain('qualified')
    expect(MEETING_OUTCOME_KEYS).toHaveLength(6)
  })
})
