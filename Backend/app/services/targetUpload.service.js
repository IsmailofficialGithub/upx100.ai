import { supabase } from '../config/supabase.js'

/**
 * Target Upload Service
 * Manages bulk contact list submissions for campaigns.
 */

export const submitUpload = async (uploadData) => {
  const { data, error } = await supabase
    .from('target_uploads')
    .insert([{
      ...uploadData,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const listUploadsByOrg = async (orgId) => {
  const { data, error } = await supabase
    .from('target_uploads')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllUploads = async () => {
  const { data, error } = await supabase
    .from('target_uploads')
    .select('*, organizations(name), profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateUploadStatus = async (uploadId, status, reviewerId) => {
  const { data, error } = await supabase
    .from('target_uploads')
    .update({
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', uploadId)
    .select()
    .single()

  if (error) throw error
  return data
}
