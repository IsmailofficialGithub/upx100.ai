import * as callLogService from '../services/callLog.service.js'
import * as userService from '../services/user.service.js'
import { StatusCodes } from 'http-status-codes'

/**
 * Controller for Call Logs
 */

export const handleVapiWebhook = async (req, res) => {
  const secret = req.headers['x-vapi-secret'] || req.headers['x-webhook-secret']
  
  if (secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid webhook secret' }
    })
  }

  const payload = req.body
  // VAPI specific structure parsing (assumed based on standard payloads)
  if (payload.type === 'call.ended') {
    const callData = payload.call
    
    // Map VAPI payload to our DB schema
    const logData = {
      organization_id: payload.organization_id || callData.metadata?.organization_id, // Metadata passed from frontend during call start
      agent_id: callData.metadata?.agent_id,
      vapi_call_id: callData.id,
      caller_number: callData.customer?.number,
      status: callData.endedReason === 'customer-ended' ? 'success' : 'follow_up',
      duration_sec: Math.round(callData.duration || 0),
      recording_url: callData.recordingUrl,
      transcript: callData.transcript,
      summary: callData.summary,
      is_lead: callData.analysis?.isLead || false,
      started_at: callData.startedAt
    }

    try {
      await callLogService.createCallLog(logData)
    } catch (error) {
      console.error('Webhook processing error:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error saving log' })
    }
  }

  return res.status(StatusCodes.OK).json({ received: true })
}

export const getLogs = async (req, res) => {
  const { role, orgId, userId } = req.user
  let logs

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    logs = await callLogService.listAllLogs()
    
    // Mask cost for reviewer
    if (role === 'gcc_reviewer') {
      logs = logs.map(log => ({ ...log, cost: '***' }))
    }
  } else if (['sp_primary', 'sp_sub'].includes(role)) {
    // Fetch assignments for the Sales Partner
    const { data: assignments } = await userService.getSPClientAssignments(userId)
    const orgIds = assignments?.map(a => a.client_org_id) || []
    
    if (orgIds.length > 0) {
      // SP Sub-user might be further restricted to their own leads, but for now we follow 'assigned clients'
      logs = await callLogService.listLogsByOrgs(orgIds)
    } else {
      logs = []
    }
  } else {
    // Org Admin sees everything in org, Sub-user only sees own
    const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
    const filterUserId = (role === 'client_admin') ? null : userId
    logs = await callLogService.listLogsByOrg(effectiveOrgId, filterUserId)
  }

  return res.json({ data: logs })
}

export const getLog = async (req, res) => {
  const { logId } = req.params
  const log = await callLogService.getLogById(logId)

  if (!log) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Log not found' }
    })
  }

  // Scoping
  const { role, orgId, userId } = req.user

  if (role === 'gcc_reviewer') {
    log.cost = '***'
  }

  if (!['gcc_admin', 'gcc_reviewer'].includes(role)) {
    if (['sp_primary', 'sp_sub'].includes(role)) {
      // Check if log belongs to an assigned org
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const assignedOrgIds = assignments?.map(a => a.client_org_id) || []
      
      if (!assignedOrgIds.includes(log.organization_id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied - Client not assigned' }
        })
      }
    } else {
      // Standard Client scoping
      const effectiveOrgId = (orgId && orgId !== '00000000-0000-4000-a000-000000000003') ? orgId : null
      if (log.organization_id !== effectiveOrgId) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
      
      // If client_sub, check if it's their own call (optional refinement, but usually they see all in org if SDR)
      // For now, org level is fine as per requirements.
    }
  }

  return res.json({ data: log })
}
