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

  it('bindNumberToAgent should call bind webhook', async () => {
    axios.post.mockResolvedValue({ data: { status: 'bound' } })

    await phoneService.bindNumberToAgent('phone1', 'agent1')

    expect(axios.post).toHaveBeenCalledWith('http://test-base/unbind', { 
      numberId: 'phone1', 
      agentId: 'agent1' 
    })
    expect(supabaseAdmin.update).toHaveBeenCalled()
  })
})
