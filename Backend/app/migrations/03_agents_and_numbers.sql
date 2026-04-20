-- 03: INBOUND ASSETS (Agents & Phone Numbers)

CREATE TABLE inbound.agents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  name            text NOT NULL,
  vapi_id         text,                          -- external VAPI ref
  voice_persona   text,
  script          text,
  status          text NOT NULL DEFAULT 'activating',
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz                    -- soft delete
);

CREATE INDEX ON inbound.agents (organization_id) WHERE deleted_at IS NULL;

CREATE TABLE inbound.phone_numbers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  phone_number    text NOT NULL UNIQUE,
  provider        inbound.phone_provider NOT NULL,
  country_code    char(2),
  label           text,
  agent_id        uuid REFERENCES inbound.agents(id),
  port_requested  boolean NOT NULL DEFAULT false,
  port_status     text,                          -- pending | approved | complete
  status          text NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON inbound.phone_numbers (organization_id);
