-- 03: INBOUND — agents & phone numbers
-- Snapshot aligned with live Supabase

CREATE TABLE inbound.agents (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       uuid REFERENCES public.organizations(id),
  name                  text NOT NULL,
  vapi_id               text,
  voice_persona         text,
  script                text,
  status                text NOT NULL DEFAULT 'activating',
  is_paused             boolean NOT NULL DEFAULT false,
  metadata              jsonb NOT NULL DEFAULT '{}',
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz,
  company_name          text,
  website_url           text,
  goal                  text,
  background            text,
  welcome_message       text,
  instruction_voice     text,
  language              text,
  agent_type            text,
  tone                  text,
  model                 text,
  conversation_agent_link text,
  user_id               uuid REFERENCES public.profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_agents_organization_id ON inbound.agents (organization_id)
  WHERE deleted_at IS NULL;

CREATE TABLE inbound.phone_numbers (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id          uuid REFERENCES public.organizations(id),
  phone_number             text NOT NULL,
  provider                 inbound.phone_provider NOT NULL,
  country_code             char(2),
  label                    text,
  agent_id                 uuid REFERENCES inbound.agents(id),
  port_requested           boolean NOT NULL DEFAULT false,
  port_status              text,
  status                   text NOT NULL DEFAULT 'pending',
  created_at               timestamptz NOT NULL DEFAULT now(),
  user_id                  uuid REFERENCES public.profiles(id),
  vapi_sip_id              text,
  account_id               text,
  metadata                 jsonb DEFAULT '{}'::jsonb,
  phone_number_id          text,
  tool_id                  text,
  call_forwarding_enabled  boolean DEFAULT false,
  call_forwarding_number   text,
  call_forwarding_reason   text,
  CONSTRAINT phone_numbers_phone_number_key UNIQUE (phone_number),
  CONSTRAINT phone_numbers_agent_id_key UNIQUE (agent_id)
);

CREATE INDEX IF NOT EXISTS idx_phone_numbers_organization_id ON inbound.phone_numbers (organization_id);

-- FK from sp_sub_deals.agent_id → inbound.agents (created after agents exist)
ALTER TABLE public.sp_sub_deals
  ADD CONSTRAINT sp_sub_deals_agent_id_fkey
  FOREIGN KEY (agent_id) REFERENCES inbound.agents(id) ON DELETE CASCADE;
