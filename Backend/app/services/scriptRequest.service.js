import { supabaseAdmin } from '../config/supabase.js'

/**
 * Script Request Service
 * Handles client-submitted requests for script modifications and admin review.
 */

export const submitRequest = async (requestData) => {
  const { data, error } = await supabaseAdmin
    .from('script_requests')
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
    .from('script_requests')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllRequests = async () => {
  const { data, error } = await supabaseAdmin
    .from('script_requests')
    .select('*, organizations(name), profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateRequestStatus = async (requestId, status, reviewerNotes, reviewerId) => {
  const { data, error } = await supabaseAdmin
    .from('script_requests')
    .update({
      status,
      reviewer_notes: reviewerNotes,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single()

  if (error) throw error
  return data
}
