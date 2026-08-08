import { supabaseAdmin } from '../config/supabase.js'

export const createEmailLog = async (logData) => {
  const { data, error } = await supabaseAdmin
    .from('email_logs')
    .insert([logData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const listEmailLogsByOrg = async (orgId) => {
  let query = supabaseAdmin
    .from('email_logs')
    .select('*')
    
  if (orgId && orgId !== 'null' && orgId !== '00000000-0000-4000-a000-000000000003') {
    query = query.eq('organization_id', orgId)
  } else {
    query = query.or('organization_id.is.null,organization_id.eq.00000000-0000-4000-a000-000000000003')
  }
  query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return data
}

export const listAllEmailLogs = async () => {
  const { data, error } = await supabaseAdmin
    .from('email_logs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listEmailLogsByOrgs = async (orgIds) => {
  if (!orgIds || orgIds.length === 0) return []
  
  const { data, error } = await supabaseAdmin
    .from('email_logs')
    .select('*')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
