import * as outboundCampaignService from '../services/outboundCampaign.service.js'
import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

jest.mock('axios')
jest.mock('../config/supabase.js', () => {
  const build = () => {
    const chain = {}
    chain.schema = jest.fn(() => chain)
    chain.from = jest.fn(() => chain)
    chain.select = jest.fn(() => chain)
    chain.eq = jest.fn(() => chain)
    chain.in = jest.fn(() => chain)
    chain.update = jest.fn(() => chain)
    chain.in = jest.fn(() => Promise.resolve({ data: [{ id: 'org-1', name: 'Acme' }], error: null }))
    chain.single = jest.fn(() => Promise.resolve({ data: campaignFixture, error: null }))
    return chain
  }
  return { supabaseAdmin: build() }
})

const campaignFixture = {
  id: 'campaign-1',
  name: 'Q1 List',
  organization_id: 'org-1',
  agent_id: 'agent-1',
  agents: { id: 'agent-1', name: 'Outbound Bot' },
  outbound_targets: [
    { id: 't1', phone: '+15550101', name: 'Alice', email: null, status: 'outbound' },
    { id: 't2', phone: '+15550102', name: 'Bob', email: null, status: 'outbound' },
  ],
}

describe('OutboundCampaign Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REACT_APP_WEBHOOK_BASE_URL = 'http://test-base'
    process.env.REACT_APP_WEBHOOK_OUTBOUND_LIST_INITIATE = '/webhook/outbound_list_initiate'

    supabaseAdmin.single.mockResolvedValue({ data: campaignFixture, error: null })
  })

  it('initiateOutboundCampaign should call list initiate webhook with campaign targets', async () => {
    axios.post.mockResolvedValue({ data: { ok: true } })

    const result = await outboundCampaignService.initiateOutboundCampaign('campaign-1')

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/webhook/outbound_list_initiate',
      expect.objectContaining({
        campaign_id: 'campaign-1',
        campaign_name: 'Q1 List',
        organization_id: 'org-1',
        agent_id: 'agent-1',
        target_count: 2,
        targets: expect.arrayContaining([
          expect.objectContaining({ id: 't1', phone: '+15550101' }),
          expect.objectContaining({ id: 't2', phone: '+15550102' }),
        ]),
      }),
    )
    expect(supabaseAdmin.update).toHaveBeenCalled()
    expect(result.targets).toHaveLength(2)
  })

  it('addTargetsToOutboundCampaign should insert targets linked to campaign', async () => {
    const insertMock = jest.fn(() => Promise.resolve({ error: null }))
    supabaseAdmin.from.mockImplementation(() => {
      const chain = {
        schema: () => chain,
        from: () => chain,
        select: () => chain,
        eq: () => chain,
        in: () => Promise.resolve({ data: [{ id: 'org-1', name: 'Acme' }], error: null }),
        insert: insertMock,
        single: () => Promise.resolve({ data: campaignFixture, error: null }),
      }
      return chain
    })

    const targets = [{ phone: '+15550103', name: 'Carol', email: null, status: 'outbound' }]
    await outboundCampaignService.addTargetsToOutboundCampaign('campaign-1', targets)

    expect(insertMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          campaign_id: 'campaign-1',
          organization_id: 'org-1',
          agent_id: 'agent-1',
          phone: '+15550103',
          name: 'Carol',
        }),
      ]),
    )
  })
})
