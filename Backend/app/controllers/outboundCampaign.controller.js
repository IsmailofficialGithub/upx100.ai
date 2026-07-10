import * as outboundCampaignService from '../services/outboundCampaign.service.js'
import * as userService from '../services/user.service.js'
import { StatusCodes } from 'http-status-codes'

const SYSTEM_ORG_SENTINEL = '00000000-0000-4000-a000-000000000003'

const effectiveOrgId = (orgId) =>
  orgId && orgId !== SYSTEM_ORG_SENTINEL ? orgId : null

const dealAllows = (deals, orgId, agentId) =>
  (deals || []).some(
    (d) => d.client_org_id === orgId && (agentId == null || d.agent_id === agentId)
  )

const assertCanWriteOrg = async (req, targetOrgId) => {
  const { role, orgId, userId } = req.user
  if (!targetOrgId) {
    const err = new Error('organization_id is required')
    err.status = StatusCodes.BAD_REQUEST
    throw err
  }
  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    return
  }
  if (role === 'sp_primary') {
    const { data: assignments } = await userService.getSPClientAssignments(userId)
    const assignedOrgIds = assignments?.map((a) => a.client_org_id) || []
    if (!assignedOrgIds.includes(targetOrgId)) {
      const err = new Error('Access denied - Client not assigned')
      err.status = StatusCodes.FORBIDDEN
      throw err
    }
    return
  }
  if (role === 'sp_sub') {
    const { data: deals } = await userService.getSpSubDeals(userId)
    if (!dealAllows(deals, targetOrgId, null)) {
      const err = new Error('Access denied')
      err.status = StatusCodes.FORBIDDEN
      throw err
    }
    return
  }
  const eff = effectiveOrgId(orgId)
  if (targetOrgId !== eff) {
    const err = new Error('Access denied')
    err.status = StatusCodes.FORBIDDEN
    throw err
  }
}

const assertCanReadCampaign = async (req, campaign) => {
  const { role, orgId, userId } = req.user
  if (!campaign) {
    const err = new Error('Campaign not found')
    err.status = StatusCodes.NOT_FOUND
    throw err
  }
  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    return
  }
  if (role === 'sp_primary') {
    const { data: assignments } = await userService.getSPClientAssignments(userId)
    const assignedOrgIds = assignments?.map((a) => a.client_org_id) || []
    if (!assignedOrgIds.includes(campaign.organization_id)) {
      const err = new Error('Access denied - Client not assigned')
      err.status = StatusCodes.FORBIDDEN
      throw err
    }
    return
  }
  if (role === 'sp_sub') {
    const { data: deals } = await userService.getSpSubDeals(userId)
    if (!dealAllows(deals, campaign.organization_id, campaign.agent_id)) {
      const err = new Error('Access denied')
      err.status = StatusCodes.FORBIDDEN
      throw err
    }
    return
  }
  const eff = effectiveOrgId(orgId)
  if (campaign.organization_id !== eff) {
    const err = new Error('Access denied')
    err.status = StatusCodes.FORBIDDEN
    throw err
  }
  if (role === 'client_sub' && campaign.user_id && campaign.user_id !== userId) {
    const err = new Error('Access denied')
    err.status = StatusCodes.FORBIDDEN
    throw err
  }
}

export const getOutboundCampaigns = async (req, res) => {
  const { role, orgId, userId } = req.user
  let campaigns

  try {
    if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
      campaigns = await outboundCampaignService.listAllOutboundCampaigns()
    } else if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const orgIds = assignments?.map((a) => a.client_org_id) || []
      campaigns =
        orgIds.length > 0
          ? await outboundCampaignService.listOutboundCampaignsByOrgs(orgIds)
          : []
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      if (!deals?.length) {
        campaigns = []
      } else {
        const orgIds = [...new Set(deals.map((d) => d.client_org_id))]
        const raw = await outboundCampaignService.listOutboundCampaignsByOrgs(orgIds, null)
        campaigns = (raw || []).filter((row) =>
          dealAllows(deals, row.organization_id, row.agent_id)
        )
      }
    } else {
      const eff = effectiveOrgId(orgId)
      const filterUserId = role === 'client_admin' ? null : userId
      campaigns = await outboundCampaignService.listOutboundCampaignsByOrg(eff, filterUserId)
    }

    return res.json({ data: campaigns })
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: e.message || 'Failed to list outbound campaigns' },
    })
  }
}

