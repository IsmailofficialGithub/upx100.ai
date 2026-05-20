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

  it('isAssignableToAgent allows unassigned and same-agent lines', () => {
    expect(isAssignableToAgent({ status: 'active', agent_id: null }, 'a1')).toBe(true)
    expect(isAssignableToAgent({ status: 'active', agent_id: 'a1' }, 'a1')).toBe(true)
    expect(isAssignableToAgent({ status: 'active', agent_id: 'a2' }, 'a1')).toBe(false)
    expect(isAssignableToAgent({ status: 'suspended', agent_id: null }, 'a1')).toBe(false)
  })
})
