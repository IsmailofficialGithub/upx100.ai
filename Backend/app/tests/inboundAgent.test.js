import * as agentService from '../services/inboundAgent.service.js'
import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

jest.mock('axios')
jest.mock('../config/supabase.js', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => Promise.resolve({ data: { id: 'mock-uuid' }, error: null })),
    is: jest.fn().mockReturnThis(),
  }
}))

describe('InboundAgent Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REACT_APP_WEBHOOK_BASE_URL = 'http://test-base'
    process.env.REACT_APP_WEBHOOK_CREATE_AGENT = '/create'
    process.env.REACT_APP_WEBHOOK_DELETE_AGENT = '/delete'
  })

  it('createAgent should call the creation webhook and insert into DB', async () => {
    const mockAgentData = { name: 'Test Agent', organization_id: 'org123' }
    axios.post.mockResolvedValue({ data: { id: 'external-vapi-id' } })

    const result = await agentService.createAgent(mockAgentData)

    expect(axios.post).toHaveBeenCalledWith('http://test-base/create', mockAgentData)
    expect(supabaseAdmin.from).toHaveBeenCalledWith('agents')
    expect(result.db.id).toBe('mock-uuid')
  })

  it('deleteAgent should call the delete webhook and update DB status', async () => {
    const agentId = 'agent-123'
    axios.delete.mockResolvedValue({ data: { status: 'deleted' } })

    await agentService.deleteAgent(agentId)

    expect(axios.delete).toHaveBeenCalledWith(
      'http://test-base/delete', 
      { data: { agentId } }
    )
    expect(supabaseAdmin.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'deleted' }))
  })
})
