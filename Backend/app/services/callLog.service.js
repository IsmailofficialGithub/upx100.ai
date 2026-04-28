import { supabase } from '../config/supabase.js'

/**
 * Call Log Service
 * Handles call data from VAPI webhooks and user-facing logging.
 */

export const createCallLog = async (logData) => {
  const { data, error } = await supabase
    .from('call_logs')
    .insert([logData])
    .select()
    .single()

  if (error) throw error

  // If the call is flagged as a lead, automatically create a lead record
  if (logData.is_lead) {
    await supabase.from('leads').insert({
      organization_id: logData.organization_id,
      call_log_id: data.id,
      agent_id: logData.agent_id,
      phone: logData.caller_number,
      status: 'new'
    })
  }

  return data
}

export const listLogsByOrg = async (orgId) => {
  const { data, error } = await supabase
    .schema('inbound')
    .from('call_logs')
    .select('*, agents(name)')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllLogs = async () => {
  const { data, error } = await supabase
    .schema('inbound')
    .from('call_logs')
    .select('*, agents(name), organizations(name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getLogById = async (logId) => {
  const { data, error } = await supabase
    .schema('inbound')
    .from('call_logs')
    .select('*, agents(*)')
    .eq('id', logId)
    .single()

  if (error) throw error
  return data
}
