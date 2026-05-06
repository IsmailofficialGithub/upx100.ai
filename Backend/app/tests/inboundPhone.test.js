import * as phoneService from '../services/inboundPhone.service.js'
import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

jest.mock('axios')
jest.mock('../config/supabase.js', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => Promise.resolve({ data: { id: 'phone-uuid' }, error: null })),
  }
}))

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

    expect(axios.post).toHaveBeenCalledWith('http://test-base/import', mockData)
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
