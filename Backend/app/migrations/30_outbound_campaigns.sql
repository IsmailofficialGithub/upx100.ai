-- 30: OUTBOUND CAMPAIGNS — named dialing lists linked to outbound agents
CREATE TABLE IF NOT EXISTS inbound.outbound_campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  agent_id        uuid NOT NULL REFERENCES inbound.agents(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status          text NOT NULL DEFAULT 'active',
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE inbound.outbound_targets
  ADD COLUMN IF NOT EXISTS campaign_id uuid REFERENCES inbound.outbound_campaigns(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_outbound_campaigns_org_created
  ON inbound.outbound_campaigns (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_outbound_campaigns_agent
  ON inbound.outbound_campaigns (agent_id);

CREATE INDEX IF NOT EXISTS idx_outbound_targets_campaign
  ON inbound.outbound_targets (campaign_id);
