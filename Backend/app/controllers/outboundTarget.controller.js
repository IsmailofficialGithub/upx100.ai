import * as outboundTargetService from '../services/outboundTarget.service.js'
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

export const getOutboundTargets = async (req, res) => {
  const { role, orgId, userId } = req.user
  let targets

  try {
    if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
      targets = await outboundTargetService.listAllOutboundTargets()
    } else if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const orgIds = assignments?.map((a) => a.client_org_id) || []
      targets = orgIds.length > 0 ? await outboundTargetService.listOutboundTargetsByOrgs(orgIds) : []
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      if (!deals?.length) {
        targets = []
      } else {
        const orgIds = [...new Set(deals.map((d) => d.client_org_id))]
        const raw = await outboundTargetService.listOutboundTargetsByOrgs(orgIds, null)
        targets = (raw || []).filter((row) => dealAllows(deals, row.organization_id, row.agent_id))
      }
    } else {
      const eff = effectiveOrgId(orgId)
      const filterUserId = role === 'client_admin' ? null : userId
      targets = await outboundTargetService.listOutboundTargetsByOrg(eff, filterUserId)
    }

    return res.json({ data: targets })
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: e.message || 'Failed to list outbound targets' },
    })
  }
}

export const getOutboundTarget = async (req, res) => {
  const { id } = req.params
  const target = await outboundTargetService.getOutboundTargetById(id)

  if (!target) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Outbound target not found' }
    })
  }

  const { role, orgId, userId } = req.user
  if (!['gcc_admin', 'gcc_reviewer'].includes(role)) {
    if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const assignedOrgIds = assignments?.map((a) => a.client_org_id) || []
      if (!assignedOrgIds.includes(target.organization_id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied - Client not assigned' }
        })
      }
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      if (!dealAllows(deals, target.organization_id, target.agent_id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
    } else {
      const eff = effectiveOrgId(orgId)
      if (target.organization_id !== eff) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
      if (
        role === 'client_sub' &&
        target.user_id &&
        target.user_id !== userId
      ) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
    }
  }

  return res.json({ data: target })
}

export const createOutboundTarget = async (req, res) => {
  try {
    const body = req.body || {}
    const { role, userId } = req.user
    const organizationId = body.organization_id

    await assertCanWriteOrg(req, organizationId)

    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    if (!phone) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'phone number is required' },
      })
    }

    const payload = {
      organization_id: organizationId,
      agent_id: body.agent_id ?? null,
      campaign_id: body.campaign_id ?? null,
      name: body.name ?? null,
      phone,
      email: body.email ?? null,
      status: body.status || 'outbound',
      user_id: role === 'client_sub' ? userId : (body.user_id ?? userId),
    }

    const initiateCall = body.initiate_call === true
    const target = await outboundTargetService.createOutboundTarget(payload, initiateCall)

    return res.status(StatusCodes.CREATED).json({
      message: 'Outbound target created successfully',
      data: target,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to create outbound target' },
    })
  }
}

export const createOutboundTargetsBulk = async (req, res) => {
  try {
    const body = req.body || {}
    const { role, userId } = req.user
    const organizationId = body.organization_id

    await assertCanWriteOrg(req, organizationId)

    const targets = body.targets
    if (!Array.isArray(targets) || targets.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'targets array is required' },
      })
    }

    const payloads = []
    for (const item of targets) {
      const phone = typeof item.phone === 'string' ? item.phone.trim() : ''
      if (!phone) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: { code: 'VALIDATION', message: 'phone is required for all targets' },
        })
      }
      payloads.push({
        organization_id: organizationId,
        agent_id: body.agent_id ?? null,
        campaign_id: body.campaign_id ?? null,
        name: item.name ?? null,
        phone,
        email: item.email ?? null,
        status: item.status || 'outbound',
        user_id: role === 'client_sub' ? userId : (item.user_id ?? userId),
      })
    }

    const createdTargets = await outboundTargetService.createOutboundTargetsBulk(payloads)

    return res.status(StatusCodes.CREATED).json({
      message: `${createdTargets.length} outbound targets imported successfully`,
      data: createdTargets,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to bulk create outbound targets' },
    })
  }
}

export const updateOutboundTarget = async (req, res) => {
  try {
    const { id } = req.params
    const target = await outboundTargetService.getOutboundTargetById(id)

    if (!target) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: { code: 'NOT_FOUND', message: 'Outbound target not found' },
      })
    }

    await assertCanWriteOrg(req, target.organization_id)

    const body = req.body || {}
    const updateData = {}

    if (body.phone !== undefined) {
      const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
      if (!phone) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: { code: 'VALIDATION', message: 'phone cannot be empty' },
        })
      }
      updateData.phone = phone
    }
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.status !== undefined) updateData.status = body.status
    if (body.agent_id !== undefined) updateData.agent_id = body.agent_id
    if (body.campaign_id !== undefined) updateData.campaign_id = body.campaign_id

    if (!Object.keys(updateData).length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'No fields to update' },
      })
    }

    const updated = await outboundTargetService.updateOutboundTarget(id, updateData)

    return res.json({
      message: 'Outbound target updated successfully',
      data: updated,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to update outbound target' },
    })
  }
}

export const deleteOutboundTarget = async (req, res) => {
  try {
    const { id } = req.params
    const target = await outboundTargetService.getOutboundTargetById(id)

    if (!target) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: { code: 'NOT_FOUND', message: 'Outbound target not found' },
      })
    }

    await assertCanWriteOrg(req, target.organization_id)

    const deleted = await outboundTargetService.deleteOutboundTarget(id)

    return res.json({
      message: 'Outbound target deleted successfully',
      data: deleted,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to delete outbound target' },
    })
  }
}
