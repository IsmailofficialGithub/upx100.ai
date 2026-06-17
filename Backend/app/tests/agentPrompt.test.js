import {
  buildSystemPrompt,
  enrichAgentPayload,
  stripAgentConfigHeader,
  wrapWelcomeWithSsml,
  CONFIG_MARKER,
  SCRIPT_MARKER,
} from '../lib/agentPrompt.js'

describe('agentPrompt', () => {
  it('buildSystemPrompt prepends type and tone guidance', () => {
    const script = buildSystemPrompt({
      script: 'Ask about budget.',
      agent_type: 'sales',
      tone: 'energetic',
    })
    expect(script).toContain(CONFIG_MARKER)
    expect(script).toContain(SCRIPT_MARKER)
    expect(script).toContain('Sales')
    expect(script).toContain('Energetic')
    expect(script).toContain('Ask about budget.')
  })

  it('stripAgentConfigHeader removes auto-generated header', () => {
    const full = buildSystemPrompt({ script: 'Body only', agent_type: 'support', tone: 'calm' })
    expect(stripAgentConfigHeader(full)).toBe('Body only')
  })

  it('wrapWelcomeWithSsml applies tone pacing', () => {
    const ssml = wrapWelcomeWithSsml('Hello there', 'calm')
    expect(ssml).toContain('<speak>')
    expect(ssml).toContain('rate="slow"')
    expect(ssml).toContain('Hello there')
  })

  it('enrichAgentPayload ignores client model and sets metadata', () => {
    const prev = process.env.INBOUND_AGENT_MODEL
    process.env.INBOUND_AGENT_MODEL = 'internal-only-model'
    const out = enrichAgentPayload({
      name: 'A',
      script: 'Do the thing',
      agent_type: 'receptionist',
      tone: 'friendly',
      welcome_message: 'Hi',
      model: 'gpt-4o',
    })
    process.env.INBOUND_AGENT_MODEL = prev
    expect(out.model).toBe('internal-only-model')
    expect(out.metadata.welcome_ssml).toContain('<speak>')
    expect(out.script).toContain('Receptionist')
  })
})
