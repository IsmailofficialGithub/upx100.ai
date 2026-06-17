/** Shown in Recent Communications when the API returns zero call logs. */
export const CALL_LOGS_EMPTY_MESSAGE =
  'No call logs yet. Completed calls appear here after your telephony provider sends the Vapi call-ended webhook with X-Vapi-Secret. Ensure each assistant passes organization_id or agent_id in call metadata so rows can be attributed (see server logs if empty).';
