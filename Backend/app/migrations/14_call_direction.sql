-- Store Vapi call direction (inbound vs outbound) on call logs

ALTER TABLE inbound.call_logs
  ADD COLUMN IF NOT EXISTS call_direction text;

COMMENT ON COLUMN inbound.call_logs.call_direction IS 'inbound | outbound — derived from Vapi call.type';

CREATE INDEX IF NOT EXISTS idx_call_logs_direction ON inbound.call_logs (call_direction)
  WHERE call_direction IS NOT NULL;
