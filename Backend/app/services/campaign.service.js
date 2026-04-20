import { supabase } from '../config/supabase.js'

/**
 * Campaign Service
 * Manages the running state of AI agents and logs pause/resume events.
 */

export const pauseCampaign = async (agentId, orgId, userId, reason) => {
  // 1. Update agent status
  const { data, error: agentError } = await supabase
    .from('agents')
    .update({ status: 'paused' })
    .eq('id', agentId)
    .select()
    .single()

  if (agentError) throw agentError

  // 2. Log the event
  const { error: logError } = await supabase
    .from('campaign_pause_log')
    .insert({
      agent_id: agentId,
      organization_id: orgId,
      user_id: userId,
      action: 'pause',
      reason: reason
    })

  if (logError) {
    // If the table doesn't exist yet, we'll gracefully continue or handle the error
    // In a real migration, this table would be present.
    console.warn('Logging check:', logError.message)
  }

  return data
}

export const resumeCampaign = async (agentId, orgId, userId, reason) => {
  // 1. Update agent status
  const { data, error: agentError } = await supabase
    .from('agents')
    .update({ status: 'activating' }) // or 'active'
    .eq('id', agentId)
    .select()
    .single()

  if (agentError) throw agentError

  // 2. Log the event
  await supabase
    .from('campaign_pause_log')
    .insert({
      agent_id: agentId,
      organization_id: orgId,
      user_id: userId,
      action: 'resume',
      reason: reason || 'Manual resume'
    })

  return data
}

export const getPauseHistory = async (agentId) => {
  const { data, error } = await supabase
    .from('campaign_pause_log')
    .select('*, profiles(full_name)')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
