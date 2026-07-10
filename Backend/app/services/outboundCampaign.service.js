import { supabaseAdmin } from '../config/supabase.js'
import axios from 'axios'

const CAMPAIGN_BASE_SELECT = '*, agents(id, name, agent_type, status)'
const CAMPAIGN_LIST_SELECT = `${CAMPAIGN_BASE_SELECT}, outbound_targets(count)`
const OUTBOUND_TARGET_WITH_LOG =
  '*, call_logs:call_logs!outbound_targets_call_log_id_fkey(id, status, duration_sec, cost, summary, transcript, recording_url, call_type, started_at, ended_at, caller_number, vapi_call_id, is_lead)'
const CAMPAIGN_DETAIL_SELECT = `${CAMPAIGN_BASE_SELECT}, outbound_targets(${OUTBOUND_TARGET_WITH_LOG})`

const enrichWithOrgNames = async (rows) => {
  const list = Array.isArray(rows) ? rows : rows ? [rows] : []
  if (!list.length) return rows

  const orgIds = [...new Set(list.map((r) => r.organization_id).filter(Boolean))]
  if (!orgIds.length) return rows

  const { data: orgs, error } = await supabaseAdmin
    .from('organizations')
    .select('id, name')
    .in('id', orgIds)

  if (error) throw error

  const orgById = Object.fromEntries((orgs || []).map((o) => [o.id, o.name]))
  const attach = (row) => ({
    ...row,
    organizations: row.organization_id
      ? { id: row.organization_id, name: orgById[row.organization_id] ?? null }
      : null,
  })

  return Array.isArray(rows) ? list.map(attach) : attach(list[0])
}

export const listAllOutboundCampaigns = async () => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_campaigns')
    .select(CAMPAIGN_LIST_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw error
  return enrichWithOrgNames(data)
}

export const listOutboundCampaignsByOrg = async (orgId, userId = null) => {
  let query = supabaseAdmin
    .schema('inbound')
    .from('outbound_campaigns')
    .select(CAMPAIGN_LIST_SELECT)
    .eq('organization_id', orgId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  query = query.order('created_at', { ascending: false })
  const { data, error } = await query

  if (error) throw error
  return enrichWithOrgNames(data)
}

export const listOutboundCampaignsByOrgs = async (orgIds, userId = null) => {
  if (!orgIds || orgIds.length === 0) return []

  let query = supabaseAdmin
    .schema('inbound')
    .from('outbound_campaigns')
    .select(CAMPAIGN_LIST_SELECT)
    .in('organization_id', orgIds)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  query = query.order('created_at', { ascending: false })
  const { data, error } = await query

  if (error) throw error
  return enrichWithOrgNames(data)
}

export const getOutboundCampaignById = async (id) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_campaigns')
    .select(CAMPAIGN_DETAIL_SELECT)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return enrichWithOrgNames(data)
}

export const createOutboundCampaign = async (payload, targets = []) => {
  const { data: campaign, error: campaignError } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_campaigns')
    .insert([payload])
    .select(CAMPAIGN_BASE_SELECT)
    .single()

  if (campaignError) throw campaignError

  if (targets.length > 0) {
    const targetRows = targets.map((item) => ({
      organization_id: payload.organization_id,
      agent_id: payload.agent_id,
      campaign_id: campaign.id,
      name: item.name ?? null,
      phone: item.phone,
      email: item.email ?? null,
      status: item.status || 'outbound',
      user_id: payload.user_id,
    }))

    const { error: targetsError } = await supabaseAdmin
      .schema('inbound')
      .from('outbound_targets')
      .insert(targetRows)

    if (targetsError) throw targetsError
  }

  return getOutboundCampaignById(campaign.id)
}

export const addTargetsToOutboundCampaign = async (campaignId, targets = []) => {
  const campaign = await getOutboundCampaignById(campaignId)
  if (!campaign) {
    const err = new Error('Campaign not found')
    err.status = 404
    throw err
  }

  if (!targets.length) {
    const err = new Error('No targets to add')
    err.status = 400
    throw err
  }

  const targetRows = targets.map((item) => ({
    organization_id: campaign.organization_id,
    agent_id: campaign.agent_id,
    campaign_id: campaign.id,
    name: item.name ?? null,
    phone: item.phone,
    email: item.email ?? null,
    status: item.status || 'outbound',
    user_id: campaign.user_id,
  }))

  const { error: targetsError } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .insert(targetRows)

  if (targetsError) throw targetsError

  return getOutboundCampaignById(campaignId)
}

export const updateOutboundCampaign = async (id, updateData) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_campaigns')
    .update(updateData)
    .eq('id', id)
    .select(CAMPAIGN_BASE_SELECT)
    .single()

  if (error) throw error
  return data
}

export const deleteOutboundCampaign = async (id) => {
  const { data, error } = await supabaseAdmin
    .schema('inbound')
    .from('outbound_campaigns')
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

export const initiateOutboundCampaign = async (campaignId) => {
  const campaign = await getOutboundCampaignById(campaignId)
  if (!campaign) {
    const err = new Error('Campaign not found')
    err.status = 404
    throw err
  }

  const targets = Array.isArray(campaign.outbound_targets) ? campaign.outbound_targets : []
  if (!targets.length) {
    const err = new Error('This campaign has no targets to dial')
    err.status = 400
    throw err
  }

  const webhookPath =
    process.env.REACT_APP_WEBHOOK_OUTBOUND_LIST_INITIATE || '/webhook/outbound_list_initiate'
  const webhookUrl = `${process.env.REACT_APP_WEBHOOK_BASE_URL}${webhookPath}`

  const payload = {
    campaign_id: campaign.id,
    campaign_name: campaign.name,
    organization_id: campaign.organization_id,
    agent_id: campaign.agent_id,
    agent: campaign.agents ?? null,
    target_count: targets.length,
    targets: targets.map((target) => ({
      id: target.id,
      phone: target.phone,
      name: target.name ?? null,
      email: target.email ?? null,
      status: target.status,
    })),
  }

  console.log('[initiateOutboundCampaign] Calling webhook:', webhookUrl)
  console.log('[initiateOutboundCampaign] Payload:', JSON.stringify(payload, null, 2))

  let webhookResult = null
  try {
    const response = await axios.post(webhookUrl, payload)
    webhookResult = response.data
  } catch (webhookError) {
    console.error('[initiateOutboundCampaign] webhook failed:', webhookError.message)
    const err = new Error('Failed to initiate outbound list calls')
    err.status = 502
    throw err
  }

  await supabaseAdmin
    .schema('inbound')
    .from('outbound_targets')
    .update({ status: 'initiate' })
    .eq('campaign_id', campaignId)

  return { campaign, targets, webhook: webhookResult }
}
