import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'
import {
  assertAgentPhoneSameOrg,
  assertOrgNotReassigned,
  assertOrganizationRequired,
  assertPhoneExclusiveToOrg,
  normalizeLineStatus,
  sanitizePhoneForApi,
  sanitizePhonesForApi,
} from '../utils/phoneNumberCompliance.js'

/** PostgREST select that avoids optional/broken profile embeds. */
const PHONE_LIST_SELECT =
  '*, organizations:organizations!phone_numbers_organization_id_fkey(id, name), agents:agents!phone_numbers_agent_id_fkey(id, name)'

const ASSIGNABLE_STATUSES = ['active', 'porting']

/**
 * Inbound Phone Service
 * Handles provisioning, binding, and deletion of phone numbers via automation webhooks.
 */

export const provisionNumber = async (numberData) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_IMPORT_NUMBER}`

  assertOrganizationRequired(numberData.organization_id)
  await assertPhoneExclusiveToOrg(numberData.phone_number, numberData.organization_id)

  const lineStatus = numberData.status === 'porting' || numberData.port_requested ? 'porting' : 'active'

  // 1. Save to local database first to get unique ID
  const insertData = {
    phone_number: numberData.phone_number,
    organization_id: numberData.organization_id,
    label: numberData.label || null,
    provider: 'vapi',
    status: lineStatus,
    port_requested: false,
    country_code: numberData.country_code || null,
    user_id: numberData.user_id || null,
    tool_id: numberData.tool_id || null,
    phone_number_id: numberData.phone_number_id || null,
    call_forwarding_enabled: numberData.call_forwarding_enabled || false,
    call_forwarding_number: numberData.call_forwarding_number || null,
    call_forwarding_reason: numberData.call_forwarding_reason || null,
    metadata: {
      user_id: numberData.user_id || null,
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
  const { organization_id, ...payloadWithoutOrg } = numberData
  const finalPayload = {
    ...payloadWithoutOrg,
    organization_id: organization_id || null,
    id: data.id,
    call_forwarding_enabled: data.call_forwarding_enabled,
    call_forwarding_number: data.call_forwarding_number,
    call_forwarding_reason: data.call_forwarding_reason
  }

  const webhookResponse = await axios.post(webhookUrl, finalPayload)
  console.log("webhookResponse", webhookResponse.data)

  return { db: sanitizePhoneForApi(data), webhook: webhookResponse.data }
}

export const unbindAllNumbersFromAgent = async (agentId) => {
  const { error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update({ agent_id: null })
    .eq('agent_id', agentId)

  if (error) throw error
}

export const bindNumberToAgent = async (numberId, agentId) => {
  const webhookPath =
    process.env.REACT_APP_WEBHOOK_BIND_AGENT ||
    process.env.REACT_APP_WEBHOOK_UNBIND
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${webhookPath}`

  const existing = await getNumberById(numberId)
  if (!existing) {
    const err = new Error('Number not found')
    err.status = StatusCodes.NOT_FOUND
    throw err
  }

  const { data: agent, error: agentError } = await supabaseAdmin
    .schema('inbound')
    .from('agents')
    .select('id, organization_id, name, deleted_at')
    .eq('id', agentId)
    .single()

  if (agentError || !agent || agent.deleted_at) {
    const err = new Error('Agent not found')
    err.status = StatusCodes.NOT_FOUND
    throw err
  }

  assertAgentPhoneSameOrg(agent, existing)

  // One inbound line per agent: release any other number currently bound to this agent.
  await unbindAllNumbersFromAgent(agentId)

  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update({ agent_id: agentId })
    .eq('id', numberId)
    .select(PHONE_LIST_SELECT)
    .single()

  if (error) throw error

  let webhookResponse = { data: { status: 'bound' } }
  try {
    webhookResponse = await axios.post(webhookUrl, {
      numberId,
      agentId,
      organization_id: existing.organization_id,
      phone_number: existing.phone_number,
    })
  } catch (webhookError) {
    console.error('[bindNumberToAgent] webhook failed:', webhookError.message)
  }

  return { db: sanitizePhoneForApi(data), webhook: webhookResponse.data }
}

