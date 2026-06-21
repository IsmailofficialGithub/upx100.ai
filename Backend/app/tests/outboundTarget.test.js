import * as outboundTargetService from '../services/outboundTarget.service.js'
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
    chain.order = jest.fn(() => chain)
    chain.single = jest.fn(() =>
      Promise.resolve({
        data: {
          id: 'target-123',
          phone: '+12345678',
          name: 'John Doe',
          email: 'john@example.com',
          status: 'outbound',
          agent_id: 'agent-456',
          organization_id: 'org123',
          user_id: 'user123'
        },
        error: null
      })
    )
    return chain
  }
  return {
    supabaseAdmin: build()
  }
})

describe('OutboundTarget Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REACT_APP_WEBHOOK_BASE_URL = 'http://test-base'
    process.env.REACT_APP_WEBHOOK_OUTBOUND_CALL = '/outbound-call'
  })

  it('createOutboundTarget should insert target into DB without calling webhook when initiateCall is false', async () => {
    const payload = {
      phone: '+12345678',
      organization_id: 'org123'
    }

    const result = await outboundTargetService.createOutboundTarget(payload, false)

    expect(supabaseAdmin.schema).toHaveBeenCalledWith('inbound')
    expect(supabaseAdmin.from).toHaveBeenCalledWith('outbound_targets')
    expect(supabaseAdmin.insert).toHaveBeenCalledWith([payload])
    expect(axios.post).not.toHaveBeenCalled()
    expect(result.id).toBe('target-123')
  })

  it('createOutboundTarget should insert target and trigger webhook when initiateCall is true and agent_id is present', async () => {
    const payload = {
      phone: '+12345678',
      organization_id: 'org123',
      agent_id: 'agent-456'
    }
    axios.post.mockResolvedValue({ data: { success: true } })

    const result = await outboundTargetService.createOutboundTarget(payload, true)

    expect(axios.post).toHaveBeenCalledWith(
      'http://test-base/outbound-call',
      expect.objectContaining({
        id: 'target-123',
        phone: '+12345678',
        agent_id: 'agent-456',
        organization_id: 'org123'
      })
    )
    expect(result.id).toBe('target-123')
  })

  it('createOutboundTarget should catch webhook errors and still return target data', async () => {
    const payload = {
      phone: '+12345678',
      organization_id: 'org123',
      agent_id: 'agent-456'
    }
    axios.post.mockRejectedValue(new Error('Webhook Timeout'))

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const result = await outboundTargetService.createOutboundTarget(payload, true)

    expect(axios.post).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[createOutboundTarget] webhook failed:',
      'Webhook Timeout'
    )
    expect(result.id).toBe('target-123')

    consoleErrorSpy.mockRestore()
  })
})
