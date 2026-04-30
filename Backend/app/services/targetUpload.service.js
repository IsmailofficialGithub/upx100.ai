import { supabaseAdmin } from '../config/supabase.js'

/**
 * Target Upload Service
 * Manages bulk contact list submissions for campaigns.
 */

export const submitUpload = async (uploadData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .insert([{
      ...uploadData,
      status: 'pending_review'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const listUploadsByOrg = async (orgId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .select('*')
    .eq('organization_id', orgId)
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllUploads = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .select('*, organizations!target_account_uploads_organization_id_fkey(name), profiles:uploaded_by(full_name)')
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateUploadStatus = async (uploadId, status, reviewerId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
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
