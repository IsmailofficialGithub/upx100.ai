-- 04: ACTIVITY LOGS (Call Logs & Leads)

CREATE TABLE IF NOT EXISTS inbound.call_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  agent_id        uuid REFERENCES inbound.agents(id),
  phone_number_id uuid REFERENCES inbound.phone_numbers(id),
  vapi_call_id    text,
  caller_number   text,
  status          inbound.call_status NOT NULL DEFAULT 'in_progress',
  duration_sec    integer NOT NULL DEFAULT 0,
  cost            numeric NOT NULL DEFAULT 0,
  recording_url   text,
  transcript      text,
  summary         text,
  is_lead         boolean NOT NULL DEFAULT false,
  started_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_logs_org_created ON inbound.call_logs (organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_agent_id ON inbound.call_logs (agent_id);

CREATE TABLE IF NOT EXISTS inbound.leads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  call_log_id     uuid REFERENCES inbound.call_logs(id),
  agent_id        uuid REFERENCES inbound.agents(id),
  name            text,
  email           text,
  phone           text,
  status          inbound.lead_status NOT NULL DEFAULT 'new',
  crm_type        inbound.crm_type,
  crm_sync        inbound.crm_sync NOT NULL DEFAULT 'pending',
  notes           text,
  meeting_time    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_org_created ON inbound.leads (organization_id, created_at DESC);
