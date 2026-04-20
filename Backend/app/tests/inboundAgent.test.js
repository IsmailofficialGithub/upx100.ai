import * as agentService from '../services/inboundAgent.service.js'
import axios from 'axios'
import { supabase } from '../config/supabase.js'

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
    process.env.INBOUND_BOT_CREATION_WEBHOOK_URL = 'http://test-webhook'
  })

  it('createAgent should call the creation webhook and insert into DB', async () => {
    const mockAgentData = { name: 'Test Agent', organization_id: 'org123' }
    axios.post.mockResolvedValue({ data: { id: 'external-vapi-id' } })

    const result = await agentService.createAgent(mockAgentData)

    expect(axios.post).toHaveBeenCalledWith('http://test-webhook', mockAgentData)
    expect(supabase.from).toHaveBeenCalledWith('agents')
    expect(result.db.id).toBe('mock-uuid')
  })

  it('deleteAgent should call the delete webhook and update DB status', async () => {
    const agentId = 'agent-123'
    axios.delete.mockResolvedValue({ data: { status: 'deleted' } })

    await agentService.deleteAgent(agentId)

    expect(axios.delete).toHaveBeenCalledWith(
      process.env.INBOUND_DELETE_AGENT_WEBHOOK_URL, 
      { data: { agentId } }
    )
    expect(supabase.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'deleted' }))
  })
})
