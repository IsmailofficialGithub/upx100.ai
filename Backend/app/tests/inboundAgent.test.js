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
    const mockAgentData = {
      name: 'Test Agent',
      organization_id: 'org123',
      recording_disclosure_enabled: true,
    }
    axios.post.mockResolvedValue({ data: { id: 'external-vapi-id' } })

    const result = await agentService.createAgent(mockAgentData)

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/create',
      expect.objectContaining({
        name: mockAgentData.name,
        organization_id: mockAgentData.organization_id,
        recording_disclosure_message: expect.stringContaining('recorded'),
      })
    )
    expect(supabaseAdmin.from).toHaveBeenCalledWith('agents')
    expect(result.db.id).toBe('mock-uuid')
  })

  it('createAgent with agent_type outbound should call the creation webhook and insert into DB', async () => {
    const mockAgentData = {
      name: 'Outbound Agent',
      organization_id: 'org123',
      agent_type: 'outbound',
      recording_disclosure_enabled: false,
      phone_number_id: 'phone-1',
      phone_number: '+15550199',
    }
    axios.post.mockResolvedValue({ data: { id: 'external-vapi-id' } })

    const result = await agentService.createAgent(mockAgentData)

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/webhook/create_outbound_agent',
      expect.objectContaining({
        name: mockAgentData.name,
        agent_type: 'outbound',
        organization_id: mockAgentData.organization_id,
        phone_number_id: 'phone-1',
        phone_number: '+15550199',
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

  it('updateAgent for outbound should call the edit outbound webhook', async () => {
    const agentId = 'mock-uuid'
    supabaseAdmin.single.mockResolvedValue({
      data: {
        id: 'mock-uuid',
        agent_type: 'outbound',
        organization_id: 'org123',
        phone_numbers: []
      },
      error: null
    })

    axios.post.mockResolvedValue({ data: { success: true } })

    await agentService.updateAgent(agentId, { name: 'Updated Outbound' })

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/webhook/edit_outbound_agent',
      expect.objectContaining({
        agentId,
        name: 'Updated Outbound',
      })
    )
  })

  it('deleteAgent for outbound should call the delete outbound webhook', async () => {
    const agentId = 'mock-uuid'
    supabaseAdmin.single.mockResolvedValue({
      data: {
        id: 'mock-uuid',
        agent_type: 'outbound',
        organization_id: 'org123',
        phone_numbers: []
      },
      error: null
    })

    axios.post.mockResolvedValue({ data: { success: true } })

    await agentService.deleteAgent(agentId)

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/webhook/delete_outbound_agent',
      expect.objectContaining({
        agentId,
      })
    )
  })

  it('deleteAgent should soft-delete locally when webhook returns 404', async () => {
    const agentId = 'agent-123'
    axios.post.mockRejectedValue({
      response: { status: 404, data: { message: 'webhook not registered' } },
      message: 'Request failed with status code 404',
    })

    const result = await agentService.deleteAgent(agentId)

    expect(axios.post).toHaveBeenCalled()
    expect(supabaseAdmin.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'deleted' })
    )
    expect(result.success).toBe(true)
  })
})
