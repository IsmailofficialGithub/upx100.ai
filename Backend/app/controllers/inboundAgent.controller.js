import * as agentService from '../services/inboundAgent.service.js'
import * as phoneService from '../services/inboundPhone.service.js'
import * as adminService from '../services/admin.service.js'
import { resolveScopedTargetOrgIds } from './admin.controller.js'
import { StatusCodes } from 'http-status-codes'
import { parseRecordingDisclosureEnabled } from '../lib/recordingDisclosure.js'

/** Never expose vendor model ids or internal telephony ids to GCC/client UI. */
const stripInternalAgentFields = (rows) =>
  (rows || []).map(({ vapi_id: _v, model: _m, ...row }) => row)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Controller for Inbound Agents
 */

export const getAgents = async (req, res) => {
  const { role, orgId, userId } = req.user

  if (role === 'gcc_admin' || role === 'gcc_reviewer') {
    const targetOrgIds = await resolveScopedTargetOrgIds(req)
    if (targetOrgIds && targetOrgIds.length === 0) {
      return res.json({ data: [] })
    }
    const { data, error } = await adminService.getAllAgents(targetOrgIds)
    if (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
    return res.json({ data: stripInternalAgentFields(data) })
  }

  // Org Admin sees everything in org, Sub-user only sees own
  const filterUserId = ['client_admin', 'sp_primary'].includes(role) ? null : userId
  const agents = await agentService.listAgentsByOrg(orgId, filterUserId)
  return res.json({ data: stripInternalAgentFields(agents) })
}

export const getAgent = async (req, res) => {
  const { agentId } = req.params
  const agent = await agentService.getAgentById(agentId)

  if (!agent) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Agent not found' }
    })
  }

  const isGccElevated = req.user.role === 'gcc_admin' || req.user.role === 'gcc_reviewer'

  if (isGccElevated) {
    const targetOrgIds = await resolveScopedTargetOrgIds(req)
    if (
      targetOrgIds?.length &&
      agent.organization_id &&
      !targetOrgIds.includes(agent.organization_id)
    ) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      })
    }
  } else {
    const effectiveOrgId = (req.user.orgId && req.user.orgId !== '00000000-0000-4000-a000-000000000003') ? req.user.orgId : null
    if (agent.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      })
    }
    if (!['client_admin', 'sp_primary'].includes(req.user.role) && agent.user_id !== req.user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      })
    }
  }

  return res.json({ data: stripInternalAgentFields([agent])[0] })
}

export const createAgent = async (req, res) => {
  if (req.user.role !== 'gcc_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC Admin can create agents. This is a managed service.' }
    })
  }

  const orgId = req.body.organization_id
  if (!orgId || !UUID_RE.test(String(orgId))) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { message: 'A valid client organization_id is required.' }
    })
  }

  const industryVertical = String(req.body.industry_vertical || '').trim()
  if (!industryVertical) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { message: 'industry_vertical is required.' }
    })
  }

  if (req.body.recording_disclosure_enabled === undefined) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { message: 'recording_disclosure_enabled is required (true or false).' },
    })
  }

  const agentData = {
    ...req.body,
    organization_id: orgId,
    industry_vertical: industryVertical,
    recording_disclosure_enabled: parseRecordingDisclosureEnabled(req.body.recording_disclosure_enabled, true),
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
  const { role } = req.user

  if (role !== 'gcc_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC Admin can update agents.' }
    })
  }

  const updateBody = { ...req.body, user_id: req.user.userId }
  if (req.body.recording_disclosure_enabled !== undefined) {
    updateBody.recording_disclosure_enabled = parseRecordingDisclosureEnabled(
      req.body.recording_disclosure_enabled,
      true,
    )
  }

  const result = await agentService.updateAgent(agentId, updateBody)

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
  const { role } = req.user

  if (role !== 'gcc_admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Only GCC Admin can delete agents.' }
    })
  }

  const result = await agentService.deleteAgent(agentId)

  return res.json({
    message: 'Agent deleted',
    webhookResult: result.webhook
  })
}
