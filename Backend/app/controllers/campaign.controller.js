import * as campaignService from '../services/campaign.service.js'
import * as userService from '../services/user.service.js'
import { supabaseAdmin } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'

const SYSTEM_ORG_SENTINEL = '00000000-0000-4000-a000-000000000003'

const effectiveClientOrgId = (orgId) =>
  orgId && orgId !== SYSTEM_ORG_SENTINEL ? orgId : null

const loadAgent = async (agentId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('id, organization_id')
    .eq('id', agentId)
    .is('deleted_at', null)
    .maybeSingle()
  if (error) throw error
  return data
}

const assertCanViewCampaignHistory = async (req, agentId) => {
  if (agentId === 'global') {
    return
  }
  const agent = await loadAgent(agentId)
  if (!agent) {
    const err = new Error('Agent not found')
    err.status = StatusCodes.NOT_FOUND
    throw err
  }
  const { role, orgId, userId } = req.user
  if (role === 'gcc_admin' || role === 'gcc_reviewer') {
    return
  }
  if (role === 'client_admin') {
    const eff = effectiveClientOrgId(orgId)
    if (eff && agent.organization_id === eff) return
    const err = new Error('Access denied')
    err.status = StatusCodes.FORBIDDEN
    throw err
  }
  if (role === 'sp_primary' || role === 'sp_sub') {
    let spId = userId
    if (role === 'sp_sub') {
      const { data: primary } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('organization_id', orgId)
        .eq('role', 'sp_primary')
        .single()
      if (primary) spId = primary.id
    }
    const { data: assignments } = await userService.getSPClientAssignments(spId)
    const allowed = (assignments || []).map((a) => a.client_org_id)
    if (allowed.includes(agent.organization_id)) return
    const err = new Error('Access denied')
    err.status = StatusCodes.FORBIDDEN
    throw err
  }
  const err = new Error('Access denied')
  err.status = StatusCodes.FORBIDDEN
  throw err
}

/**
 * Controller for Campaign Control
 */

export const pauseAgent = async (req, res) => {
  const { agentId } = req.params
  const { reason } = req.body
  const { orgId, userId } = req.user

  if (!reason && req.user.role !== 'gcc_admin') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: 'MISSING_REASON', message: 'A reason is required to pause a campaign' }
    })
  }

  try {
    const result = await campaignService.pauseCampaign(agentId, orgId, userId, reason || 'Admin override', {
      role: req.user.role
    })

    return res.json({
      message: 'Campaign paused successfully',
      data: result
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { code: e.code || 'CAMPAIGN_ERROR', message: e.message }
    })
  }
}

export const resumeAgent = async (req, res) => {
  const { agentId } = req.params
  const { reason } = req.body
  const { orgId, userId } = req.user

  try {
    const result = await campaignService.resumeCampaign(agentId, orgId, userId, reason, { role: req.user.role })

    return res.json({
      message: 'Campaign resume initiated',
      data: result
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { code: e.code || 'CAMPAIGN_ERROR', message: e.message }
    })
  }
}

export const getHistory = async (req, res) => {
  const { agentId } = req.params
  try {
    await assertCanViewCampaignHistory(req, agentId)
    const logs = await campaignService.getPauseHistory(agentId)

    return res.json({ data: logs })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { code: e.code || 'FORBIDDEN', message: e.message }
    })
  }
}
