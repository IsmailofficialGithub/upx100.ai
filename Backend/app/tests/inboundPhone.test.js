import * as phoneService from '../services/inboundPhone.service.js'
import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

jest.mock('axios')
jest.mock('../config/supabase.js', () => {
  const build = () => {
    const chain = {}
    chain.schema = jest.fn(() => chain)
    chain.from = jest.fn(() => chain)
    chain.insert = jest.fn(() => chain)
    chain.update = jest.fn(() => chain)
    chain.delete = jest.fn(() => chain)
    chain.select = jest.fn(() => chain)
    chain.eq = jest.fn(() => chain)
    chain.neq = jest.fn(() => chain)
    chain.is = jest.fn(() => chain)
    chain.in = jest.fn(() => chain)
    chain.or = jest.fn(() => chain)
    chain.single = jest.fn(() => Promise.resolve({ data: { id: 'phone-uuid' }, error: null }))
    return chain
  }
  return {
    supabaseAdmin: build(),
    createSupabaseForRequest: jest.fn(() => null)
  }
})

describe('InboundPhone Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REACT_APP_WEBHOOK_BASE_URL = 'http://test-base'
    process.env.REACT_APP_WEBHOOK_IMPORT_NUMBER = '/import'
    process.env.REACT_APP_WEBHOOK_UNBIND = '/unbind'
  })

  it('provisionNumber should call provisioning webhook', async () => {
    const mockData = { phone_number: '+123456789', organization_id: 'org1' }
    axios.post.mockResolvedValue({ data: { status: 'provisioning' } })

    await phoneService.provisionNumber(mockData)

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/import',
      expect.objectContaining({
        organization_id: mockData.organization_id,
        phone_number: mockData.phone_number
      })
    )
    expect(supabaseAdmin.insert).toHaveBeenCalled()
  })

  it('bindNumberToAgent should unbind other lines on agent then assign', async () => {
    axios.post.mockResolvedValue({ data: { status: 'bound' } })

    supabaseAdmin.single
      .mockResolvedValueOnce({
        data: {
          id: 'phone1',
          phone_number: '+15551212',
          organization_id: 'org1',
          agent_id: null,
          status: 'active',
        },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { id: 'agent1', organization_id: 'org1', name: 'Agent', deleted_at: null },
        error: null,
      })
      .mockResolvedValueOnce({
        data: {
          id: 'phone1',
          phone_number: '+15551212',
          organization_id: 'org1',
          agent_id: 'agent1',
          status: 'active',
        },
        error: null,
      })

    await phoneService.bindNumberToAgent('phone1', 'agent1')

    expect(supabaseAdmin.update).toHaveBeenCalled()
    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/unbind',
      expect.objectContaining({
        numberId: 'phone1',
        agentId: 'agent1',
        organization_id: 'org1',
      }),
    )
  })
})
