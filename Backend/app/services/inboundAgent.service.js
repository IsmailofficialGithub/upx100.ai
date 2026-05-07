import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

/**
 * Inbound Agent Service
 * Handles AI Bot lifecycle by interacting with external webhooks and the local database.
 */

export const createAgent = async (agentData) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_CREATE_AGENT}`

  const metadata = {
    ...(agentData.metadata || {}),
    voice_name: agentData.voice_name || null,
    voice_provider: agentData.voice_provider ? agentData.voice_provider.toLowerCase() : null,
    fallback_config: {
      number: agentData.fallback_number || null,
      enabled: agentData.fallback_enabled || false
    }
  }

  // 1. Synchronize with local database first to get unique ID
  const validColumns = [
    'organization_id', 'name', 'vapi_id', 'voice_persona', 'script', 
    'status', 'is_paused', 'company_name', 'website_url', 'goal', 
    'background', 'welcome_message', 'instruction_voice', 'language', 
    'agent_type', 'tone', 'model', 'conversation_agent_link', 'user_id'
  ]

  const insertData = {
    status: 'activating',
    metadata
  }

  validColumns.forEach(col => {
    if (agentData[col] !== undefined) {
      insertData[col] = agentData[col]
    }
  })

  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .insert(insertData)
    .select()
    .single()

  if (error) throw error

  // 2. Trigger external automation (n8n/vapi etc) WITH the DB ID
  const finalPayload = {
    ...agentData,
    organization_id: agentData.organization_id || null,
    id: data.id,
    fallback_number: metadata.fallback_config.number,
    fallback_enabled: metadata.fallback_config.enabled,
    metadata
  }

  const webhookResponse = await axios.post(webhookUrl, finalPayload)

  // Update vapi_id if webhook returned one
  if (webhookResponse.data.id) {
    await supabaseAdmin
      .schema('inbound')
      .from('agents')
      .update({ vapi_id: webhookResponse.data.id })
      .eq('id', data.id)
  }

  return { db: data, webhook: webhookResponse.data }
}

export const updateAgent = async (agentId, updateData) => {
  // 1. Fetch existing to merge metadata and avoid overwriting with nulls
  const { data: existing, error: fetchError } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (fetchError || !existing) throw fetchError || new Error('Agent not found')

  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_EDIT_AGENT}`

  // Construct metadata with fallback_config
  const newMetadata = {
    ...(existing.metadata || {}),
    ...(updateData.metadata || {}),
    voice_name: updateData.voice_name !== undefined ? updateData.voice_name : (existing.metadata?.voice_name || null),
    voice_provider: updateData.voice_provider ? updateData.voice_provider.toLowerCase() : (existing.metadata?.voice_provider || null),
    fallback_config: {
      number: updateData.fallback_number !== undefined ? updateData.fallback_number : (existing.metadata?.fallback_config?.number || null),
      enabled: updateData.fallback_enabled !== undefined ? updateData.fallback_enabled : (existing.metadata?.fallback_config?.enabled || false)
    }
  }

  // 2. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, {
    agentId,
    ...updateData,
    organization_id: updateData.organization_id || existing.organization_id || null,
    fallback_number: newMetadata.fallback_config.number,
    fallback_enabled: newMetadata.fallback_config.enabled,
    metadata: newMetadata
  })

  // 3. Update local database
  const validColumns = [
    'organization_id', 'name', 'vapi_id', 'voice_persona', 'script', 
    'status', 'is_paused', 'company_name', 'website_url', 'goal', 
    'background', 'welcome_message', 'instruction_voice', 'language', 
    'agent_type', 'tone', 'model', 'conversation_agent_link', 'user_id'
  ]

  const updatePayload = {
    metadata: newMetadata,
    updated_at: new Date().toISOString()
  }

  validColumns.forEach(col => {
    if (updateData[col] !== undefined) {
      updatePayload[col] = updateData[col]
    }
  })

  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .update(updatePayload)
    .eq('id', agentId)
    .select()
    .single()

  if (error) throw error
  return { db: data, webhook: webhookResponse.data }
}

export const deleteAgent = async (agentId) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_DELETE_AGENT}`

  const existing = await getAgentById(agentId)
  if (!existing) throw new Error('Agent not found')

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, {
    agentId,
    vapi_id: existing.vapi_id,
    organization_id: existing.organization_id
  })

  // 2. Soft delete in local database
  const { error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .update({ deleted_at: new Date().toISOString(), status: 'deleted' })
    .eq('id', agentId)

  if (error) throw error

  // 3. Unbind any phone number linked to this agent
  await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update({ agent_id: null })
    .eq('agent_id', agentId)

  return { success: true, webhook: webhookResponse.data }
}

export const getAgentById = async (agentId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations:organizations!agents_organization_id_fkey(name), phone_numbers(id)')
    .eq('id', agentId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return {
    ...data,
    phone_number_id: data.phone_numbers?.[0]?.id || null
  }
}

export const listAgentsByOrg = async (orgId, userId = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations:organizations!agents_organization_id_fkey(name), phone_numbers(id)')
    .is('deleted_at', null)

  if (orgId && orgId !== 'null' && orgId !== '00000000-0000-4000-a000-000000000003') {
    query = query.eq('organization_id', orgId)
  } else {
    query = query.or('organization_id.is.null,organization_id.eq.00000000-0000-4000-a000-000000000003')
  }

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) throw error
  return data.map(agent => ({
    ...agent,
    phone_number_id: agent.phone_numbers?.[0]?.id || null
  }))
}

export const listAllAgents = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations:organizations!agents_organization_id_fkey(name), phone_numbers(id)')
    .is('deleted_at', null)

  if (error) throw error
  return data.map(agent => ({
    ...agent,
    phone_number_id: agent.phone_numbers?.[0]?.id || null
  }))
}