export const getOutboundCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await outboundCampaignService.getOutboundCampaignById(id)
    await assertCanReadCampaign(req, campaign)
    return res.json({ data: campaign })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to get outbound campaign' },
    })
  }
}

export const createOutboundCampaign = async (req, res) => {
  try {
    const body = req.body || {}
    const { role, userId } = req.user
    const organizationId = body.organization_id

    await assertCanWriteOrg(req, organizationId)

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'Campaign name is required' },
      })
    }

    if (!body.agent_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'agent_id is required' },
      })
    }

    const targets = Array.isArray(body.targets) ? body.targets : []
    for (const item of targets) {
      const phone = typeof item.phone === 'string' ? item.phone.trim() : ''
      if (!phone) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: { code: 'VALIDATION', message: 'phone is required for all targets' },
        })
      }
      item.phone = phone
    }

    const payload = {
      name,
      organization_id: organizationId,
      agent_id: body.agent_id,
      status: body.status || 'active',
      user_id: role === 'client_sub' ? userId : (body.user_id ?? userId),
    }

    const campaign = await outboundCampaignService.createOutboundCampaign(payload, targets)

    return res.status(StatusCodes.CREATED).json({
      message: 'Outbound campaign created successfully',
      data: campaign,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to create outbound campaign' },
    })
  }
}

export const updateOutboundCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await outboundCampaignService.getOutboundCampaignById(id)

    if (!campaign) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: { code: 'NOT_FOUND', message: 'Campaign not found' },
      })
    }

    await assertCanWriteOrg(req, campaign.organization_id)

    const body = req.body || {}
    const updateData = {}

    if (body.name !== undefined) {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: { code: 'VALIDATION', message: 'Campaign name cannot be empty' },
        })
      }
      updateData.name = name
    }
    if (body.status !== undefined) updateData.status = body.status
    if (body.agent_id !== undefined) updateData.agent_id = body.agent_id

    if (!Object.keys(updateData).length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'No fields to update' },
      })
    }

    const updated = await outboundCampaignService.updateOutboundCampaign(id, updateData)

    return res.json({
      message: 'Campaign updated successfully',
      data: updated,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to update campaign' },
    })
  }
}

export const deleteOutboundCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await outboundCampaignService.getOutboundCampaignById(id)

    if (!campaign) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: { code: 'NOT_FOUND', message: 'Campaign not found' },
      })
    }

    await assertCanWriteOrg(req, campaign.organization_id)

    const deleted = await outboundCampaignService.deleteOutboundCampaign(id)

    return res.json({
      message: 'Campaign deleted successfully',
      data: deleted,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to delete campaign' },
    })
  }
}

export const initiateOutboundCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await outboundCampaignService.getOutboundCampaignById(id)

    if (!campaign) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: { code: 'NOT_FOUND', message: 'Campaign not found' },
      })
    }

    await assertCanWriteOrg(req, campaign.organization_id)

    const result = await outboundCampaignService.initiateOutboundCampaign(id)

    return res.json({
      message: 'Outbound list calls initiated',
      data: {
        campaign_id: result.campaign.id,
        target_count: result.targets.length,
      },
      webhookResult: result.webhook,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to initiate outbound list calls' },
    })
  }
}

export const addTargetsToOutboundCampaign = async (req, res) => {
  try {
    const { id } = req.params
    const campaign = await outboundCampaignService.getOutboundCampaignById(id)

    if (!campaign) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: { code: 'NOT_FOUND', message: 'Campaign not found' },
      })
    }

    await assertCanWriteOrg(req, campaign.organization_id)

    const targets = Array.isArray(req.body?.targets) ? req.body.targets : []
    if (!targets.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'targets array is required' },
      })
    }

    for (const item of targets) {
      const phone = typeof item.phone === 'string' ? item.phone.trim() : ''
      if (!phone) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: { code: 'VALIDATION', message: 'phone is required for all targets' },
        })
      }
      item.phone = phone
    }

    const updated = await outboundCampaignService.addTargetsToOutboundCampaign(id, targets)

    return res.status(StatusCodes.CREATED).json({
      message: `${targets.length} numbers added to campaign`,
      data: updated,
      added_count: targets.length,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to add targets to campaign' },
    })
  }
}
