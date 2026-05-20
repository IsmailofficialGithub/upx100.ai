-- Expose call direction on view_call_logs (required for inbound/outbound UI filters)
-- CREATE OR REPLACE cannot insert columns before existing ones (42P16); drop and recreate.

DROP VIEW IF EXISTS public.view_call_logs;

CREATE VIEW public.view_call_logs AS
SELECT
  cl.id,
  cl.organization_id,
  cl.agent_id,
  cl.phone_number_id,
  cl.vapi_call_id,
  cl.caller_number,
  cl.status,
  cl.duration_sec,
  cl.cost,
  cl.recording_url,
  cl.transcript,
  cl.summary,
  cl.is_lead,
  cl.started_at,
  cl.created_at,
  cl.ended_at,
  cl.called_number,
  cl.user_id,
  org.name AS organization_name,
  a.name AS agent_name,
  cl.call_type,
  cl.call_direction
FROM inbound.call_logs cl
LEFT JOIN organizations org ON cl.organization_id = org.id
LEFT JOIN inbound.agents a ON cl.agent_id = a.id;
