import {
  callLogBelongsToOrg,
  effectiveCallLogOrganizationId,
} from '../utils/callLogOrg.js'

describe('callLogOrg', () => {
  it('uses organization_id on the call when set', () => {
    expect(effectiveCallLogOrganizationId({ organization_id: 'org-a' })).toBe('org-a')
  })

  it('falls back to agent organization when call org is null', () => {
    expect(
      effectiveCallLogOrganizationId({
        organization_id: null,
        agent_id: 'agent-1',
        agents: { organization_id: 'org-b', name: 'Bot' },
      }),
    ).toBe('org-b')
  })

  it('callLogBelongsToOrg matches resolved org', () => {
    expect(
      callLogBelongsToOrg(
        { organization_id: null, agents: { organization_id: 'org-b' } },
        'org-b',
      ),
    ).toBe(true)
    expect(
      callLogBelongsToOrg(
        { organization_id: null, agents: { organization_id: 'org-b' } },
        'org-other',
      ),
    ).toBe(false)
  })
})
