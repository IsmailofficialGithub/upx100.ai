import {
  assertAgentPhoneSameOrg,
  isAssignableToAgent,
} from '../utils/phoneNumberCompliance.js'

describe('phoneNumberCompliance', () => {
  it('assertAgentPhoneSameOrg rejects cross-client assignment', () => {
    expect(() =>
      assertAgentPhoneSameOrg(
        { organization_id: 'org-a' },
        { organization_id: 'org-b' },
      ),
    ).toThrow(/same client organization/)
  })

  it('isAssignableToAgent allows unassigned and same-agent lines per type', () => {
    expect(isAssignableToAgent({ status: 'active', inbound_agent_id: null, outbound_agent_id: null }, 'a1', 'inbound')).toBe(true)
    expect(isAssignableToAgent({ status: 'active', inbound_agent_id: 'a1' }, 'a1', 'inbound')).toBe(true)
    expect(isAssignableToAgent({ status: 'active', inbound_agent_id: 'a2' }, 'a1', 'inbound')).toBe(false)
    expect(isAssignableToAgent({ status: 'active', inbound_agent_id: 'a2', outbound_agent_id: null }, 'a1', 'outbound')).toBe(true)
    expect(isAssignableToAgent({ status: 'active', outbound_agent_id: 'a2' }, 'a1', 'outbound')).toBe(false)
    expect(isAssignableToAgent({ status: 'suspended', inbound_agent_id: null }, 'a1', 'inbound')).toBe(false)
  })
})
