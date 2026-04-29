import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

/**
 * Inbound Agent Service
 * Handles AI Bot lifecycle by interacting with external webhooks and the local database.
 */

export const createAgent = async (agentData) => {
  const webhookUrl = process.env.INBOUND_BOT_CREATION_WEBHOOK_URL

  // 1. Trigger external automation (n8n/vapi etc)
  const webhookResponse = await axios.post(webhookUrl, agentData)

  // 2. Synchronize with local database
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .insert({
      ...agentData,
      vapi_id: webhookResponse.data.id || agentData.vapi_id, // assuming webhook returns the external ID
      status: 'activating'
    })
    .select()
    .single()

  if (error) throw error
  return { db: data, webhook: webhookResponse.data }
}

export const updateAgent = async (agentId, updateData) => {
  const webhookUrl = process.env.INBOUND_EDIT_AGENT_WEBHOOK_URL

  // 1. Trigger external automation
  const webhookResponse = await axios.patch(webhookUrl, { agentId, ...updateData })

  // 2. Update local database
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', agentId)
    .select()
    .single()

  if (error) throw error
  return { db: data, webhook: webhookResponse.data }
}

export const deleteAgent = async (agentId) => {
  const webhookUrl = process.env.INBOUND_DELETE_AGENT_WEBHOOK_URL

  // 1. Trigger external automation
  const webhookResponse = await axios.delete(webhookUrl, { data: { agentId } })

  // 2. Soft delete in local database
  const { error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .update({ deleted_at: new Date().toISOString(), status: 'deleted' })
    .eq('id', agentId)

  if (error) throw error
  return { success: true, webhook: webhookResponse.data }
}

export const getAgentById = async (agentId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (error) throw error
  return data
}

export const listAgentsByOrg = async (orgId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*')
    .eq('organization_id', orgId)
    .is('deleted_at', null)

  if (error) throw error
  return data
}

export const listAllAgents = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('*')
    .is('deleted_at', null)

  if (error) throw error
  return data
}
