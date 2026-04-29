import * as agentService from '../services/inboundAgent.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Inbound Agents
 */

export const getAgents = async (req, res) => {
  const { role, orgId } = req.user
  let agents

  if (role === 'gcc_admin') {
    agents = await agentService.listAllAgents()
  } else {
    agents = await agentService.listAgentsByOrg(orgId)
  }

  return res.json({ data: agents })
}

export const getAgent = async (req, res) => {
  const { agentId } = req.params
  const agent = await agentService.getAgentById(agentId)

  if (!agent) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Agent not found' }
    })
  }

  // Org isolation check
  if (req.user.role !== 'gcc_admin' && agent.organization_id !== req.user.orgId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'Access denied' }
    })
  }

  return res.json({ data: agent })
}

export const createAgent = async (req, res) => {
  const agentData = {
    ...req.body,
    organization_id: req.user.role === 'gcc_admin' ? req.body.organization_id : req.user.orgId
  }

  const result = await agentService.createAgent(agentData)
  
  return res.status(StatusCodes.CREATED).json({
    message: 'Agent created and activating',
    data: result.db,
    webhookResult: result.webhook
  })
}

export const updateAgent = async (req, res) => {
  const { agentId } = req.params
  const updateData = req.body

  const result = await agentService.updateAgent(agentId, updateData)

  return res.json({
    message: 'Agent updated',
    data: result.db,
    webhookResult: result.webhook
  })
}

export const deleteAgent = async (req, res) => {
  const { agentId } = req.params
  
  const result = await agentService.deleteAgent(agentId)

  return res.json({
    message: 'Agent deleted',
    webhookResult: result.webhook
  })
}
