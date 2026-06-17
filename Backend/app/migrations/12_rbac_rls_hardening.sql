-- 12: Enable RLS on public core tables + tighten inbound read policies for matrix-aligned access.
-- Run in Supabase SQL Editor after 01–11 (idempotent where possible).

-- -----------------------------------------------------------------------------
-- Public: profiles & organizations
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_read ON public.organizations;
CREATE POLICY organizations_read ON public.organizations
  FOR SELECT USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
    OR id = public.my_org_id()
    OR id IN (
      SELECT c.client_org_id FROM public.sp_client_assignments c WHERE c.sp_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS organizations_write ON public.organizations;
CREATE POLICY organizations_write ON public.organizations
  FOR ALL USING (public.my_role() = 'gcc_admin'::public.user_role)
  WITH CHECK (public.my_role() = 'gcc_admin'::public.user_role);

-- -----------------------------------------------------------------------------
-- Inbound: leads — SP portfolio + client_sub own rows
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS leads_read ON inbound.leads;
CREATE POLICY leads_read ON inbound.leads
  FOR SELECT USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
    OR (
      public.my_role() = 'sp_primary'::public.user_role
      AND organization_id IN (
        SELECT c.client_org_id FROM public.sp_client_assignments c WHERE c.sp_user_id = auth.uid()
      )
    )
    OR (
      public.my_role() = 'sp_sub'::public.user_role
      AND EXISTS (
        SELECT 1 FROM public.sp_sub_deals d
        WHERE d.sp_sub_user_id = auth.uid()
          AND d.client_org_id = leads.organization_id
          AND (leads.agent_id IS NULL OR d.agent_id = leads.agent_id)
      )
    )
    OR (
      organization_id = public.my_org_id()
      AND (
        public.my_role() <> 'client_sub'::public.user_role
        OR leads.user_id IS NULL
        OR leads.user_id = auth.uid()
      )
    )
  );

-- -----------------------------------------------------------------------------
-- Inbound: call_logs — mirror leads / SP sub deals + client_sub own rows
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS call_logs_read ON inbound.call_logs;
CREATE POLICY call_logs_read ON inbound.call_logs
  FOR SELECT USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
    OR (
      public.my_role() = 'sp_primary'::public.user_role
      AND organization_id IN (
        SELECT c.client_org_id FROM public.sp_client_assignments c WHERE c.sp_user_id = auth.uid()
      )
    )
    OR (
      public.my_role() = 'sp_sub'::public.user_role
      AND EXISTS (
        SELECT 1 FROM public.sp_sub_deals d
        WHERE d.sp_sub_user_id = auth.uid()
          AND d.client_org_id = call_logs.organization_id
          AND (call_logs.agent_id IS NULL OR d.agent_id = call_logs.agent_id)
      )
    )
    OR (
      organization_id = public.my_org_id()
      AND (
        public.my_role() <> 'client_sub'::public.user_role
        OR call_logs.user_id IS NULL
        OR call_logs.user_id = auth.uid()
      )
    )
  );
