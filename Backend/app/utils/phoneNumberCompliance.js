import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'

export const LINE_STATUSES = ['active', 'porting', 'suspended']

const PORTING_STATUSES = new Set([
  'porting',
  'pending',
  'submitted',
  'in_progress',
  'processing',
])

const SUSPENDED_STATUSES = new Set(['suspended', 'inactive', 'disabled', 'revoked'])

const ACTIVE_STATUSES = new Set(['active', 'live', 'ready', 'online'])

export function normalizeLineStatus(row = {}) {
  const raw = String(row.status ?? '').toLowerCase()
  if (row.port_requested || PORTING_STATUSES.has(raw)) return 'porting'
  if (SUSPENDED_STATUSES.has(raw)) return 'suspended'
  if (ACTIVE_STATUSES.has(raw)) return 'active'
  if (raw === 'porting') return 'porting'
  return 'active'
}

export function assertOrganizationRequired(organizationId) {
  if (!organizationId || organizationId === 'null') {
    const err = new Error('A client organization is required. Each phone number must belong to exactly one client.')
    err.status = StatusCodes.BAD_REQUEST
    throw err
  }
}

/** One E.164 line may not be registered under a different client org. */
export async function assertPhoneExclusiveToOrg(phoneNumber, organizationId, excludeId = null) {
  if (!phoneNumber || !organizationId) return

  let query = supabaseAdmin
    .schema('inbound')
    .from('phone_numbers')
    .select('id, organization_id')
    .eq('phone_number', phoneNumber)

  if (excludeId) query = query.neq('id', excludeId)

  const { data, error } = await query
  if (error) throw error

  const conflict = (data || []).find(
    (row) => row.organization_id && row.organization_id !== organizationId,
  )
  if (conflict) {
    const err = new Error(
      'This phone number is already assigned to another client. Sharing numbers across clients is not permitted.',
    )
    err.status = StatusCodes.CONFLICT
    throw err
  }
}

export function assertOrgNotReassigned(existingOrgId, nextOrgId) {
  if (
    existingOrgId &&
    nextOrgId &&
    existingOrgId !== nextOrgId
  ) {
    const err = new Error(
      'Cannot move a phone number to a different client. Remove it and import again for the new client.',
    )
    err.status = StatusCodes.CONFLICT
    throw err
  }
}

/** Strip telephony provider from API payloads (still stored for automation). */
export function sanitizePhoneForApi(row) {
  if (!row) return row
  const { provider, metadata, ...rest } = row
  const meta = metadata && typeof metadata === 'object' ? { ...metadata } : {}
  delete meta.provider
  delete meta.twilio_account_sid
  delete meta.twilio_auth_token
  delete meta.vonage_api_key
  delete meta.vonage_api_secret
  delete meta.telnyx_api_key
  const lineStatus = normalizeLineStatus(row)
  return {
    ...rest,
    status: lineStatus,
    metadata: Object.keys(meta).length ? meta : undefined,
  }
}

export function sanitizePhonesForApi(rows) {
  return (rows || []).map(sanitizePhoneForApi)
}

/** Agent and phone must belong to the same client organization. */
export function assertAgentPhoneSameOrg(agent, phoneRow) {
  const agentOrg = agent?.organization_id ?? null
  const phoneOrg = phoneRow?.organization_id ?? null
  if (!agentOrg || !phoneOrg || agentOrg !== phoneOrg) {
    const err = new Error(
      'Phone number and agent must belong to the same client organization.',
    )
    err.status = StatusCodes.CONFLICT
    throw err
  }
}

export function normalizeAgentType(agentType) {
  return agentType === 'outbound' ? 'outbound' : 'inbound'
}

export function agentBindingColumn(agentType) {
  return normalizeAgentType(agentType) === 'outbound' ? 'outbound_agent_id' : 'inbound_agent_id'
}

export function phoneAgentIdForType(phoneRow, agentType) {
  if (!phoneRow) return null
  return phoneRow[agentBindingColumn(agentType)] ?? null
}

export function isAssignableToAgent(phoneRow, agentId, agentType = 'inbound') {
  if (!phoneRow) return false
  const status = normalizeLineStatus(phoneRow)
  if (status === 'suspended') return false
  const boundId = phoneAgentIdForType(phoneRow, agentType)
  if (!boundId) return true
  return boundId === agentId
}
