-- 02: PUBLIC CORE — organizations, profiles, SP routing
-- Snapshot aligned with live Supabase (MCP list_tables / information_schema)

CREATE TABLE public.organizations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  country_code char(2) NOT NULL DEFAULT 'US',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id),
  email           text NOT NULL,
  full_name       text,
  role            public.user_role NOT NULL DEFAULT 'client_sub',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_email_key UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles (organization_id);

-- SP primary ↔ client org assignments
CREATE TABLE public.sp_client_assignments (
  sp_user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  assigned_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (sp_user_id, client_org_id)
);

-- SP sub ↔ client org ↔ agent (deal routing)
CREATE TABLE public.sp_sub_deals (
  sp_sub_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_org_id  uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  agent_id       uuid NOT NULL,
  assigned_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (sp_sub_user_id, client_org_id, agent_id)
);
