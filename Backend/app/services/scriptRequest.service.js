import { supabaseAdmin } from '../config/supabase.js'

/**
 * Script Request Service
 * Handles client-submitted requests for script modifications and admin review.
 *
 * Avoid PostgREST embed `organizations!script_change_requests_organization_id_fkey` —
 * live DB often has no FK from inbound.script_change_requests to public.organizations (PGRST200).
 */
export async function enrichScriptRequestRows(rows) {
  if (!rows?.length) return rows
  const orgIds = [...new Set(rows.map((r) => r.organization_id).filter(Boolean))]
  const agentIds = [...new Set(rows.map((r) => r.agent_id).filter(Boolean))]
  const profileIds = [...new Set(rows.flatMap((r) => [r.user_id, r.reviewed_by].filter(Boolean)))]

  const orgById = {}
  if (orgIds.length) {
    const { data: orgs, error } = await supabaseAdmin.from('organizations').select('id, name').in('id', orgIds)
    if (error) throw error
    ;(orgs || []).forEach((o) => {
      orgById[o.id] = o.name
    })
  }

  const agentById = {}
  if (agentIds.length) {
    const { data: agents, error } = await supabaseAdmin
      .schema('inbound')
      .from('agents')
      .select('id, name')
      .in('id', agentIds)
    if (error) throw error
    ;(agents || []).forEach((a) => {
      agentById[a.id] = a.name
    })
  }

  const profById = {}
  if (profileIds.length) {
    const { data: profs, error } = await supabaseAdmin.from('profiles').select('id, full_name').in('id', profileIds)
    if (error) throw error
    ;(profs || []).forEach((p) => {
      profById[p.id] = p.full_name
    })
  }

  return rows.map((r) => ({
    ...r,
    organizations: r.organization_id ? { name: orgById[r.organization_id] ?? null } : null,
    agents: r.agent_id ? { name: agentById[r.agent_id] ?? null } : null,
    profiles: r.user_id ? { full_name: profById[r.user_id] ?? null } : null,
  }))
}

export const submitRequest = async (requestData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .insert([{
      ...requestData,
      status: 'pending',
      created_at: requestData.created_at || new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const listRequestsByOrg = async (orgId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllRequests = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return enrichScriptRequestRows(data || [])
}

export const updateRequestStatus = async (requestId, status, reviewerNotes, reviewerId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .update({
      status,
      rejection_note: reviewerNotes,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single()

  if (error) throw error
  return data
}
