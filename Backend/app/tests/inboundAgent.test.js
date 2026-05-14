import * as agentService from '../services/inboundAgent.service.js'
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
    chain.select = jest.fn(() => chain)
    chain.eq = jest.fn(() => chain)
    chain.is = jest.fn(() => chain)
    chain.single = jest.fn(() =>
      Promise.resolve({
        data: {
          id: 'mock-uuid',
          vapi_id: 'vapi-test',
          organization_id: 'org123',
          phone_numbers: []
        },
        error: null
      })
    )
    return chain
  }
  return {
    supabaseAdmin: build(),
    createSupabaseForRequest: jest.fn(() => null)
  }
})

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

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/create',
      expect.objectContaining({
        name: mockAgentData.name,
        organization_id: mockAgentData.organization_id
      })
    )
    expect(supabaseAdmin.from).toHaveBeenCalledWith('agents')
    expect(result.db.id).toBe('mock-uuid')
  })

  it('deleteAgent should call the delete webhook and update DB status', async () => {
    const agentId = 'agent-123'
    axios.post.mockResolvedValue({ data: { status: 'deleted' } })

    await agentService.deleteAgent(agentId)

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/delete',
      expect.objectContaining({
        agentId,
        vapi_id: 'vapi-test',
        organization_id: 'org123'
      })
    )
    expect(supabaseAdmin.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'deleted' }))
  })
})
