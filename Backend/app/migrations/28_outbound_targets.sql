-- 28: OUTBOUND TARGETS — table to store outbound campaign phone numbers/leads
CREATE TABLE IF NOT EXISTS inbound.outbound_targets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  agent_id        uuid REFERENCES inbound.agents(id) ON DELETE SET NULL,
  name            text,
  phone           text NOT NULL,
  email           text,
  status          text NOT NULL DEFAULT 'outbound',
  created_at      timestamptz NOT NULL DEFAULT now(),
  user_id         uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_outbound_targets_org_created 
  ON inbound.outbound_targets (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_outbound_targets_agent 
  ON inbound.outbound_targets (agent_id);
