import { supabaseAdmin } from '../config/supabase.js'

/**
 * Voice Clone Service
 * Manages voice cloning requests and sample metadata.
 */

export const submitCloneRequest = async (cloneData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .insert([{
      ...cloneData,
      status: 'submitted'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const listClonesByOrg = async (orgId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .select('*')
    .eq('organization_id', orgId)
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllClones = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .select('*, organizations!voice_clone_submissions_organization_id_fkey(name), profiles:submitted_by(full_name)')
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateCloneStatus = async (cloneId, status, reviewerId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .update({
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', cloneId)
    .select()
    .single()

  if (error) throw error
  return data
}
