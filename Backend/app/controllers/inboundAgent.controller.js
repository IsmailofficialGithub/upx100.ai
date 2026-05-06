import * as agentService from '../services/inboundAgent.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Inbound Agents
 */

export const getAgents = async (req, res) => {
  const { role, orgId, userId } = req.user
  let agents

  if (role === 'gcc_admin') {
    agents = await agentService.listAllAgents()
  } else {
    if (!orgId || orgId === 'null') {
      return res.json({ data: [] })
    }
    
    // Org Admin sees everything in org, Sub-user only sees own
    const filterUserId = ['client_admin', 'sp_primary'].includes(role) ? null : userId
    agents = await agentService.listAgentsByOrg(orgId, filterUserId)
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
    organization_id: req.user.role === 'gcc_admin' ? req.body.organization_id : req.user.orgId,
    user_id: ['gcc_admin', 'client_admin', 'sp_primary'].includes(req.user.role) 
      ? (req.body.user_id || req.user.userId) 
      : req.user.userId
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
  const { role, orgId } = req.user

  if (role !== 'gcc_admin') {
    const existing = await agentService.getAgentById(agentId)
    if (!existing || existing.organization_id !== orgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to manage this agent' }
      })
    }
    // Organization cannot be changed by non-GCC
    delete req.body.organization_id
  }

  const result = await agentService.updateAgent(agentId, req.body)

  return res.json({
    message: 'Agent updated',
    data: result.db,
    webhookResult: result.webhook
  })
}

export const deleteAgent = async (req, res) => {
  const { agentId } = req.params
  const { role, orgId } = req.user

  if (role !== 'gcc_admin') {
    const existing = await agentService.getAgentById(agentId)
    if (!existing || existing.organization_id !== orgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this agent' }
      })
    }
  }
  
  const result = await agentService.deleteAgent(agentId)

  return res.json({
    message: 'Agent deleted',
    webhookResult: result.webhook
  })
}
