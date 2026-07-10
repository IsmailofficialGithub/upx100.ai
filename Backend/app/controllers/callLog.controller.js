import * as callLogService from '../services/callLog.service.js'
import * as outboundTargetService from '../services/outboundTarget.service.js'
import * as userService from '../services/user.service.js'
import { createSupabaseForRequest, supabaseAdmin } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'
import { mergeCallLogDirections } from '../services/callLog.service.js'
import { enrichCallLogRow, mapVapiCallDirection } from '../utils/callLogDirection.js'
import { extractVapiCallTimestamps } from '../utils/callLogTimestamps.js'
import { callLogBelongsToOrg, effectiveCallLogOrganizationId } from '../utils/callLogOrg.js'
import { filterCallLogsByChannel, resolveChannelAccess } from '../utils/channelAccess.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const SYSTEM_ORG_SENTINEL = '00000000-0000-4000-a000-000000000003'

const effectiveOrgId = (orgId) =>
  orgId && orgId !== SYSTEM_ORG_SENTINEL ? orgId : null

const dealAllows = (deals, orgId, agentId) =>
  (deals || []).some(
    (d) => d.client_org_id === orgId && (agentId == null || d.agent_id === agentId)
  )

const fetchCallLogsWithUserClient = async (req, role, orgId, userId) => {
  const userDb = createSupabaseForRequest(req)
  if (!userDb || !['client_admin', 'client_sub'].includes(role)) {
    return null
  }
  const org = effectiveOrgId(orgId)
  if (!org) {
    return []
  }
  let q = userDb
    .from('view_call_logs')
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
  return mergeCallLogDirections(data || [])
}

