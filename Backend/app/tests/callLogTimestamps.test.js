import {
  parseVapiRecordingStartedAt,
  resolveCallStartedAt,
  extractVapiCallTimestamps,
} from '../utils/callLogTimestamps.js'

describe('callLogTimestamps', () => {
  const recording =
    'https://storage.vapi.ai/019e504d-7297-7cce-9fd4-f9908751e62a-1779463961609-91d72d06-mono.wav'

  it('parses Vapi recording URL timestamp', () => {
    expect(parseVapiRecordingStartedAt(recording)).toBe('2026-05-22T15:32:41.609Z')
  })

  it('prefers recording URL over stale shared started_at', () => {
    const row = {
      recording_url: recording,
      started_at: '2026-05-08T14:03:13.115518+00:00',
      created_at: '2026-05-22T15:34:12.402798+00:00',
      duration_sec: 244.5,
    }
    expect(resolveCallStartedAt(row)).toBe('2026-05-22T15:32:41.609Z')
  })

  it('derives start from created_at minus duration when started_at is stale', () => {
    const row = {
      started_at: '2026-05-08T14:03:13.115518+00:00',
      created_at: '2026-05-22T15:34:12.402798+00:00',
      duration_sec: 244.5,
    }
    const resolved = resolveCallStartedAt(row)
    expect(resolved).toMatch(/^2026-05-22T15:30:/)
  })

  it('extracts webhook timestamps with fallbacks', () => {
    const result = extractVapiCallTimestamps({
      type: 'end-of-call-report',
      recordingUrl: recording,
      duration: 32,
      createdAt: '2026-05-22T02:37:30.297Z',
    })
    expect(result.started_at).toBe('2026-05-22T15:32:41.609Z')
    expect(result.duration_sec).toBe(32)
  })
})
