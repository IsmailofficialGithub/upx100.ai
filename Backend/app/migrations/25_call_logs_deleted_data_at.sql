-- When participant data is marked deleted, record the timestamp for compliance elapsed time.

ALTER TABLE inbound.call_logs
  ADD COLUMN IF NOT EXISTS deleted_data_at timestamptz;

COMMENT ON COLUMN inbound.call_logs.deleted_data_at IS
  'Set when is_deleted_data becomes true; used for erasure compliance elapsed time.';

UPDATE inbound.call_logs
SET deleted_data_at = COALESCE(ended_at, created_at, now())
WHERE is_deleted_data = true
  AND deleted_data_at IS NULL;

CREATE OR REPLACE FUNCTION inbound.trg_call_logs_deleted_data_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_deleted_data IS TRUE
     AND (TG_OP = 'INSERT' OR OLD.is_deleted_data IS DISTINCT FROM TRUE) THEN
    NEW.deleted_data_at := COALESCE(NEW.deleted_data_at, now());
  ELSIF NEW.is_deleted_data IS FALSE THEN
    NEW.deleted_data_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS call_logs_deleted_data_at ON inbound.call_logs;
CREATE TRIGGER call_logs_deleted_data_at
  BEFORE INSERT OR UPDATE OF is_deleted_data ON inbound.call_logs
  FOR EACH ROW
  EXECUTE FUNCTION inbound.trg_call_logs_deleted_data_at();

DROP VIEW IF EXISTS public.view_call_logs;

CREATE VIEW public.view_call_logs AS
SELECT
  cl.id,
  COALESCE(cl.organization_id, a.organization_id) AS organization_id,
  cl.organization_id AS call_organization_id,
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
  cl.deleted_data_at,
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
LEFT JOIN inbound.agents a ON cl.agent_id = a.id
LEFT JOIN public.organizations org ON org.id = COALESCE(cl.organization_id, a.organization_id);
