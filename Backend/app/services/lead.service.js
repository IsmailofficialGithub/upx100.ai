import { supabaseAdmin } from '../config/supabase.js'

/**
 * Lead Service
 * Manages qualified leads, status updates, and CRM synchronization.
 */

export const listLeadsByOrg = async (orgId, userId = null) => {
  let query = supabaseAdmin
    .from('view_leads')
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
  return data
}

export const listAllLeads = async () => {
  const { data, error } = await supabaseAdmin
    .from('view_leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getLeadById = async (leadId) => {
  const { data: lead, error } = await supabaseAdmin
    .schema('inbound')
    .from('leads')
    .select('*, agents(*)')
    .eq('id', leadId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  if (lead?.call_log_id) {
    const { data: callLog, error: callErr } = await supabaseAdmin
      .schema('inbound')
      .from('call_logs')
      .select('*')
      .eq('id', lead.call_log_id)
      .maybeSingle()

    if (callErr) throw callErr
    if (callLog) {
      lead.call_log = callLog
      lead.call_logs = callLog
    }
  }

  return lead
}

const LEAD_INSERT_FIELDS = [
  'organization_id',
  'name',
  'email',
  'phone',
  'notes',
  'status',
  'meeting_time',
  'meeting_date',
  'meeting_timezone',
  'agent_id',
  'user_id',
]

export const createLead = async (payload) => {
  const row = {}
  for (const key of LEAD_INSERT_FIELDS) {
    if (payload[key] !== undefined) {
      row[key] = payload[key]
    }
  }

  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('leads')
    .insert(row)
    .select()
    .single()

  if (error) throw error

  const { data: viewRow, error: viewError } = await supabaseAdmin
    .from('view_leads')
    .select('*')
    .eq('id', data.id)
    .maybeSingle()

  if (viewError) throw viewError
  return viewRow || data
}

export const updateLead = async (leadId, updateData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('leads')
    .update(updateData)
    .eq('id', leadId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const syncToCRM = async (leadId) => {
  // 1. Get lead data
  const lead = await getLeadById(leadId)
  
  // 2. Determine CRM CRM (GoHighLevel, HubSpot, etc.)
  const crmType = lead.crm_type || 'gohighlevel' // Default or from organization settings

  // 3. Trigger external CRM webhook or API call (Placeholder)
  console.log(`Syncing lead ${leadId} to ${crmType}...`)
  
  // Placeholder for real axios call to CRM API
  const success = true 

  // 4. Update sync status
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('leads')
    .update({ 
      crm_sync: success ? 'synced' : 'failed' 
    })
    .eq('id', leadId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const listLeadsByOrgs = async (orgIds, userId = null) => {
  if (!orgIds || orgIds.length === 0) return []

  let query = supabaseAdmin
    .from('view_leads')
    .select('*')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}
