import * as leadService from '../services/lead.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Leads
 */

export const getLeads = async (req, res) => {
  const { role, orgId, userId } = req.user
  let leads

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    leads = await leadService.listAllLeads()
  } else {
    // Org Admin sees everything in org, Sub-user only sees own
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    const filterUserId = ['client_admin', 'sp_primary'].includes(role) ? null : userId
    leads = await leadService.listLeadsByOrg(effectiveOrgId, filterUserId)
  }

  return res.json({ data: leads })
}

export const getLead = async (req, res) => {
  const { leadId } = req.params
  const lead = await leadService.getLeadById(leadId)

  if (!lead) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Lead not found' }
    })
  }

  // Scoping
  if (!['gcc_admin', 'gcc_reviewer'].includes(req.user.role)) {
    const effectiveOrgId = (req.user.orgId && req.user.orgId !== '00000000-0000-4000-a000-000000000003') ? req.user.orgId : null
    if (lead.organization_id !== effectiveOrgId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      })
    }
  }

  return res.json({ data: lead })
}

export const updateLead = async (req, res) => {
  const { leadId } = req.params
  const updateData = req.body

  // Only Admin or Reviewer can update lead status manually (as per roadmap)
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
