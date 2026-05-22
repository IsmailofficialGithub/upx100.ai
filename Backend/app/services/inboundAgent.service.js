import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'
import { enrichAgentPayload } from '../lib/agentPrompt.js'

/**
 * Inbound Agent Service
 * Handles AI Bot lifecycle by interacting with external webhooks and the local database.
 */

export const createAgent = async (agentData) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_CREATE_AGENT}`

  const enriched = enrichAgentPayload(agentData)

  const metadata = {
    ...(enriched.metadata || {}),
    voice_name: agentData.voice_name || null,
    voice_provider: agentData.voice_provider ? agentData.voice_provider.toLowerCase() : null,
    fallback_config: {
      number: agentData.fallback_number || null,
      enabled: agentData.fallback_enabled || false
    }
  }

  // 1. Synchronize with local database first to get unique ID
  const recording_disclosure_enabled = enriched.recording_disclosure_enabled

  const validColumns = [
    'organization_id', 'name', 'vapi_id', 'voice_persona', 'script',
    'status', 'is_paused', 'company_name', 'website_url', 'industry_vertical', 'goal',
    'background', 'welcome_message', 'instruction_voice', 'language',
    'agent_type', 'tone', 'model', 'conversation_agent_link', 'user_id', 'knowledge_base_url',
    'recording_disclosure_enabled',
  ]

  const insertData = {
    status: 'activating',
    metadata,
    recording_disclosure_enabled,
  }

  validColumns.forEach(col => {
    if (enriched[col] !== undefined) {
      insertData[col] = enriched[col]
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
    ...enriched,
    organization_id: enriched.organization_id || null,
    id: data.id,
    fallback_number: metadata.fallback_config.number,
    fallback_enabled: metadata.fallback_config.enabled,
    knowledge_base_url: insertData.knowledge_base_url ?? null,
    metadata,
    system_prompt: insertData.script,
    welcome_ssml: metadata.welcome_ssml,
    recording_disclosure_enabled: enriched.recording_disclosure_enabled,
    recording_disclosure_message: enriched.recording_disclosure_message,
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

  const enriched = enrichAgentPayload(updateData, existing)

  // Construct metadata with fallback_config
  const recording_disclosure_enabled = enriched.recording_disclosure_enabled

  const newMetadata = {
    ...(enriched.metadata || {}),
    voice_name: updateData.voice_name !== undefined ? updateData.voice_name : (existing.metadata?.voice_name || null),
    voice_provider: updateData.voice_provider ? updateData.voice_provider.toLowerCase() : (existing.metadata?.voice_provider || null),
    fallback_config: {
      number: updateData.fallback_number !== undefined ? updateData.fallback_number : (existing.metadata?.fallback_config?.number || null),
      enabled: updateData.fallback_enabled !== undefined ? updateData.fallback_enabled : (existing.metadata?.fallback_config?.enabled || false)
    },
    recording_disclosure_enabled,
    recording_disclosure_message: enriched.recording_disclosure_message,
  }

  // 2. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, {
    agentId,
    ...enriched,
    organization_id: enriched.organization_id || existing.organization_id || null,
    fallback_number: newMetadata.fallback_config.number,
    fallback_enabled: newMetadata.fallback_config.enabled,
    knowledge_base_url:
      enriched.knowledge_base_url !== undefined
        ? enriched.knowledge_base_url
        : existing.knowledge_base_url ?? null,
    metadata: newMetadata,
    system_prompt: enriched.script,
    welcome_ssml: newMetadata.welcome_ssml,
    recording_disclosure_enabled,
    recording_disclosure_message: enriched.recording_disclosure_message,
  })

  // 3. Update local database
  const validColumns = [
    'organization_id', 'name', 'vapi_id', 'voice_persona', 'script',
    'status', 'is_paused', 'company_name', 'website_url', 'industry_vertical', 'goal',
    'background', 'welcome_message', 'instruction_voice', 'language',
    'agent_type', 'tone', 'model', 'conversation_agent_link', 'user_id', 'knowledge_base_url',
    'recording_disclosure_enabled',
  ]

  const updatePayload = {
    metadata: newMetadata,
    updated_at: new Date().toISOString(),
    recording_disclosure_enabled,
  }

  validColumns.forEach(col => {
    if (enriched[col] !== undefined) {
      updatePayload[col] = enriched[col]
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
    .select('*, organizations:organizations!agents_organization_id_fkey(name), phone_numbers:phone_numbers!phone_numbers_agent_id_fkey(id, phone_number, agent_id)')
    .eq('id', agentId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return {
    ...data,
    phone_number_id: resolveAgentPhoneNumberId(data.phone_numbers),
  }
}

function resolveAgentPhoneNumberId(phoneNumbers) {
  if (!phoneNumbers) return null
  if (Array.isArray(phoneNumbers)) return phoneNumbers[0]?.id || null
  return phoneNumbers.id || null
}

export const listAgentsByOrg = async (orgId, userId = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations:organizations!agents_organization_id_fkey(name), phone_numbers:phone_numbers!phone_numbers_agent_id_fkey(id, phone_number, agent_id)')
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
  return data.map((agent) => ({
    ...agent,
    phone_number_id: resolveAgentPhoneNumberId(agent.phone_numbers),
  }))
}

export const listAllAgents = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations:organizations!agents_organization_id_fkey(name), phone_numbers:phone_numbers!phone_numbers_agent_id_fkey(id, phone_number, agent_id)')
    .is('deleted_at', null)

  if (error) throw error
  return data.map((agent) => ({
    ...agent,
    phone_number_id: resolveAgentPhoneNumberId(agent.phone_numbers),
  }))
}
