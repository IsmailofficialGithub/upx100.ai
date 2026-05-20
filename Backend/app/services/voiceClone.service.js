import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../config/supabase.js'

/**
 * Voice Clone Service
 * Manages voice cloning requests and sample metadata.
 */

const VOICE_CLONE_MIN_SEC = 50
const VOICE_CLONE_MAX_SEC = 70
const MAX_SAMPLE_BYTES = 6 * 1024 * 1024

export const validateCloneDuration = (durationSec) => {
  const n = Number(durationSec)
  if (!Number.isFinite(n)) return false
  return n >= VOICE_CLONE_MIN_SEC && n <= VOICE_CLONE_MAX_SEC
}

const extFromMime = (mime = '') => {
  if (mime.includes('wav')) return 'wav'
  if (mime.includes('mp4') || mime.includes('m4a')) return 'm4a'
  if (mime.includes('ogg')) return 'ogg'
  return 'mp3'
}

/**
 * Persist uploaded audio; prefers Supabase Storage, falls back to data URL for small samples.
 */
export const persistSampleFromBase64 = async ({ sample_base64, sample_mime, organization_id }) => {
  const buffer = Buffer.from(sample_base64, 'base64')
  if (buffer.length > MAX_SAMPLE_BYTES) {
    const err = new Error('Voice sample is too large (max 6MB)')
    err.code = 'SAMPLE_TOO_LARGE'
    throw err
  }

  const bucket = process.env.VOICE_SAMPLES_BUCKET || 'voice-samples'
  const ext = extFromMime(sample_mime)
  const path = `${organization_id || 'unknown'}/${randomUUID()}.${ext}`

  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
    contentType: sample_mime || 'audio/mpeg',
    upsert: false,
  })

  if (!error) {
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  if (buffer.length <= 2 * 1024 * 1024) {
    return `data:${sample_mime || 'audio/mpeg'};base64,${sample_base64}`
  }

  const err = new Error(
    error?.message || 'Could not store voice sample. Configure Supabase bucket VOICE_SAMPLES_BUCKET.',
  )
  err.code = 'STORAGE_UPLOAD_FAILED'
  throw err
}

export const submitCloneRequest = async (cloneData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .insert([{
      ...cloneData,
      status: 'submitted',
      created_at: cloneData.created_at || new Date().toISOString()
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
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listAllClones = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .select('*, organizations!voice_clone_submissions_organization_id_fkey(name), profiles!voice_clone_submissions_submitted_by_fkey(full_name)')
    .order('created_at', { ascending: false })

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
export const getCloneById = async (cloneId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('voice_clone_submissions')
    .select('*')
    .eq('id', cloneId)
    .single()

  if (error) return null
  return data
}
