import { supabaseAdmin } from '../config/supabase.js'

/**
 * Target Upload Service
 * Manages bulk contact list submissions for campaigns.
 *
 * Note: Avoid PostgREST embeds like `profiles:user_id(...)` — they fail (PGRST200)
 * when the relationship hint does not match the FK name. We batch-load profiles instead.
 */
async function enrichUploadRowsWithProfiles(rows) {
  if (!rows?.length) return rows
  const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))]
  if (!userIds.length) return rows
  const { data: profs, error } = await supabaseAdmin.from('profiles').select('id, full_name').in('id', userIds)
  if (error) throw error
  const nameById = {}
  ;(profs || []).forEach((p) => {
    nameById[p.id] = p.full_name
  })
  return rows.map((r) => ({
    ...r,
    profiles: r.user_id && nameById[r.user_id] != null ? { full_name: nameById[r.user_id] } : null,
  }))
}

export const submitUpload = async (uploadData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .insert([{
      ...uploadData,
      status: 'pending_review',
      created_at: uploadData.created_at || new Date().toISOString()
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
    .select('*, organizations!target_account_uploads_organization_id_fkey(name)')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return enrichUploadRowsWithProfiles(data || [])
}

export const listAllUploads = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .select('*, organizations!target_account_uploads_organization_id_fkey(name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return enrichUploadRowsWithProfiles(data || [])
}

export const updateUploadStatus = async (uploadId, status, reviewerId, rejectionNote = null) => {
  const patch = {
    status,
    reviewed_by: reviewerId,
    reviewed_at: new Date().toISOString(),
  }
  if (status === 'rejected' && rejectionNote) {
    patch.rejection_note = rejectionNote
  }
  if (status === 'approved') {
    patch.rejection_note = null
  }

  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('target_account_uploads')
    .update(patch)
    .eq('id', uploadId)
    .select()
    .single()

  if (error) throw error
  return data
}
