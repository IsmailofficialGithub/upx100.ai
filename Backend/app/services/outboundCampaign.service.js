import { supabaseAdmin } from '../config/supabase.js'

const CAMPAIGN_BASE_SELECT = '*, agents(id, name, agent_type, status)'
const CAMPAIGN_LIST_SELECT = `${CAMPAIGN_BASE_SELECT}, outbound_targets(count)`
const CAMPAIGN_DETAIL_SELECT = `${CAMPAIGN_BASE_SELECT}, outbound_targets(*)`

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
