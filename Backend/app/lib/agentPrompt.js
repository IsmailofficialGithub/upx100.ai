/**
 * Agent prompt + SSML pacing derived from agent_type and tone.
 * Model selection is server-side only (INBOUND_AGENT_MODEL); never from client UI.
 */

export const CONFIG_MARKER = '=== AGENT CONFIGURATION ==='
export const SCRIPT_MARKER = '=== CALL SCRIPT ==='

const AGENT_TYPE_LABELS = {
  sales: 'Sales',
  support: 'Support',
  qualification: 'Lead Qualification',
  receptionist: 'Receptionist',
}

const TONE_LABELS = {
  professional: 'Professional',
  friendly: 'Friendly',
  energetic: 'Energetic',
  calm: 'Calm',
}

const AGENT_TYPE_GUIDANCE = {
  sales:
    'Prioritize discovery, articulate value clearly, handle objections briefly, and drive toward a concrete next step (meeting, demo, or follow-up).',
  support:
    'Focus on understanding the issue, showing empathy, resolving or escalating efficiently, and confirming the caller feels heard.',
  qualification:
    'Ask structured qualification questions (need, timeline, authority, budget signals). Score fit and route or book only when criteria are met.',
  receptionist:
    'Greet warmly, identify intent quickly, route or schedule accurately, and keep calls concise while remaining helpful.',
}

const TONE_GUIDANCE = {
  professional:
    'Use polished, concise, business-appropriate language. Avoid slang and stay measured.',
  friendly:
    'Be warm and approachable while staying respectful. Light conversational phrasing is fine.',
  energetic:
    'Bring upbeat momentum and confident pacing. Keep sentences active and forward-moving.',
  calm:
    'Speak slowly and reassuringly. Give space for the caller; avoid rushing or pressure.',
}

/** SSML prosody attributes sent to voice pipeline (welcome + pacing hints). */
export const TONE_SSML_PACING = {
  professional: { rate: 'medium', pitch: 'medium' },
  friendly: { rate: 'medium', pitch: '+2st' },
  energetic: { rate: 'fast', pitch: '+4st' },
  calm: { rate: 'slow', pitch: '-2st' },
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function stripAgentConfigHeader(script) {
  if (!script) return ''
  const markerIdx = script.indexOf(SCRIPT_MARKER)
  if (markerIdx === -1) return script.trim()
  return script.slice(markerIdx + SCRIPT_MARKER.length).trimStart()
}

export function buildSystemPrompt({ script, agent_type, tone }) {
  const typeKey = agent_type || 'sales'
  const toneKey = tone || 'professional'
  const typeLabel = AGENT_TYPE_LABELS[typeKey] || typeKey
  const toneLabel = TONE_LABELS[toneKey] || toneKey
  const typeGuide = AGENT_TYPE_GUIDANCE[typeKey] || AGENT_TYPE_GUIDANCE.sales
  const toneGuide = TONE_GUIDANCE[toneKey] || TONE_GUIDANCE.professional
  const body = stripAgentConfigHeader(script)

  return [
    CONFIG_MARKER,
    `Agent type: ${typeLabel}`,
    `Tone: ${toneLabel}`,
    '',
    'ROLE GUIDANCE',
    typeGuide,
    '',
    'TONE GUIDANCE',
    toneGuide,
    '',
    SCRIPT_MARKER,
    body,
  ].join('\n')
}

export function wrapWelcomeWithSsml(text, tone) {
  const trimmed = text?.trim()
  if (!trimmed) return null
  const pacing = TONE_SSML_PACING[tone] || TONE_SSML_PACING.professional
  return `<speak><prosody rate="${pacing.rate}" pitch="${pacing.pitch}">${escapeXml(trimmed)}</prosody></speak>`
}

/**
 * Applies system prompt + SSML metadata before DB insert/update and webhook dispatch.
 * Strips client-supplied model; uses INBOUND_AGENT_MODEL when set.
 */
export function enrichAgentPayload(agentData, existing = null) {
  const agent_type = agentData.agent_type ?? existing?.agent_type ?? 'sales'
  const tone = agentData.tone ?? existing?.tone ?? 'professional'
  const rawScript = agentData.script !== undefined ? agentData.script : existing?.script
  const welcomePlain =
    agentData.welcome_message !== undefined
      ? agentData.welcome_message
      : existing?.welcome_message

  const script = buildSystemPrompt({ script: rawScript, agent_type, tone })
  const welcome_ssml = wrapWelcomeWithSsml(welcomePlain, tone)
  const ssml_pacing = TONE_SSML_PACING[tone] || TONE_SSML_PACING.professional

  const { model: _clientModel, ...rest } = agentData

  const metadata = {
    ...(existing?.metadata || {}),
    ...(agentData.metadata || {}),
    welcome_ssml,
    ssml_pacing,
    agent_type,
    tone,
  }

  const enriched = {
    ...rest,
    agent_type,
    tone,
    script,
    metadata,
  }

  const serverModel = process.env.INBOUND_AGENT_MODEL
  if (serverModel) {
    enriched.model = serverModel
  }

  return enriched
}