export const handleVapiWebhook = async (req, res) => {
  const secret = req.headers['x-vapi-secret'] || req.headers['x-webhook-secret']

  if (secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid webhook secret' }
    })
  }

  const payload = req.body
  const isCallEnded =
    payload.type === 'call.ended' ||
    payload.type === 'end-of-call-report' ||
    payload.message?.type === 'end-of-call-report'

  if (isCallEnded) {
    const callData = payload.call ?? payload.message?.call ?? payload.message ?? payload
    const { started_at, ended_at, duration_sec } = extractVapiCallTimestamps(payload)

    const meta = callData.metadata || {}
    const logData = {
      organization_id: payload.organization_id || meta.organization_id,
      agent_id: meta.agent_id,
      vapi_call_id: callData.id,
      meeting_time: meta.meeting_time ?? meta.meetingTime ?? null,
      meeting_date: meta.meeting_date ?? meta.meetingDate ?? null,
      meeting_timezone: meta.meeting_timezone ?? meta.meetingTimezone ?? null,
      lead_name: meta.lead_name ?? meta.leadName ?? callData.customer?.name ?? null,
      lead_email: meta.lead_email ?? meta.leadEmail ?? null,
      caller_number: callData.customer?.number,
      status: callData.endedReason === 'customer-ended' ? 'success' : 'follow_up',
      duration_sec,
      recording_url: callData.recordingUrl ?? payload.recordingUrl,
      transcript: callData.transcript ?? payload.transcript,
      summary: callData.summary ?? payload.summary,
      is_lead: callData.analysis?.isLead || false,
      started_at,
      ended_at,
      called_number:
        callData.phoneNumber?.number ??
        (typeof callData.phoneNumber === 'string' ? callData.phoneNumber : null),
      call_type: mapVapiCallDirection(callData.type),
      call_direction: mapVapiCallDirection(callData.type),
    }

    const outboundTargetId =
      meta.outbound_target_id ?? meta.outboundTargetId ?? meta.target_id ?? null

    if (!logData.organization_id && logData.agent_id) {
      const { data: agentRow } = await supabaseAdmin
        .schema('inbound')
        .from('agents')
        .select('organization_id')
        .eq('id', logData.agent_id)
        .maybeSingle()
      if (agentRow?.organization_id) {
        logData.organization_id = agentRow.organization_id
      }
    }

    try {
      const created = await callLogService.createCallLog(logData)
      if (outboundTargetId && created?.id) {
        try {
          await outboundTargetService.linkCallLogToTarget(outboundTargetId, created.id)
        } catch (linkError) {
          console.error('Failed to link call log to outbound target:', linkError.message)
        }
      }
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

  try {
    if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
      const q = req.query?.organization_id
      if (q && UUID_RE.test(String(q))) {
        logs = await callLogService.listLogsByOrg(q, null)
      } else {
        logs = await callLogService.listAllLogs()
      }
      if (role === 'gcc_reviewer') {
        logs = logs.map((log) => ({ ...log, cost: '***' }))
      }
    } else if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const orgIds = assignments?.map((a) => a.client_org_id) || []
      logs = orgIds.length > 0 ? await callLogService.listLogsByOrgs(orgIds) : []
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      if (!deals?.length) {
        logs = []
      } else {
        const orgIds = [...new Set(deals.map((d) => d.client_org_id))]
        const raw = await callLogService.listLogsByOrgs(orgIds, null)
        logs = (raw || []).filter((row) =>
          dealAllows(deals, effectiveCallLogOrganizationId(row), row.agent_id),
        )
      }
    } else {
      const rlsLogs = await fetchCallLogsWithUserClient(req, role, orgId, userId)
      if (rlsLogs !== null) {
        logs = rlsLogs
      } else {
        const eff = effectiveOrgId(orgId)
        const filterUserId = role === 'client_admin' ? null : userId
        logs = await callLogService.listLogsByOrg(eff, filterUserId)
      }
    }

    const enriched = (logs || []).map(enrichCallLogRow)
    const channel = resolveChannelAccess(req.user)
    return res.json({ data: filterCallLogsByChannel(enriched, channel) })
  } catch (e) {
    if (['client_admin', 'client_sub'].includes(role)) {
      console.warn('[call-logs] user-client failed, falling back to service role path', e?.message)
      const eff = effectiveOrgId(orgId)
      const filterUserId = role === 'client_admin' ? null : userId
      const logs = await callLogService.listLogsByOrg(eff, filterUserId)
      const channel = resolveChannelAccess(req.user)
      return res.json({
        data: filterCallLogsByChannel((logs || []).map(enrichCallLogRow), channel),
      })
    }
    throw e
  }
}

export const getLog = async (req, res) => {
  const { logId } = req.params
  const log = await callLogService.getLogById(logId)

  if (!log) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: { code: 'NOT_FOUND', message: 'Log not found' }
    })
  }

  const { role, orgId, userId } = req.user

  const channel = resolveChannelAccess(req.user)
  const direction = String(log.call_type ?? log.call_direction ?? '').toLowerCase()
  if (direction.includes('outbound') && !channel.canOutbound) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'CHANNEL_FORBIDDEN', message: 'Your account does not have outbound access' },
    })
  }
  if (direction.includes('inbound') && !channel.canInbound) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { code: 'CHANNEL_FORBIDDEN', message: 'Your account does not have inbound access' },
    })
  }

  if (role === 'gcc_reviewer') {
    log.cost = '***'
  }

  if (!['gcc_admin', 'gcc_reviewer'].includes(role)) {
    if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const assignedOrgIds = assignments?.map((a) => a.client_org_id) || []

      const logOrg = effectiveCallLogOrganizationId(log)
      if (!assignedOrgIds.includes(logOrg)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied - Client not assigned' }
        })
      }
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      const logOrg = effectiveCallLogOrganizationId(log)
      if (!dealAllows(deals, logOrg, log.agent_id)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
    } else {
      const eff = effectiveOrgId(orgId)
      if (!callLogBelongsToOrg(log, eff)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
      if (role === 'client_sub' && log.user_id && log.user_id !== userId) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: { code: 'FORBIDDEN', message: 'Access denied' }
        })
      }
    }
  }

  return res.json({ data: enrichCallLogRow(log) })
}
