-- ============================================================
-- 06: ROW-LEVEL SECURITY & POLICIES
-- ============================================================

ALTER TABLE public.organizations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.agents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.phone_numbers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.call_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.notifications  ENABLE ROW LEVEL SECURITY;

-- Helpers
CREATE OR REPLACE FUNCTION public.my_org_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.my_role()
RETURNS public.user_role LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Policies
CREATE POLICY "profiles_org_isolation" ON public.profiles FOR ALL USING (organization_id = public.my_org_id());

CREATE POLICY "agents_read" ON inbound.agents FOR SELECT USING (organization_id = public.my_org_id());
CREATE POLICY "agents_write_gcc_admin" ON inbound.agents FOR ALL USING (public.my_role() = 'gcc_admin');

CREATE POLICY "numbers_read" ON inbound.phone_numbers FOR SELECT USING (organization_id = public.my_org_id());
CREATE POLICY "numbers_write_gcc_admin" ON inbound.phone_numbers FOR ALL USING (public.my_role() = 'gcc_admin');

CREATE POLICY "call_logs_org" ON inbound.call_logs FOR SELECT USING (organization_id = public.my_org_id());
CREATE POLICY "call_logs_insert_internal" ON inbound.call_logs FOR INSERT WITH CHECK (public.my_role() IN ('gcc_admin', 'gcc_reviewer'));

CREATE POLICY "leads_org" ON inbound.leads FOR SELECT USING (organization_id = public.my_org_id());
CREATE POLICY "leads_write_gcc" ON inbound.leads FOR ALL USING (public.my_role() IN ('gcc_admin', 'gcc_reviewer'));

CREATE POLICY "notifications_own" ON inbound.notifications FOR ALL USING (user_id = auth.uid());
