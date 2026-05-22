import {
  RECORDING_DISCLOSURE_MESSAGE,
  resolveRecordingDisclosureMessage,
  parseRecordingDisclosureEnabled,
} from '../lib/recordingDisclosure.js'
import { enrichAgentPayload } from '../lib/agentPrompt.js'

describe('recordingDisclosure', () => {
  it('returns full message when enabled', () => {
    expect(resolveRecordingDisclosureMessage(true)).toBe(RECORDING_DISCLOSURE_MESSAGE)
  })

  it('returns empty string when disabled', () => {
    expect(resolveRecordingDisclosureMessage(false)).toBe('')
  })

  it('parseRecordingDisclosureEnabled coerces strings', () => {
    expect(parseRecordingDisclosureEnabled('false')).toBe(false)
    expect(parseRecordingDisclosureEnabled('true')).toBe(true)
  })
})

describe('enrichAgentPayload recording disclosure', () => {
  it('includes message in webhook fields when enabled', () => {
    const out = enrichAgentPayload({
      name: 'A',
      script: 'Hi',
      recording_disclosure_enabled: true,
    })
    expect(out.recording_disclosure_enabled).toBe(true)
    expect(out.recording_disclosure_message).toBe(RECORDING_DISCLOSURE_MESSAGE)
  })

  it('sends empty message when disabled', () => {
    const out = enrichAgentPayload({
      name: 'A',
      script: 'Hi',
      recording_disclosure_enabled: false,
    })
    expect(out.recording_disclosure_enabled).toBe(false)
    expect(out.recording_disclosure_message).toBe('')
  })
})
