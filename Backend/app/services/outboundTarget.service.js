import { supabaseAdmin } from '../config/supabase.js'
import axios from 'axios'

/**
 * Outbound Target Service
 * Manages outbound phone numbers, single uploads, and bulk CSV targets.
 */

export const listAllOutboundTargets = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .select('*, agents(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const listOutboundTargetsByOrg = async (orgId, userId = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .select('*, agents(*)')
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
    .select('*, agents(*)')
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
    .select('*, agents(*)')
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

  if (initiateCall && data.agent_id) {
    const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_OUTBOUND_CALL || '/webhook/outbound_call'}`
    try {
      await axios.post(webhookUrl, {
        id: data.id,
        phone: data.phone,
        name: data.name,
        email: data.email,
        status: data.status,
        agent_id: data.agent_id,
        organization_id: data.organization_id,
        user_id: data.user_id,
      })
    } catch (webhookError) {
      console.error('[createOutboundTarget] webhook failed:', webhookError.message)
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
