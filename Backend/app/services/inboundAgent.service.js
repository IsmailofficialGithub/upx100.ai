import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

/**
 * Inbound Agent Service
 * Handles AI Bot lifecycle by interacting with external webhooks and the local database.
 */

export const createAgent = async (agentData) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_CREATE_AGENT}`

  // 1. Synchronize with local database first to get unique ID
  const insertData = {
    organization_id: agentData.organization_id,
    name: agentData.name,
    vapi_id: agentData.vapi_id || null,
    voice_persona: agentData.voice_persona || null,
    script: agentData.script || null,
    company_name: agentData.company_name || null,
    website_url: agentData.website_url || null,
    goal: agentData.goal || null,
    background: agentData.background || null,
    welcome_message: agentData.welcome_message || null,
    instruction_voice: agentData.instruction_voice || null,
    language: agentData.language || null,
    agent_type: agentData.agent_type || null,
    tone: agentData.tone || null,
    model: agentData.model || null,
    user_id: agentData.user_id || null,
    status: 'activating',
    metadata: {
      ...agentData.metadata,
      voice_name: agentData.voice_name || null,
      voice_provider: agentData.voice_provider ? agentData.voice_provider.toLowerCase() : null
    }
  }

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
    id: data.id,
    voice_name: agentData.voice_name,
    voice_provider: agentData.voice_provider ? agentData.voice_provider.toLowerCase() : null
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
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_EDIT_AGENT}`

  // 1. Trigger external automation
  const webhookResponse = await axios.patch(webhookUrl, { agentId, ...updateData })

  // 2. Update local database
  const updatePayload = {
    name: updateData.name,
    organization_id: updateData.organization_id,
    vapi_id: updateData.vapi_id,
    voice_persona: updateData.voice_persona,
    script: updateData.script,
    company_name: updateData.company_name,
    website_url: updateData.website_url,
    goal: updateData.goal,
    background: updateData.background,
    welcome_message: updateData.welcome_message,
    instruction_voice: updateData.instruction_voice,
    language: updateData.language,
    agent_type: updateData.agent_type,
    tone: updateData.tone,
    model: updateData.model,
    metadata: {
      ...(data?.metadata || {}),
      voice_name: updateData.voice_name || null,
      voice_provider: updateData.voice_provider ? updateData.voice_provider.toLowerCase() : null
    },
    updated_at: new Date().toISOString()
  }

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

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, { agentId })

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

  if (error) throw error
  return {
    ...data,
    phone_number_id: data.phone_numbers?.[0]?.id || null
  }
}

export const listAgentsByOrg = async (orgId, userId = null) => {
  if (!orgId) return []
  
  let query = supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*, organizations:organizations!agents_organization_id_fkey(name), phone_numbers(id)')
    .eq('organization_id', orgId)
    .is('deleted_at', null)

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
