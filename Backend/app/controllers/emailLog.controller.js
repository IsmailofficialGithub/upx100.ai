import * as emailLogService from '../services/emailLog.service.js'
import * as userService from '../services/user.service.js'
import { createSupabaseForRequest } from '../config/supabase.js'
import { StatusCodes } from 'http-status-codes'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const SYSTEM_ORG_SENTINEL = '00000000-0000-4000-a000-000000000003'

const effectiveOrgId = (orgId) =>
  orgId && orgId !== SYSTEM_ORG_SENTINEL ? orgId : null

const fetchEmailLogsWithUserClient = async (req, role, orgId) => {
  const userDb = createSupabaseForRequest(req)
  if (!userDb || !['client_admin', 'client_sub'].includes(role)) {
    return null
  }
  const org = effectiveOrgId(orgId)
  if (!org) {
    return []
  }
  
  let q = userDb
    .from('email_logs')
    .select('*')
    .eq('organization_id', org)
    .order('created_at', { ascending: false })

  if (req.query?.call_log_id) {
    q = q.eq('call_log_id', req.query.call_log_id)
  }

  const { data, error } = await q
  if (error) {
    throw error
  }
  return data || []
}

export const getEmailLogs = async (req, res) => {
  const { role, orgId, userId } = req.user
  let logs

  try {
    if (['gcc_admin', 'gcc_reviewer'].includes(role)) {
      const q = req.query?.organization_id
      const c = req.query?.call_log_id
      if (q && UUID_RE.test(String(q))) {
        logs = await emailLogService.listEmailLogsByOrg(q)
      } else {
        logs = await emailLogService.listAllEmailLogs()
      }
      if (c && UUID_RE.test(String(c))) {
        logs = logs.filter(l => l.call_log_id === c)
      }
    } else if (role === 'sp_primary') {
      const { data: assignments } = await userService.getSPClientAssignments(userId)
      const orgIds = assignments?.map((a) => a.client_org_id) || []
      logs = orgIds.length > 0 ? await emailLogService.listEmailLogsByOrgs(orgIds) : []
      if (req.query?.call_log_id) {
        logs = logs.filter(l => l.call_log_id === req.query.call_log_id)
      }
    } else if (role === 'sp_sub') {
      const { data: deals } = await userService.getSpSubDeals(userId)
      if (!deals?.length) {
        logs = []
      } else {
        const orgIds = [...new Set(deals.map((d) => d.client_org_id))]
        logs = await emailLogService.listEmailLogsByOrgs(orgIds)
      }
      if (req.query?.call_log_id && logs.length) {
        logs = logs.filter(l => l.call_log_id === req.query.call_log_id)
      }
    } else {
      const rlsLogs = await fetchEmailLogsWithUserClient(req, role, orgId)
      if (rlsLogs !== null) {
        logs = rlsLogs
      } else {
        const eff = effectiveOrgId(orgId)
        logs = await emailLogService.listEmailLogsByOrg(eff)
        if (req.query?.call_log_id && logs) {
          logs = logs.filter(l => l.call_log_id === req.query.call_log_id)
        }
      }
    }

    return res.json({ data: logs || [] })
  } catch (e) {
    console.error('Error fetching email logs:', e)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: 'Internal server error' } })
  }
}

export const createEmailLogFromWebhook = async (req, res) => {
  // Webhook payload from n8n (no auth required as requested)
  const { organization_id, call_log_id, recipient_email, subject, body, status } = req.body

  if (!organization_id || !recipient_email) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      error: { code: 'BAD_REQUEST', message: 'Missing organization_id or recipient_email' } 
    })
  }

  try {
    const newLog = await emailLogService.createEmailLog({
      organization_id,
      call_log_id,
      recipient_email,
      subject,
      body,
      status: status || 'sent',
    })
    return res.status(StatusCodes.CREATED).json({ data: newLog })
  } catch (error) {
    console.error('Error creating email log from webhook:', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: 'Failed to create email log' } })
  }
}
