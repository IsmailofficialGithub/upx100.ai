/** Keyword-based objection detection from call transcripts, summaries, and lead notes. */

const OBJECTION_CATALOG = [
  {
    objection: 'Too expensive',
    patterns: [
      /\btoo expensive\b/i,
      /\bpricing\b/i,
      /\bprice is\b/i,
      /\bover budget\b/i,
      /\bcan'?t afford\b/i,
      /\bbudget\b/i,
      /\bcost(s)?\b/i,
    ],
    rebuttal:
      'I understand budget is a key consideration. Many clients found that our solution pays for itself within 60 days by reducing manual compliance work by 80%.',
  },
  {
    objection: 'Not a priority right now',
    patterns: [
      /\bnot a priority\b/i,
      /\bnot right now\b/i,
      /\bbad timing\b/i,
      /\bcheck back\b/i,
      /\bcall me later\b/i,
      /\bnext quarter\b/i,
    ],
    rebuttal:
      'That makes sense. When this does become a priority, what would trigger that shift? I can send you a brief case study for when the timing is right.',
  },
  {
    objection: 'Using a competitor',
    patterns: [
      /\bcompetitor\b/i,
      /\balready have\b/i,
      /\bexisting vendor\b/i,
      /\bcurrent provider\b/i,
      /\busing another\b/i,
      /\bhappy with\b/i,
    ],
    rebuttal:
      'Great — you already see the value in automation. I\'d love to show you how we differentiate on implementation speed and ongoing support.',
  },
  {
    objection: 'Need to check with team',
    patterns: [
      /\bcheck with\b/i,
      /\btalk to my\b/i,
      /\bneed approval\b/i,
      /\bdecision maker\b/i,
      /\bmy team\b/i,
      /\bstakeholder\b/i,
    ],
    rebuttal:
      'Absolutely, this is a team decision. Would it be helpful if I prepared a one-page summary for your team or ran a brief group demo?',
  },
  {
    objection: "Don't have budget",
    patterns: [/\bno budget\b/i, /\bdon'?t have budget\b/i, /\bfunds\b/i, /\bfinance team\b/i],
    rebuttal:
      'I hear you. We offer a pilot program at reduced cost so you can demonstrate ROI to your finance team before committing to the full contract.',
  },
  {
    objection: 'Not interested',
    patterns: [
      /\bnot interested\b/i,
      /\bno thanks\b/i,
      /\bstop calling\b/i,
      /\bremove me\b/i,
      /\bdo not call\b/i,
    ],
    rebuttal:
      'Understood. I\'ll send a brief email with our top case study and check back later. If anything changes, I\'m here to help.',
  },
]

/**
 * @param {string[]} textSamples
 * @returns {{ objection: string, frequency: number, rebuttal: string, count: number }[]}
 */
export function buildObjectionInsights(textSamples) {
  const samples = (textSamples || []).map((t) => String(t).trim()).filter(Boolean)
  if (!samples.length) return []

  const tallies = OBJECTION_CATALOG.map((rule) => ({ ...rule, count: 0 }))

  for (const text of samples) {
    for (const rule of tallies) {
      if (rule.patterns.some((p) => p.test(text))) {
        rule.count += 1
      }
    }
  }

  return tallies
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((r) => ({
      objection: r.objection,
      frequency: Math.round((r.count / samples.length) * 100),
      rebuttal: r.rebuttal,
      count: r.count,
    }))
}

/** Map objection catalog entries to loss-reason labels for win/loss panel. */
const LOSS_REASON_LABELS = {
  'Too expensive': 'Too Expensive',
  "Don't have budget": 'Budget constraints',
  'Not a priority right now': 'Timing / Priority',
  'Using a competitor': 'Competitor chosen',
  'Not interested': 'No decision',
  'Need to check with team': 'Internal approval',
}

/**
 * @param {string[]} textSamples
 * @returns {{ reason: string, count: number }[]}
 */
export function buildLossReasonsFromText(textSamples) {
  const insights = buildObjectionInsights(textSamples)
  if (!insights.length) return []

  const byReason = new Map()
  for (const row of insights) {
    const label = LOSS_REASON_LABELS[row.objection] || row.objection
    byReason.set(label, (byReason.get(label) || 0) + row.count)
  }

  return [...byReason.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
}
