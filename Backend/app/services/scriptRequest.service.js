import { supabaseAdmin } from '../config/supabase.js'

/**
 * Script Request Service
 * Handles client-submitted requests for script modifications and admin review.
 */

export const submitRequest = async (requestData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .insert([{
      ...requestData,
      status: 'pending'
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
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllRequests = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('script_change_requests')
    .select('*, organizations!script_change_requests_organization_id_fkey(name), profiles:submitted_by(full_name)')
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data
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
