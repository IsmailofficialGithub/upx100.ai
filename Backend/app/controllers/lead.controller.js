import * as leadService from '../services/lead.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Leads
 */

export const getLeads = async (req, res) => {
  const { role, orgId } = req.user
  let leads

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    leads = await leadService.listAllLeads()
  } else {
    leads = await leadService.listLogsByOrg(orgId)
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
  if (!['gcc_admin', 'gcc_reviewer'].includes(req.user.role) && lead.organization_id !== req.user.orgId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'Access denied' }
    })
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
