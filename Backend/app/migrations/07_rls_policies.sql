-- 07: RLS & helper functions
-- Snapshot aligned with live Supabase (MCP pg_policies + relrowsecurity).
-- Note: public.organizations and public.profiles have RLS disabled in the current project;
--       profiles still has policies defined (inactive until RLS is enabled).

ALTER TABLE public.organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

ALTER TABLE public.sp_client_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sp_sub_deals ENABLE ROW LEVEL SECURITY;

ALTER TABLE inbound.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.script_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.voice_clone_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.campaign_pause_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbound.target_account_uploads ENABLE ROW LEVEL SECURITY;

-- Helpers (SECURITY DEFINER — same definitions as production)
CREATE OR REPLACE FUNCTION public.my_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.my_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Profiles (policies present; RLS off on table in prod — enable RLS to activate)
CREATE POLICY profiles_read_v2 ON public.profiles
  FOR SELECT USING (
    (auth.uid() = id)
    OR ((organization_id IS NOT NULL) AND (organization_id = public.my_org_id()))
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
    OR (
      (public.my_role() = 'sp_primary'::public.user_role)
      AND (organization_id IN (
        SELECT sp_client_assignments.client_org_id
        FROM public.sp_client_assignments
        WHERE sp_client_assignments.sp_user_id = auth.uid()
      ))
    )
  );

CREATE POLICY profiles_write_v2 ON public.profiles
  FOR ALL USING (
    (public.my_role() = 'gcc_admin'::public.user_role)
    OR ((auth.uid() = id) AND (role = role))
  );

-- Inbound.agents
CREATE POLICY agents_read ON inbound.agents
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (user_id = auth.uid())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

CREATE POLICY agents_write ON inbound.agents
  FOR ALL
  USING (
    (organization_id = public.my_org_id())
    OR (user_id = auth.uid())
    OR (public.my_role() = 'gcc_admin'::public.user_role)
  )
  WITH CHECK (
    (organization_id = public.my_org_id())
    OR (user_id = auth.uid())
    OR (public.my_role() = 'gcc_admin'::public.user_role)
  );

-- Phone numbers
CREATE POLICY numbers_read ON inbound.phone_numbers
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (user_id = auth.uid())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

CREATE POLICY numbers_write ON inbound.phone_numbers
  FOR ALL
  USING (
    (organization_id = public.my_org_id())
    OR (user_id = auth.uid())
    OR (public.my_role() = 'gcc_admin'::public.user_role)
  )
  WITH CHECK (
    (organization_id = public.my_org_id())
    OR (user_id = auth.uid())
    OR (public.my_role() = 'gcc_admin'::public.user_role)
  );

-- Call logs
CREATE POLICY call_logs_read ON inbound.call_logs
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

CREATE POLICY call_logs_insert ON inbound.call_logs
  FOR INSERT WITH CHECK (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
  );

-- Leads
CREATE POLICY leads_read ON inbound.leads
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

CREATE POLICY leads_write ON inbound.leads
  FOR ALL USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
  );

-- Notifications
CREATE POLICY notifications_own ON inbound.notifications
  FOR ALL USING (user_id = auth.uid());

-- Script change requests
CREATE POLICY script_req_read ON inbound.script_change_requests
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

CREATE POLICY script_req_insert ON inbound.script_change_requests
  FOR INSERT WITH CHECK (
    (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role, 'sp_primary'::public.user_role, 'client_admin'::public.user_role]))
    AND (organization_id = public.my_org_id())
  );

CREATE POLICY script_req_review ON inbound.script_change_requests
  FOR UPDATE USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
  );

-- Target account uploads
CREATE POLICY uploads_read ON inbound.target_account_uploads
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

CREATE POLICY uploads_insert ON inbound.target_account_uploads
  FOR INSERT WITH CHECK (
    (public.my_role() = ANY (ARRAY['client_admin'::public.user_role, 'gcc_admin'::public.user_role]))
    AND (organization_id = public.my_org_id())
  );

CREATE POLICY uploads_review ON inbound.target_account_uploads
  FOR UPDATE USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
  );

-- Voice clone submissions
CREATE POLICY voice_clone_read ON inbound.voice_clone_submissions
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

CREATE POLICY voice_clone_insert ON inbound.voice_clone_submissions
  FOR INSERT WITH CHECK (
    (public.my_role() = ANY (ARRAY['client_sub'::public.user_role, 'gcc_admin'::public.user_role]))
    AND (organization_id = public.my_org_id())
  );

CREATE POLICY voice_clone_review ON inbound.voice_clone_submissions
  FOR UPDATE USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role, 'client_admin'::public.user_role])
  );

-- Campaign pause log
CREATE POLICY pause_log_read ON inbound.campaign_pause_log
  FOR SELECT USING (
    (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
    OR (EXISTS (
      SELECT 1 FROM inbound.agents a
      WHERE a.id = campaign_pause_log.agent_id AND a.organization_id = public.my_org_id()
    ))
  );

CREATE POLICY pause_log_insert ON inbound.campaign_pause_log
  FOR INSERT WITH CHECK (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'client_admin'::public.user_role])
  );
