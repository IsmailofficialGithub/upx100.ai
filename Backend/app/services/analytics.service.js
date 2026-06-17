import { supabaseAdmin } from '../config/supabase.js'
import { buildObjectionInsights, buildLossReasonsFromText } from '../utils/objectionInsights.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const applyOrgScope = (query, { orgIds, orgId }) => {
  if (orgIds?.length) {
    return query.in('organization_id', orgIds)
  }
  if (orgId && UUID_RE.test(String(orgId))) {
    return query.eq('organization_id', orgId)
  }
  return query.limit(5000)
}

/**
 * @param {{ orgId?: string, orgIds?: string[] | null }} scope
 */
export const getClientAnalytics = async (scope = {}) => {
  const { orgId, orgIds } = scope

  let leadsQuery = supabaseAdmin.schema('inbound').from('leads').select('status, notes')
  leadsQuery = applyOrgScope(leadsQuery, { orgIds, orgId })

  let callsQuery = supabaseAdmin
    .schema('inbound')
    .from('call_logs')
    .select('transcript, summary, status')
  callsQuery = applyOrgScope(callsQuery, { orgIds, orgId })

  const [{ data: leadsRaw, error: leadsErr }, { data: callsRaw, error: callsErr }] =
    await Promise.all([leadsQuery, callsQuery])

  if (leadsErr) throw leadsErr
  if (callsErr) throw callsErr

  const leads = leadsRaw || []
  const calls = callsRaw || []

  const wonLeads = leads.filter((l) => l.status === 'success')
  const lostLeads = leads.filter(
    (l) => l.status !== 'success' && l.status !== 'new' && l.status !== 'warm'
  )

  const totalClosed = wonLeads.length + lostLeads.length

  const lostNotes = lostLeads.map((l) => l.notes).filter(Boolean)
  const callTexts = calls.flatMap((c) => [c.transcript, c.summary].filter(Boolean))
  const insightTexts = [...callTexts, ...lostNotes]

  const objectionInsights = buildObjectionInsights(insightTexts)
  const lossReasons = buildLossReasonsFromText([...lostNotes, ...callTexts])

  const winLossData = {
    won: {
      count: wonLeads.length,
      percentage: totalClosed > 0 ? Math.round((wonLeads.length / totalClosed) * 100) : 0,
      avgDeal: 145000,
    },
    lost: {
      count: lostLeads.length,
      percentage: totalClosed > 0 ? Math.round((lostLeads.length / totalClosed) * 100) : 0,
      avgDeal: 85000,
    },
    reasons: lossReasons.length
      ? lossReasons
      : lostLeads.length
        ? [{ reason: 'No transcript data', count: lostLeads.length }]
        : [],
  }

  const revenueProjection = { labels: [], data: [], costs: [] }

  const closeRate =
    leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0

  return {
    winLossData,
    revenueProjection,
    objectionInsights,
    roiDefaults: {
      acv: 145000,
      closeRate: closeRate || 0,
      runway: 6,
    },
  }
}