export const deleteNumber = async (numberId) => {
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${process.env.REACT_APP_WEBHOOK_DELETE_NUMBER}`

  const existing = await getNumberById(numberId)
  if (!existing) throw new Error('Number not found')

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, {
    numberId,
    phone_number_id: existing.phone_number_id,
    phone_number: existing.phone_number,
    organization_id: existing.organization_id
  })

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

  const existing = await getNumberById(numberId)
  if (!existing) throw new Error('Number not found')

  // 1. Trigger external automation
  const webhookResponse = await axios.post(webhookUrl, {
    numberId,
    organization_id: existing.organization_id
  })

  // 2. Update local database if needed (assuming webhook returns current status)
  if (webhookResponse.data.status) {
    const lineStatus = normalizeLineStatus({
      status: webhookResponse.data.status,
      port_requested: existing.port_requested,
    })
    await supabaseAdmin
      .schema('inbound')
      .from('phone_numbers')
      .update({ status: lineStatus })
      .eq('id', numberId)
    webhookResponse.data.status = lineStatus
  }

  return webhookResponse.data
}

/**
 * Record a number port-in request (client submits; GCC may also record on behalf of client).
 */
export const submitPortRequest = async (numberId, portData, submittedByUserId) => {
  const existing = await getNumberById(numberId)
  if (!existing) {
    const err = new Error('Number not found')
    err.status = StatusCodes.NOT_FOUND
    throw err
  }

  const meta = {
    ...(existing.metadata || {}),
    port_request: portData ?? {},
    port_submitted_at: new Date().toISOString(),
    port_submitted_by: submittedByUserId
  }

  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update({
      port_requested: true,
      port_status: 'submitted',
      status: 'porting',
      metadata: meta,
    })
    .eq('id', numberId)
    .select()
    .single()

  if (error) throw error
  return sanitizePhoneForApi(data)
}

export const updateNumber = async (numberId, updateData) => {
  // 1. Fetch existing to merge metadata and avoid overwriting with nulls
  const { data: existing, error: fetchError } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select('*')
    .eq('id', numberId)
    .single()

  if (fetchError || !existing) throw fetchError || new Error('Number not found')

  const nextOrgId =
    updateData.organization_id !== undefined ? updateData.organization_id : existing.organization_id
  const nextPhone =
    updateData.phone_number !== undefined ? updateData.phone_number : existing.phone_number

  assertOrganizationRequired(nextOrgId)
  assertOrgNotReassigned(existing.organization_id, nextOrgId)
  await assertPhoneExclusiveToOrg(nextPhone, nextOrgId, numberId)

  const nextStatus =
    updateData.status !== undefined
      ? normalizeLineStatus({ status: updateData.status, port_requested: updateData.port_requested })
      : normalizeLineStatus(existing)

  const updatePayload = {
    phone_number: nextPhone,
    organization_id: nextOrgId,
    user_id: updateData.user_id !== undefined ? updateData.user_id : existing.user_id,
    label: updateData.label !== undefined ? updateData.label : existing.label,
    provider: 'vapi',
    status: nextStatus,
    tool_id: updateData.tool_id !== undefined ? updateData.tool_id : existing.tool_id,
    phone_number_id: updateData.phone_number_id !== undefined ? updateData.phone_number_id : existing.phone_number_id,
    call_forwarding_enabled: updateData.call_forwarding_enabled !== undefined ? updateData.call_forwarding_enabled : existing.call_forwarding_enabled,
    call_forwarding_number: updateData.call_forwarding_number !== undefined ? updateData.call_forwarding_number : existing.call_forwarding_number,
    call_forwarding_reason: updateData.call_forwarding_reason !== undefined ? updateData.call_forwarding_reason : existing.call_forwarding_reason,
    agent_id: updateData.agent_id !== undefined ? updateData.agent_id : existing.agent_id,
    metadata: {
      ...(existing.metadata || {}),
      user_id: updateData.user_id !== undefined ? updateData.user_id : existing.user_id,
      tool_id: updateData.tool_id !== undefined ? updateData.tool_id : (existing.metadata?.tool_id || null),
      phone_number_id: updateData.phone_number_id !== undefined ? updateData.phone_number_id : (existing.metadata?.phone_number_id || null),
      call_forwarding_enabled: updateData.call_forwarding_enabled !== undefined ? updateData.call_forwarding_enabled : (existing.metadata?.call_forwarding_enabled || false),
      call_forwarding_number: updateData.call_forwarding_number !== undefined ? updateData.call_forwarding_number : (existing.metadata?.call_forwarding_number || null),
      call_forwarding_reason: updateData.call_forwarding_reason !== undefined ? updateData.call_forwarding_reason : (existing.metadata?.call_forwarding_reason || null)
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
    const { organization_id, ...updatePayloadWithoutOrg } = updateData
    await axios.post(webhookUrl, {
      ...updatePayloadWithoutOrg,
      organization_id: organization_id || existing.organization_id || null,
      id: data.id,
      call_forwarding_enabled: data.call_forwarding_enabled,
      call_forwarding_number: data.call_forwarding_number,
      call_forwarding_reason: data.call_forwarding_reason
    })
  } catch (webhookError) {
    console.error('Failed to trigger update webhook:', webhookError.message)
    // We don't throw here to ensure DB update is still considered successful
  }

  return sanitizePhoneForApi(data)
}

/** GCC completes or rejects a port-in request. */
export const reviewPortRequest = async (numberId, status, reviewerId) => {
  const existing = await getNumberById(numberId)
  if (!existing) {
    const err = new Error('Number not found')
    err.status = StatusCodes.NOT_FOUND
    throw err
  }
  if (!existing.port_requested) {
    const err = new Error('No port request on this number')
    err.status = StatusCodes.BAD_REQUEST
    throw err
  }

  const portStatus = status === 'approved' ? 'approved' : 'rejected'
  const meta = {
    ...(existing.metadata || {}),
    port_reviewed_at: new Date().toISOString(),
    port_reviewed_by: reviewerId,
  }

  const lineStatus = status === 'approved' ? 'active' : 'suspended'

  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update({
      port_status: portStatus,
      port_requested: status !== 'rejected',
      status: lineStatus,
      metadata: meta,
    })
    .eq('id', numberId)
    .select()
    .single()

  if (error) throw error
  return sanitizePhoneForApi(data)
}

export const requestPort = async (numberId, portData) => {
  // Logic for port request (roadmap: client_admin submits, gcc processes)
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .update({
      port_requested: true,
      port_status: 'pending',
      status: 'porting',
      metadata: portData,
    })
    .eq('id', numberId)
    .select()
    .single()

  if (error) throw error
  return sanitizePhoneForApi(data)
}

export const listNumbersByOrg = async (orgId, userId = null, options = {}) => {
  const { forAgentId = null, assignableOnly = false } = options

  let query = supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select(PHONE_LIST_SELECT)

  if (orgId && orgId !== 'null' && orgId !== '00000000-0000-4000-a000-000000000003') {
    query = query.eq('organization_id', orgId)
  } else {
    query = query.or('organization_id.is.null,organization_id.eq.00000000-0000-4000-a000-000000000003')
  }

  if (userId) {
    query = query.eq('user_id', userId)
  }

  if (assignableOnly) {
    query = query.in('status', ASSIGNABLE_STATUSES)
    if (forAgentId) {
      query = query.or(`agent_id.is.null,agent_id.eq.${forAgentId}`)
    } else {
      query = query.is('agent_id', null)
    }
  }

  const { data, error } = await query

  if (error) throw error
  return sanitizePhonesForApi(data)
}

export const getNumberById = async (numberId) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select(PHONE_LIST_SELECT)
    .eq('id', numberId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return sanitizePhoneForApi(data)
}

export const listAllNumbers = async (options = {}) => {
  const { forAgentId = null, organizationId = null, assignableOnly = false } = options

  if (organizationId) {
    return listNumbersByOrg(organizationId, null, { forAgentId, assignableOnly })
  }

  let query = supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select(PHONE_LIST_SELECT)

  if (assignableOnly) {
    query = query.in('status', ASSIGNABLE_STATUSES)
    if (forAgentId) {
      query = query.or(`agent_id.is.null,agent_id.eq.${forAgentId}`)
    } else {
      query = query.is('agent_id', null)
    }
  }

  const { data, error } = await query

  if (error) throw error
  return sanitizePhonesForApi(data)
}
