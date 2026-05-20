import { supabaseAdmin } from '../config/supabase.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Analytics Service
 */

export const getClientAnalytics = async (orgId) => {
  // 1. Get Win/Loss data from leads (status only — avoid loading full rows network-wide)
  let leadsQuery = supabaseAdmin.schema('inbound').from('leads').select('status')
  if (orgId && UUID_RE.test(String(orgId))) {
    leadsQuery = leadsQuery.eq('organization_id', orgId)
  } else {
    // GCC all-tenant / missing org: cap rows so analytics cannot block the API for minutes
    leadsQuery = leadsQuery.limit(5000)
  }

  const { data: leadsRaw, error: leadsErr } = await leadsQuery
  if (leadsErr) throw leadsErr
  const leads = leadsRaw || []

  const wonLeads = leads?.filter(l => l.status === 'success') || []
  const lostLeads = leads?.filter(l => l.status !== 'success' && l.status !== 'new' && l.status !== 'warm') || []

  const totalClosed = wonLeads.length + lostLeads.length
  
  const winLossData = {
    won: {
      count: wonLeads.length,
      percentage: totalClosed > 0 ? Math.round((wonLeads.length / totalClosed) * 100) : 0,
      avgDeal: 145000 // Placeholder for now as deal value isn't in schema
    },
    lost: {
      count: lostLeads.length,
      percentage: totalClosed > 0 ? Math.round((lostLeads.length / totalClosed) * 100) : 0,
      avgDeal: 85000 // Placeholder
    },
    reasons: [
      { reason: 'Budget constraints', count: Math.round(lostLeads.length * 0.4) },
      { reason: 'Timing/Priority', count: Math.round(lostLeads.length * 0.3) },
      { reason: 'Competitor choice', count: Math.round(lostLeads.length * 0.2) },
      { reason: 'Feature gap', count: Math.round(lostLeads.length * 0.1) }
    ]
  }

  // Legacy shape for older clients; ROI chart now builds month labels from the current date in the app.
  const revenueProjection = { labels: [], data: [], costs: [] }

  // 3. Objections (Return mocks from service for consistency until table exists)
  const objectionInsights = [
    {
      objection: 'Pricing is too high',
      frequency: 42,
      rebuttal: 'Focus on the $16k monthly savings and 24/7 coverage compared to a human SDR.',
    },
    {
      objection: 'Need more features',
      frequency: 28,
      rebuttal: 'Highlight our custom integration capabilities and rapid feature deployment cycle.',
    },
    {
      objection: 'Already have a solution',
      frequency: 18,
      rebuttal: 'Position UP100X as a specialized AI layer that works alongside their current CRM.',
    }
  ]

  return {
    winLossData,
    revenueProjection,
    objectionInsights,
    roiDefaults: {
      acv: 145000,
      closeRate: 22,
      runway: 6
    }
  }
}
