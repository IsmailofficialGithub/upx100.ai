import { supabase } from '../config/supabase.js'

/**
 * Voice Clone Service
 * Manages voice cloning requests and sample metadata.
 */

export const submitCloneRequest = async (cloneData) => {
  const { data, error } = await supabase
    .from('voice_clones')
    .insert([{
      ...cloneData,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const listClonesByOrg = async (orgId) => {
  const { data, error } = await supabase
    .from('voice_clones')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllClones = async () => {
  const { data, error } = await supabase
    .from('voice_clones')
    .select('*, organizations(name), profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateCloneStatus = async (cloneId, status, reviewerId) => {
  const { data, error } = await supabase
    .from('voice_clones')
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
