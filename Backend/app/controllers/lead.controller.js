import * as leadService from '../services/lead.service.js'
import * as userService from '../services/user.service.js'
import { createSupabaseForRequest } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'

const SYSTEM_ORG_SENTINEL = '00000000-0000-4000-a000-000000000003'

const effectiveOrgId = (orgId) =>
  orgId && orgId !== SYSTEM_ORG_SENTINEL ? orgId : null

const dealAllows = (deals, orgId, agentId) =>
  (deals || []).some(
    (d) => d.client_org_id === orgId && (agentId == null || d.agent_id === agentId)
  )

const VALID_LEAD_STATUSES = new Set(['new', 'warm', 'cold', 'success', 'follow_up'])

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

/**
 * Leads for client roles using user JWT + anon key (RLS enforced in DB when migration 12 applied).
 */
const fetchLeadsWithUserClient = async (req, role, orgId, userId) => {
  const userDb = createSupabaseForRequest(req)
  if (!userDb || !['client_admin', 'client_sub'].includes(role)) {
    return null
  }
  const org = effectiveOrgId(orgId)
  if (!org) {
    return []
  }
  let q = userDb
    .schema('inbound')
    .from('leads')
    .select('*')
    .eq('organization_id', org)
    .order('created_at', { ascending: false })
  if (role === 'client_sub') {
    q = q.or(`user_id.eq.${userId},user_id.is.null`)
  }
  const { data, error } = await q
  if (error) {
    throw error
  }
  return data || []
}

export const getLeads = async (req, res) => {
  const { role, orgId, userId } = req.user
  let leads

  try {
    if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
      leads = await leadService.listAllLeads()
    } else if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const orgIds = assignments?.map((a) => a.client_org_id) || []
      leads = orgIds.length > 0 ? await leadService.listLeadsByOrgs(orgIds) : []
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      if (!deals?.length) {
        leads = []
      } else {
        const orgIds = [...new Set(deals.map((d) => d.client_org_id))]
        const raw = await leadService.listLeadsByOrgs(orgIds, null)
        leads = (raw || []).filter((row) => dealAllows(deals, row.organization_id, row.agent_id))
      }
    } else {
      const rlsLeads = await fetchLeadsWithUserClient(req, role, orgId, userId)
      if (rlsLeads !== null) {
        leads = rlsLeads
      } else {
        const eff = effectiveOrgId(orgId)
        const filterUserId = role === 'client_admin' ? null : userId
        leads = await leadService.listLeadsByOrg(eff, filterUserId)
      }
    }

    return res.json({ data: leads })
  } catch (e) {
    if (['client_admin', 'client_sub'].includes(role)) {
      console.warn('[leads] user-client failed, falling back to service role path', e?.message)
      const eff = effectiveOrgId(orgId)
      const filterUserId = role === 'client_admin' ? null : userId
      const leads = await leadService.listLeadsByOrg(eff, filterUserId)
      return res.json({ data: leads })
    }
    throw e
  }
}

export const getLead = async (req, res) => {
  const { leadId } = req.params
  const lead = await leadService.getLeadById(leadId)

  if (!lead) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Lead not found' }
    })
  }

  const { role, orgId, userId } = req.user
  if (!['gcc_admin', 'gcc_reviewer'].includes(role)) {
    if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const assignedOrgIds = assignments?.map((a) => a.client_org_id) || []
      if (!assignedOrgIds.includes(lead.organization_id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied - Client not assigned' }
        })
      }
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      if (!dealAllows(deals, lead.organization_id, lead.agent_id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
    } else {
      const eff = effectiveOrgId(orgId)
      if (lead.organization_id !== eff) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
      if (
        role === 'client_sub' &&
        lead.user_id &&
        lead.user_id !== userId
      ) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
    }
  }

  return res.json({ data: lead })
}

export const createLead = async (req, res) => {
  try {
    const body = req.body || {}
    const { role, userId } = req.user
    const organizationId = body.organization_id

    await assertCanWriteOrg(req, organizationId)

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'name is required' },
      })
    }

    if (!body.meeting_time && !body.meeting_date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'meeting_time or meeting_date is required' },
      })
    }

    const status = body.status || 'follow_up'
    if (!VALID_LEAD_STATUSES.has(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: { code: 'VALIDATION', message: 'Invalid lead status' },
      })
    }

    const payload = {
      organization_id: organizationId,
      name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      notes: body.notes ?? null,
      status,
      meeting_time: body.meeting_time ?? null,
      meeting_date: body.meeting_date ?? null,
      meeting_timezone: body.meeting_timezone ?? null,
      agent_id: body.agent_id ?? null,
    }

    if (role === 'client_sub') {
      payload.user_id = userId
    }

    const lead = await leadService.createLead(payload)

    return res.status(StatusCodes.CREATED).json({
      message: 'Lead created successfully',
      data: lead,
    })
  } catch (e) {
    const status = e.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(status).json({
      error: { message: e.message || 'Failed to create lead' },
    })
  }
}

export const updateLead = async (req, res) => {
  const { leadId } = req.params
  const updateData = req.body

  const result = await leadService.updateLead(leadId, updateData)

  return res.json({
    message: 'Lead updated successfully',
    data: result
  })
}

export const syncCRM = async (req, res) => {
  const { leadId } = req.params

  const result = await leadService.syncToCRM(leadId)

  return res.json({
    message: 'CRM synchronization triggered',
    data: result
  })
}
