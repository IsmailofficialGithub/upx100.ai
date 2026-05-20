-- GCC direct script edits (immediate save, audit trail per client org)
CREATE TABLE IF NOT EXISTS inbound.script_audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  agent_id        uuid NOT NULL REFERENCES inbound.agents(id),
  actor_id        uuid NOT NULL REFERENCES public.profiles(id),
  action          text NOT NULL DEFAULT 'script_updated',
  campaign_type   text,
  previous_script text,
  new_script      text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_script_audit_log_org
  ON inbound.script_audit_log (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_script_audit_log_agent
  ON inbound.script_audit_log (agent_id, created_at DESC);
