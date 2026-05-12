-- 04: INBOUND — call logs & leads
-- Snapshot aligned with live Supabase (nullable orgs; no FK org on call_logs)

CREATE TABLE inbound.call_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid,
  agent_id         uuid REFERENCES inbound.agents(id) ON DELETE SET NULL,
  phone_number_id  uuid REFERENCES inbound.phone_numbers(id),
  vapi_call_id     text,
  caller_number    text,
  status           inbound.call_status NOT NULL DEFAULT 'in_progress'::inbound.call_status,
  duration_sec     real NOT NULL,
  cost             numeric NOT NULL DEFAULT 0,
  recording_url    text,
  transcript       text,
  summary          text,
  is_lead          boolean NOT NULL DEFAULT false,
  started_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  ended_at         timestamptz,
  called_number    text,
  user_id          uuid
);

CREATE INDEX IF NOT EXISTS idx_call_logs_org_created ON inbound.call_logs (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_agent_id ON inbound.call_logs (agent_id);

CREATE TABLE inbound.leads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid,
  call_log_id      uuid,
  agent_id         uuid REFERENCES inbound.agents(id),
  name             text,
  email            text,
  phone            text,
  status           inbound.lead_status NOT NULL DEFAULT 'new'::inbound.lead_status,
  crm_type         inbound.crm_type,
  crm_sync         inbound.crm_sync NOT NULL DEFAULT 'pending'::inbound.crm_sync,
  notes            text,
  meeting_time     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  user_id          uuid,
  meeting_date     text,
  meeting_timezone text
);

CREATE INDEX IF NOT EXISTS idx_leads_org_created ON inbound.leads (organization_id, created_at DESC);
