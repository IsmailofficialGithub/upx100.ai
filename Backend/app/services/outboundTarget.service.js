import { supabaseAdmin } from '../config/supabase.js'
import axios from 'axios'

/**
 * Outbound Target Service
 * Manages outbound phone numbers, single uploads, and bulk CSV targets.
 */

const TARGET_LIST_SELECT =
  '*, agents(*), outbound_campaigns(id, name), call_logs:call_logs!outbound_targets_call_log_id_fkey(id, status, duration_sec, cost, summary, transcript, recording_url, call_type, started_at, ended_at, caller_number, vapi_call_id, is_lead)'

export const linkCallLogToTarget = async (targetId, callLogId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .update({ call_log_id: callLogId, status: 'called' })
    .eq('id', targetId)
    .select(TARGET_LIST_SELECT)
    .single()

  if (error) throw error
  return data
}

export const listAllOutboundTargets = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .select(TARGET_LIST_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listOutboundTargetsByOrg = async (orgId, userId = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .select(TARGET_LIST_SELECT)
    .eq('organization_id', orgId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  query = query.order('created_at', { ascending: false })
  const { data, error } = await query

  if (error) throw error
  return data
}

export const listOutboundTargetsByOrgs = async (orgIds, userId = null) => {
  if (!orgIds || orgIds.length === 0) return []

  let query = supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .select(TARGET_LIST_SELECT)
    .in('organization_id', orgIds)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  query = query.order('created_at', { ascending: false })
  const { data, error } = await query

  if (error) throw error
  return data
}

export const getOutboundTargetById = async (id) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .select(TARGET_LIST_SELECT)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export const createOutboundTarget = async (payload, initiateCall = false) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .insert([payload])
    .select()
    .single()

  if (error) throw error

  const targetSyncPath =
    process.env.REACT_APP_WEBHOOK_OUTBOUND_TARGET_SYNC ||
    '/webhook/c50c815b-8c98-4eef-b56e-8c8e8a4708ca'
  const targetWebhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${targetSyncPath}`
  console.log('[createOutboundTarget] Calling webhook: ', targetWebhookUrl)
  console.log('[createOutboundTarget] Payload: ', data)
  try {
    await axios.post(targetWebhookUrl, data)
  } catch (webhookError) {
    console.error('[createOutboundTarget] creation webhook failed:', webhookError.message)
  }

  if (initiateCall && data.agent_id) {
    const callPayload = {
      id: data.id,
      outbound_target_id: data.id,
      phone: data.phone,
      name: data.name,
      email: data.email,
      status: data.status,
      agent_id: data.agent_id,
      organization_id: data.organization_id,
      user_id: data.user_id,
    }
    const baseUrl = process.env.REACT_APP_WEBHOOK_BASE_URL || ''

    const outboundCallPath =
      process.env.REACT_APP_WEBHOOK_OUTBOUND_CALL || '/webhook/outbound_call'
    const outboundCallUrl = `${baseUrl}${outboundCallPath}`
    try {
      await axios.post(outboundCallUrl, callPayload)
    } catch (webhookError) {
      console.error('[createOutboundTarget] outbound call webhook failed:', webhookError.message)
    }

    const singleCallPath =
      process.env.REACT_APP_WEBHOOK_OUTBOUT_SINGLE_CALL ||
      process.env.REACT_APP_WEBHOOK_OUTBOUND_SINGLE_CALL
    if (singleCallPath) {
      const singleCallUrl = `${baseUrl}${singleCallPath}`
      console.log('[createOutboundTarget] Calling single-call webhook: ', singleCallUrl)
      try {
        await axios.post(singleCallUrl, callPayload)
      } catch (webhookError) {
        console.error('[createOutboundTarget] single call webhook failed:', webhookError.message)
      }
    }
  }

  return data
}

export const createOutboundTargetsBulk = async (targetsArray) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .insert(targetsArray)
    .select()

  if (error) throw error
  return data
}

export const updateOutboundTarget = async (id, updateData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteOutboundTarget = async (id) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}
