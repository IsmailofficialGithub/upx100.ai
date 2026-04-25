-- 02: CORE TABLES (Organizations & Profiles)

CREATE TABLE public.organizations (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  country_code char(2) NOT NULL DEFAULT 'US',   -- US | GB
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id),

  email           text NOT NULL,
  full_name       text,
  role            public.user_role NOT NULL DEFAULT 'client_sub',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON public.profiles (organization_id);
