import { supabase } from '../config/supabase.js'

/**
 * Analytics Service
 */

export const getClientAnalytics = async (orgId) => {
  // 1. Get Win/Loss data from leads
  const { data: leads } = await supabase.schema('inbound')
    .from('leads')
    .select('*')
    .eq('organization_id', orgId)

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

  // 2. Projection data (Simulated for now based on actual counts)
  const currentMonthlyRevenue = wonLeads.length * 12000
  const labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const revenueProjection = {
    labels,
    data: labels.map((_, i) => currentMonthlyRevenue * (1 + (i * 0.15))),
    costs: labels.map((_, i) => 3000 + (i * 200))
  }

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
