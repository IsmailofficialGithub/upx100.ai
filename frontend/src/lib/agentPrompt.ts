/** Client-safe helpers for agent type / tone (no vendor model names). */

export const CONFIG_MARKER = '=== AGENT CONFIGURATION ===';
export const SCRIPT_MARKER = '=== CALL SCRIPT ===';

const AGENT_TYPE_LABELS: Record<string, string> = {
  sales: 'Sales',
  support: 'Support',
  qualification: 'Lead Qualification',
  receptionist: 'Receptionist',
};

const TONE_LABELS: Record<string, string> = {
  professional: 'Professional',
  friendly: 'Friendly',
  energetic: 'Energetic',
  calm: 'Calm',
};

const AGENT_TYPE_GUIDANCE: Record<string, string> = {
  sales:
    'Prioritize discovery, articulate value, handle objections briefly, and secure a next step.',
  support:
    'Understand the issue, show empathy, resolve or escalate, and confirm the caller feels heard.',
  qualification:
    'Ask structured qualification questions and route or book only when criteria are met.',
  receptionist:
    'Greet warmly, identify intent, route or schedule accurately, and keep calls concise.',
};

const TONE_GUIDANCE: Record<string, string> = {
  professional: 'Polished, concise, business-appropriate language.',
  friendly: 'Warm and approachable while staying respectful.',
  energetic: 'Upbeat momentum and confident, forward-moving pacing.',
  calm: 'Slow, reassuring delivery; avoid rushing the caller.',
};

/** Browser speech preview — mirrors backend SSML pacing intent. */
export const TONE_PREVIEW_RATE: Record<string, number> = {
  professional: 0.95,
  friendly: 1.0,
  energetic: 1.12,
  calm: 0.85,
};

export const TONE_PREVIEW_PITCH: Record<string, number> = {
  professional: 1,
  friendly: 1.05,
  energetic: 1.1,
  calm: 0.92,
};

export function stripAgentConfigHeader(script: string | undefined | null): string {
  if (!script) return '';
  const markerIdx = script.indexOf(SCRIPT_MARKER);
  if (markerIdx === -1) return script.trim();
  return script.slice(markerIdx + SCRIPT_MARKER.length).trimStart();
}

export function agentTypeLabel(type: string): string {
  return AGENT_TYPE_LABELS[type] || type;
}

export function toneLabel(tone: string): string {
  return TONE_LABELS[tone] || tone;
}

export function buildAgentScriptTemplate(input: {
  name: string;
  agent_type: string;
  tone: string;
  industry_vertical?: string;
  goal?: string;
  background?: string;
  instruction_voice?: string;
  welcome_message?: string;
}): string {
  const typeLabel = agentTypeLabel(input.agent_type);
  const toneLbl = toneLabel(input.tone);
  const typeGuide = AGENT_TYPE_GUIDANCE[input.agent_type] || AGENT_TYPE_GUIDANCE.sales;
  const toneGuide = TONE_GUIDANCE[input.tone] || TONE_GUIDANCE.professional;

  const identityLines = [
    'IDENTITY AND MISSION',
    '',
    `Name: ${input.name}`,
    ...(input.industry_vertical ? [`Industry: ${input.industry_vertical}`] : []),
    `Role: ${typeLabel} Agent`,
    `Goal: ${input.goal || ''}`,
    `Background: ${input.background || ''}`,
    '',
    'ROLE GUIDANCE',
    typeGuide,
    '',
    'TONE GUIDANCE',
    `${toneLbl}: ${toneGuide}`,
    '',
    'INSTRUCTIONS',
    input.instruction_voice || '',
    '',
    'WELCOME MESSAGE',
    `"${input.welcome_message || ''}"`,
  ];

  return identityLines.join('\n');
}
