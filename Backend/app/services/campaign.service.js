import { supabaseAdmin } from '../config/supabase.js'

/**
 * Campaign Service
 * Manages the running state of AI agents and logs pause/resume events.
 */

export const pauseCampaign = async (agentId, orgId, userId, reason) => {
  // 1. Update agent status
  let query = supabaseAdmin.schema('inbound').from('agents').update({ status: 'paused' })
  
  if (agentId === 'global') {
    query = query.eq('organization_id', orgId)
  } else {
    query = query.eq('id', agentId)
  }
  
  const { data, error: agentError } = await query.select()

  if (agentError) throw agentError

  // 2. Log the event
  const { error: logError } = await supabaseAdmin
    .schema('inbound')
    .from('campaign_pause_log')
    .insert({
      agent_id: agentId === 'global' ? null : agentId,
      actioned_by: userId,
      action: 'pause',
      reason: reason
    })

  if (logError) {
    console.warn('Logging check:', logError.message)
  }

  return data
}

export const resumeCampaign = async (agentId, orgId, userId, reason) => {
  // 1. Update agent status
  let query = supabaseAdmin.schema('inbound').from('agents').update({ status: 'activating' })
  
  if (agentId === 'global') {
    query = query.eq('organization_id', orgId)
  } else {
    query = query.eq('id', agentId)
  }
  
  const { data, error: agentError } = await query.select()

  if (agentError) throw agentError

  // 2. Log the event
  await supabaseAdmin
    .schema('inbound')
    .from('campaign_pause_log')
    .insert({
      agent_id: agentId === 'global' ? null : agentId,
      actioned_by: userId,
      action: 'resume',
      reason: reason || 'Manual resume'
    })

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
