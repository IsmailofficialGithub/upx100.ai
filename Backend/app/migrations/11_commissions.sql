-- 11: SP commission earnings (per client org / billing period)
-- Apply in Supabase SQL Editor (or local Postgres) on top of migrations 01–09.
-- From Backend folder (requires DATABASE_URL in .env): npm run db:commissions
-- Idempotent: safe to re-run; seed uses ON CONFLICT DO NOTHING.

CREATE TABLE IF NOT EXISTS public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sp_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  period text NOT NULL,
  collected_mrr numeric(14, 2) NOT NULL,
  rate numeric(7, 2) NOT NULL,
  amount numeric(14, 2) NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'at_risk'::text])),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT commissions_sp_org_period UNIQUE (sp_user_id, organization_id, period)
);

CREATE INDEX IF NOT EXISTS idx_commissions_sp_user_id ON public.commissions (sp_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_organization_id ON public.commissions (organization_id);

ALTER TABLE public.commissions DISABLE ROW LEVEL SECURITY;

-- Demo rows: tie to first sp_primary and up to two client orgs (not the SP’s own org).
DO $$
DECLARE
  spid uuid;
  sporg uuid;
  crecord record;
  seeded int := 0;
BEGIN
  SELECT id, organization_id INTO spid, sporg
  FROM public.profiles
  WHERE role = 'sp_primary'
  ORDER BY created_at
  LIMIT 1;

  IF spid IS NULL THEN
    RAISE NOTICE 'commissions seed skipped: no sp_primary profile';
    RETURN;
  END IF;

  FOR crecord IN
    SELECT id AS client_org_id
    FROM public.organizations
    WHERE id IS DISTINCT FROM sporg
    ORDER BY created_at
    LIMIT 2
  LOOP
    seeded := seeded + 1;
    INSERT INTO public.sp_client_assignments (sp_user_id, client_org_id)
    VALUES (spid, crecord.client_org_id)
    ON CONFLICT (sp_user_id, client_org_id) DO NOTHING;

    INSERT INTO public.commissions (sp_user_id, organization_id, period, collected_mrr, rate, amount, status, created_at)
    VALUES
      (spid, crecord.client_org_id, 'June 2026', 18250, 20, 3650, 'pending', '2026-06-01 12:00:00+00'),
      (spid, crecord.client_org_id, 'May 2026', 15420, 20, 3084, 'paid', '2026-05-01 12:00:00+00'),
      (spid, crecord.client_org_id, 'April 2026', 12100, 18, 2178, 'paid', '2026-04-01 12:00:00+00'),
      (spid, crecord.client_org_id, 'March 2026', 9800, 18, 1764, 'at_risk', '2026-03-01 12:00:00+00')
    ON CONFLICT (sp_user_id, organization_id, period) DO NOTHING;
  END LOOP;

  IF seeded = 0 THEN
    RAISE NOTICE 'commissions seed skipped: no client organizations distinct from sp_primary.organization_id';
  END IF;
END $$;
