-- 03: INBOUND ASSETS (Agents & Phone Numbers)


CREATE OR REPLACE TABLE inbound.agents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  name            text NOT NULL,
  vapi_id         text,                          -- external VAPI ref
  voice_persona   text,
  script          text,
  status          text NOT NULL DEFAULT 'activating',
  company_name    text,
  website_url     text,
  goal            text,
  background      text,
  welcome_message text,
  instruction_voice text,
  language        text,
  agent_type      text,
  tone            text,
  model           text,
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz                    -- soft delete
);

CREATE INDEX IF NOT EXISTS ON inbound.agents (organization_id) WHERE deleted_at IS NULL;

CREATE OR REPLACE TABLE inbound.phone_numbers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NULL REFERENCES public.organizations(id),
  phone_number    text NOT NULL UNIQUE,
  provider        inbound.phone_provider NOT NULL,
  country_code    char(2),
  label           text,
  agent_id        uuid REFERENCES inbound.agents(id),
  port_requested  boolean NOT NULL DEFAULT false,
  port_status     text,                          -- pending | approved | complete
  tool_id         text,
  phone_number_id text,
  call_forwarding_enabled boolean NOT NULL DEFAULT false,
  call_forwarding_number text,
  call_forwarding_reason text,
  status          text NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON inbound.phone_numbers (organization_id);
