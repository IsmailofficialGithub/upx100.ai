import * as agentService from '../services/inboundAgent.service.js'
import * as phoneService from '../services/inboundPhone.service.js'
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
  if (req.user.role !== 'gcc_admin') {
    const effectiveOrgId = (req.user.orgId && req.user.orgId !== '00000000-0000-4000-a000-000000000003') ? req.user.orgId : null
    if (agent.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      })
    }
    // Sub-users can only view their own agents
    if (!['client_admin', 'sp_primary'].includes(req.user.role) && agent.user_id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      })
    }
  }

  return res.json({ data: agent })
}

export const createAgent = async (req, res) => {
  const agentData = {
    ...req.body,
    organization_id: req.user.role === 'gcc_admin'
      ? req.body.organization_id
      : (req.user.orgId && req.user.orgId !== '00000000-0000-4000-a000-000000000003' ? req.user.orgId : null),
    user_id: ['gcc_admin', 'client_admin', 'sp_primary'].includes(req.user.role)
      ? (req.body.user_id || req.user.userId)
      : req.user.userId
  }

  const result = await agentService.createAgent(agentData)

  // Handle phone number assignment if provided
  if (req.body.phone_number_id) {
    try {
      await phoneService.bindNumberToAgent(req.body.phone_number_id, result.db.id)
    } catch (bindError) {
      console.error('[Error] Failed to bind number during agent creation:', bindError)
      // We don't fail the whole request since the agent was created successfully
    }
  }

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
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    if (!existing || existing.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to manage this agent' }
      })
    }
    // Sub-users can only manage their own agents
    if (!['client_admin', 'sp_primary'].includes(role) && existing.user_id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to manage this agent' }
      })
    }
    // Organization cannot be changed by non-GCC
    delete req.body.organization_id
  }

  const result = await agentService.updateAgent(agentId, {
    ...req.body,
    user_id: req.user.userId
  })

  // Handle phone number assignment/update if provided
  if (req.body.phone_number_id) {
    try {
      await phoneService.bindNumberToAgent(req.body.phone_number_id, agentId)
    } catch (bindError) {
      console.error('[Error] Failed to bind number during agent update:', bindError)
    }
  }

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
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    if (!existing || existing.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this agent' }
      })
    }
    // Sub-users can only delete their own agents
    if (!['client_admin', 'sp_primary'].includes(role) && existing.user_id !== req.user.userId) {
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
