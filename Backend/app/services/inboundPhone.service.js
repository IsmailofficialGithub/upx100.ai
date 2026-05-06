import axios from 'axios'
import { supabaseAdmin } from '../config/supabase.js'

/**
 * Inbound Phone Service
 * Handles provisioning, binding, and deletion of phone numbers via automation webhooks.
 */

export const provisionNumber = async (numberData) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_IMPORT_NUMBER}`

  // 1. Save to local database first to get unique ID
  const insertData = {
    phone_number: numberData.phone_number,
    organization_id: numberData.organization_id || null,
    label: numberData.label || null,
    provider: numberData.provider || 'vapi',
    status: 'pending',
    port_requested: false,
    country_code: numberData.country_code || null,
    user_id: numberData.user_id || null,
    tool_id: numberData.tool_id || null,
    phone_number_id: numberData.phone_number_id || null,
    call_forwarding_enabled: numberData.call_forwarding_enabled || false,
    call_forwarding_number: numberData.call_forwarding_number || null,
    call_forwarding_reason: numberData.call_forwarding_reason || null,
    metadata: {
      provider: numberData.provider || 'vapi',
      user_id: numberData.user_id || null,
      twilio_account_sid: numberData.twilio_account_sid || null,
      twilio_auth_token: numberData.twilio_auth_token || null,
      vonage_api_key: numberData.vonage_api_key || null,
      vonage_api_secret: numberData.vonage_api_secret || null,
      telnyx_api_key: numberData.telnyx_api_key || null,
      sms_enabled: numberData.sms_enabled || false,
      country_code: numberData.country_code || null,
      tool_id: numberData.tool_id || null,
      phone_number_id: numberData.phone_number_id || null,
      call_forwarding_enabled: numberData.call_forwarding_enabled || false,
      call_forwarding_number: numberData.call_forwarding_number || null,
      call_forwarding_reason: numberData.call_forwarding_reason || null
    }
  }

  let { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .insert(insertData)
    .select()
    .single()

  // Fallback: If provider enum fails (error 22P02), try without provider column
  if (error && error.code === '22P02') {
    const { provider, ...fallbackData } = insertData
    const retry = await supabaseAdmin
      .schema('inbound')
      .from('phone_numbers')
      .insert(fallbackData)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) throw error

  // 2. Trigger external automation (n8n/telephony provider) WITH the DB ID
  const finalPayload = {
    ...numberData,
    id: data.id,
    call_forwarding_enabled: data.call_forwarding_enabled,
    call_forwarding_number: data.call_forwarding_number,
    call_forwarding_reason: data.call_forwarding_reason
  }
  
  const webhookResponse = await axios.post(webhookUrl, finalPayload)
  console.log("webhookResponse", webhookResponse.data)

  return { db: data, webhook: webhookResponse.data }
}

export const bindNumberToAgent = async (numberId, agentId) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_UNBIND}`

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, { numberId, agentId })

  // 2. Update local database
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update({ agent_id: agentId })
    .eq('id', numberId)
    .select()
    .single()

  if (error) throw error
  return { db: data, webhook: webhookResponse.data }
}

export const deleteNumber = async (numberId) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_DELETE_NUMBER}`

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, { numberId })

  // 2. Remove from local database (or soft delete if required, but schema doesn't have deleted_at for numbers)
  const { error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .delete()
    .eq('id', numberId)

  if (error) throw error
  return { success: true, webhook: webhookResponse.data }
}

export const checkNumberStatus = async (numberId) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_CHECK_NUMBER_STATUS}`

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, { numberId })

  // 2. Update local database if needed (assuming webhook returns current status)
  if (webhookResponse.data.status) {
    await supabaseAdmin
      .schema('inbound')
      .from('phone_numbers')
      .update({ status: webhookResponse.data.status })
      .eq('id', numberId)
  }

  return webhookResponse.data
}

export const updateNumber = async (numberId, updateData) => {
  // Logic to update local database
  const updatePayload = {
    phone_number: updateData.phone_number,
    organization_id: updateData.organization_id || null,
    user_id: updateData.user_id || null,
    label: updateData.label || null,
    provider: updateData.provider || 'twilio',
    tool_id: updateData.tool_id || null,
    phone_number_id: updateData.phone_number_id || null,
    call_forwarding_enabled: updateData.call_forwarding_enabled || false,
    call_forwarding_number: updateData.call_forwarding_number || null,
    call_forwarding_reason: updateData.call_forwarding_reason || null,
    metadata: {
      provider: updateData.provider || 'twilio',
      user_id: updateData.user_id || null,
      twilio_account_sid: updateData.twilio_account_sid || null,
      twilio_auth_token: updateData.twilio_auth_token || null,
      vonage_api_key: updateData.vonage_api_key || null,
      vonage_api_secret: updateData.vonage_api_secret || null,
      telnyx_api_key: updateData.telnyx_api_key || null,
      tool_id: updateData.tool_id || null,
      phone_number_id: updateData.phone_number_id || null,
      call_forwarding_enabled: updateData.call_forwarding_enabled || false,
      call_forwarding_number: updateData.call_forwarding_number || null,
      call_forwarding_reason: updateData.call_forwarding_reason || null
    }
  }

  let { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update(updatePayload)
    .eq('id', numberId)
    .select()
    .single()

  // Fallback 1: If user_id column is missing (PGRST204)
  if (error && error.message.includes("user_id")) {
    const { user_id, ...payloadWithoutUser } = updatePayload
    const retry = await supabaseAdmin
      .schema('inbound')
      .from('phone_numbers')
      .update(payloadWithoutUser)
      .eq('id', numberId)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  // Fallback 2: If provider enum fails (error 22P02)
  if (error && error.code === '22P02') {
    const { provider, ...fallbackPayload } = (data || updatePayload)
    const retry = await supabaseAdmin
      .schema('inbound')
      .from('phone_numbers')
      .update(fallbackPayload)
      .eq('id', numberId)
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) throw error

  // Trigger webhook to update external system
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_IMPORT_NUMBER}`
  try {
    await axios.post(webhookUrl, {
      ...updateData,
      id: data.id,
      call_forwarding_enabled: data.call_forwarding_enabled,
      call_forwarding_number: data.call_forwarding_number,
      call_forwarding_reason: data.call_forwarding_reason
    })
  } catch (webhookError) {
    console.error('Failed to trigger update webhook:', webhookError.message)
    // We don't throw here to ensure DB update is still considered successful
  }

  return data
}

export const requestPort = async (numberId, portData) => {
  // Logic for port request (roadmap: client_admin submits, gcc processes)
  const { data, error } = await supabaseAdmin
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
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select('*, organizations:organization_id(id, name), profiles:user_id(id, full_name, email)')
    .eq('organization_id', orgId)

  if (error) throw error
  return data
}

export const listAllNumbers = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select('*, organizations:organization_id(id, name), profiles:user_id(id, full_name, email)')

  if (error) throw error
  return data
}
