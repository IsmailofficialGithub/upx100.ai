import { supabaseAdmin } from '../config/supabase.js'

/**
 * Call Log Service
 * Handles call data from VAPI webhooks and user-facing logging.
 */

/** view_call_logs may omit call_type/call_direction until migration 20 is applied. */
export async function mergeCallLogDirections(rows) {
  if (!rows?.length) return rows ?? []
  const sample = rows[0]
  if (Object.prototype.hasOwnProperty.call(sample, 'call_type')
    || Object.prototype.hasOwnProperty.call(sample, 'call_direction')) {
    return rows
  }

  const ids = rows.map((r) => r.id).filter(Boolean)
  if (!ids.length) return rows

  const { data: dirs, error } = await supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .select('id, call_type, call_direction')
    .in('id', ids)

  if (error || !dirs?.length) return rows

  const byId = new Map(dirs.map((d) => [d.id, d]))
  return rows.map((row) => {
    const d = byId.get(row.id)
    if (!d) return row
    return { ...row, call_type: d.call_type, call_direction: d.call_direction }
  })
}

export const createCallLog = async (logData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .insert([logData])
    .select()
    .single()

  if (error) throw error

  // If the call is flagged as a lead, automatically create a lead record
  if (logData.is_lead) {
    await supabaseAdmin
      .schema('inbound')
      .from('leads')
      .insert({
      organization_id: logData.organization_id,
      user_id: logData.user_id,
      call_log_id: data.id,
      agent_id: logData.agent_id,
      phone: logData.caller_number,
      status: 'new'
    })
  }

  return data
}

export const listLogsByOrg = async (orgId, userId = null) => {
  let query = supabaseAdmin
    .from('view_call_logs')
    .select('*')
  if (orgId && orgId !== 'null' && orgId !== '00000000-0000-4000-a000-000000000003') {
    query = query.eq('organization_id', orgId)
  } else {
    query = query.or('organization_id.is.null,organization_id.eq.00000000-0000-4000-a000-000000000003')
  }
  query = query.order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) throw error
  return mergeCallLogDirections(data)
}

export const listAllLogs = async () => {
  const { data, error } = await supabaseAdmin
    .from('view_call_logs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return mergeCallLogDirections(data)
}

export const getLogById = async (logId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .select('*, agents(*)')
    .eq('id', logId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data
}

export const listLogsByOrgs = async (orgIds, userId = null) => {
  if (!orgIds || orgIds.length === 0) return []
  
  let query = supabaseAdmin
    .from('view_call_logs')
    .select('*')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return mergeCallLogDirections(data)
}
