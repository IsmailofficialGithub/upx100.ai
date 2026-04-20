import * as callLogService from '../services/callLog.service.js'
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
  const { role, orgId } = req.user
  let logs

  if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
    logs = await callLogService.listAllLogs()
  } else {
    logs = await callLogService.listLogsByOrg(orgId)
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
  if (!['gcc_admin', 'gcc_reviewer'].includes(req.user.role) && log.organization_id !== req.user.orgId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'FORBIDDEN', message: 'Access denied' }
    })
  }

  return res.json({ data: log })
}
