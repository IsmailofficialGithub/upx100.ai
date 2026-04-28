import axios from 'axios'
import { supabase } from '../config/supabase.js'

/**
 * Inbound Phone Service
 * Handles provisioning, binding, and deletion of phone numbers via automation webhooks.
 */

export const provisionNumber = async (numberData) => {
  const webhookUrl = process.env.INBOUND_PHONE_NUMBER_WEBHOOK_URL

  // 1. Trigger external automation (n8n/telephony provider)
  const webhookResponse = await axios.post(webhookUrl, numberData)

  // 2. Save to local database
  const { data, error } = await supabase
    .from('phone_numbers')
    .insert({
      ...numberData,
      status: 'pending',
      port_requested: false
    })
    .select()
    .single()

  if (error) throw error
  return { db: data, webhook: webhookResponse.data }
}

export const bindNumberToAgent = async (numberId, agentId) => {
  const webhookUrl = process.env.INBOUND_BIND_WEBHOOK_URL

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, { numberId, agentId })

  // 2. Update local database
  const { data, error } = await supabase
    .from('phone_numbers')
    .update({ agent_id: agentId })
    .eq('id', numberId)
    .select()
    .single()

  if (error) throw error
  return { db: data, webhook: webhookResponse.data }
}

export const deleteNumber = async (numberId) => {
  const webhookUrl = process.env.INBOUND_DELETE_NUMBER_WEBHOOK_URL

  // 1. Trigger external automation
  const webhookResponse = await axios.delete(webhookUrl, { data: { numberId } })

  // 2. Remove from local database (or soft delete if required, but schema doesn't have deleted_at for numbers)
  const { error } = await supabase
    .schema('inbound')
    .from('phone_numbers')
    .delete()
    .eq('id', numberId)

  if (error) throw error
  return { success: true, webhook: webhookResponse.data }
}

export const requestPort = async (numberId, portData) => {
  // Logic for port request (roadmap: client_admin submits, gcc processes)
  const { data, error } = await supabase
    .schema('inbound')
    .from('phone_numbers')
    .update({ 
      port_requested: true, 
      port_status: 'pending',
      metadata: portData // Optional additional details
    })
    .eq('id', numberId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const listNumbersByOrg = async (orgId) => {
  const { data, error } = await supabase
    .schema('inbound')
    .from('phone_numbers')
    .select('*')
    .eq('organization_id', orgId)

  if (error) throw error
  return data
}

export const listAllNumbers = async () => {
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('*')

  if (error) throw error
  return data
}
