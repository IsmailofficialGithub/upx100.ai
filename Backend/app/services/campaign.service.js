import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const isValidUuid = (value) => typeof value === 'string' && UUID_RE.test(value)

const fetchAgentRow = async (agentId) => {
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

/**
 * Ensure caller may pause/resume this agent (non-global).
 */
const assertAgentInCallerScope = (agent, orgId, role) => {
  if (!agent) {
    const err = new Error('Agent not found')
    err.status = StatusCodes.NOT_FOUND
    err.code = 'NOT_FOUND'
    throw err
  }
  if (role === 'gcc_admin') {
    return
  }
  if (role === 'client_admin') {
    const scopedOrgId = isValidUuid(orgId) ? orgId : null
    if (scopedOrgId && agent.organization_id === scopedOrgId) {
      return
    }
  }
  const err = new Error('You do not have permission to modify this campaign')
  err.status = StatusCodes.FORBIDDEN
  err.code = 'FORBIDDEN'
  throw err
}

/**
 * Campaign Service
 * Manages the running state of AI agents and logs pause/resume events.
 */

export const pauseCampaign = async (agentId, orgId, userId, reason, { role } = {}) => {
  const scopedOrgId = isValidUuid(orgId) ? orgId : null

  // 1. Update agent status
  let query = supabaseAdmin.schema('inbound').from('agents').update({ status: 'paused' })

  if (agentId === 'global') {
    if (scopedOrgId) {
      query = query.eq('organization_id', scopedOrgId)
    } else if (role === 'gcc_admin') {
      // PostgREST rejects UPDATE with no WHERE. We cannot use .eq('organization_id', null) (invalid uuid).
      // Scope to active rows only — same notion of "current" agents as fetchAgentRow.
      query = query.is('deleted_at', null)
    } else {
      const err = new Error('Organization context is required to pause all campaigns for your organization.')
      err.status = StatusCodes.BAD_REQUEST
      err.code = 'MISSING_ORGANIZATION'
      throw err
    }
  } else {
    const agent = await fetchAgentRow(agentId)
    assertAgentInCallerScope(agent, orgId, role)
    query = query.eq('id', agentId)
    if (role === 'client_admin') {
      query = query.eq('organization_id', agent.organization_id)
    }
  }
  
  const { data, error: agentError } = await query.select()

  if (agentError) throw agentError

  // 2. Log the event (campaign_pause_log.organization_id is NOT NULL)
  if (scopedOrgId) {
    const { error: logError } = await supabaseAdmin
      .schema('public')
      .from('campaign_pause_log')
      .insert({
        agent_id: agentId === 'global' ? null : agentId,
        organization_id: scopedOrgId,
        user_id: userId,
        action: 'pause',
        reason: reason
      })

    if (logError) {
      console.warn('Logging check:', logError.message)
    }
  } else if (agentId === 'global' && role === 'gcc_admin') {
    console.warn('[campaign] Global pause by gcc_admin with no organization_id — agents updated, pause log skipped.')
  }

  return data
}

export const resumeCampaign = async (agentId, orgId, userId, reason, { role } = {}) => {
  const scopedOrgId = isValidUuid(orgId) ? orgId : null

  // 1. Update agent status
  let query = supabaseAdmin.schema('inbound').from('agents').update({ status: 'activating' })

  if (agentId === 'global') {
    if (scopedOrgId) {
      query = query.eq('organization_id', scopedOrgId)
    } else if (role === 'gcc_admin') {
      query = query.is('deleted_at', null)
    } else {
      const err = new Error('Organization context is required to resume all campaigns for your organization.')
      err.status = StatusCodes.BAD_REQUEST
      err.code = 'MISSING_ORGANIZATION'
      throw err
    }
  } else {
    const agent = await fetchAgentRow(agentId)
    assertAgentInCallerScope(agent, orgId, role)
    query = query.eq('id', agentId)
    if (role === 'client_admin') {
      query = query.eq('organization_id', agent.organization_id)
    }
  }
  
  const { data, error: agentError } = await query.select()

  if (agentError) throw agentError

  // 2. Log the event
  if (scopedOrgId) {
    await supabaseAdmin
      .schema('public')
      .from('campaign_pause_log')
      .insert({
        agent_id: agentId === 'global' ? null : agentId,
        organization_id: scopedOrgId,
        user_id: userId,
        action: 'resume',
        reason: reason || 'Manual resume'
      })
  } else if (agentId === 'global' && role === 'gcc_admin') {
    console.warn('[campaign] Global resume by gcc_admin with no organization_id — agents updated, resume log skipped.')
  }

  return data
}

export const getPauseHistory = async (agentId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('campaign_pause_log')
    .select('*, profiles:actioned_by(full_name)')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
