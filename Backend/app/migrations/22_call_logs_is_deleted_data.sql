-- Flag call log rows whose participant data was deleted (GDPR / erasure workflows).

ALTER TABLE inbound.call_logs
  ADD COLUMN IF NOT EXISTS is_deleted_data boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN inbound.call_logs.is_deleted_data IS
  'True when associated participant PII was erased; call metadata may remain for audit.';

CREATE INDEX IF NOT EXISTS idx_call_logs_is_deleted_data
  ON inbound.call_logs (is_deleted_data)
  WHERE is_deleted_data = true;

-- Recreate view (CREATE OR REPLACE cannot add columns in the middle — 42P16).
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
  cl.is_deleted_data,
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
