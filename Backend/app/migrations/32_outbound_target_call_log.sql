-- Link completed outbound dials to call_logs (one latest log per target).

ALTER TABLE inbound.outbound_targets
  ADD COLUMN IF NOT EXISTS call_log_id uuid REFERENCES inbound.call_logs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_outbound_targets_call_log_id
  ON inbound.outbound_targets (call_log_id)
  WHERE call_log_id IS NOT NULL;

COMMENT ON COLUMN inbound.outbound_targets.call_log_id IS
  'Latest call_logs row for this dial target (call_type = outbound).';
