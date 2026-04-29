import { supabaseAdmin } from '../config/supabase.js'

/**
 * Lead Service
 * Manages qualified leads, status updates, and CRM synchronization.
 */

export const listLeadsByOrg = async (orgId) => {
  const { data, error } = await supabaseAdmin
    .from('view_leads')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

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
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('leads')
    .select('*, call_logs(*), agents(*)')
    .eq('id', leadId)
    .single()

  if (error) throw error
  return data
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
