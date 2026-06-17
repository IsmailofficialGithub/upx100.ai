-- Call logs without organization_id still belong to the agent's client org.

-- Backfill existing rows
UPDATE inbound.call_logs cl
SET organization_id = a.organization_id
FROM inbound.agents a
WHERE cl.organization_id IS NULL
  AND cl.agent_id = a.id
  AND a.organization_id IS NOT NULL;

-- List/report via resolved org (call row OR assigned agent)
DROP VIEW IF EXISTS public.view_call_logs;

CREATE VIEW public.view_call_logs AS
SELECT
  cl.id,
  COALESCE(cl.organization_id, a.organization_id) AS organization_id,
  cl.organization_id AS call_organization_id,
  cl.agent_id,
  cl.phone_number_id,
  cl.vapi_call_id,
  cl.caller_number,
  cl.status,
  cl.duration_sec,
  cl.cost,
  cl.recording_url,
  cl.transcript,
  cl.summary,
  cl.is_lead,
  cl.is_deleted_data,
  cl.started_at,
  cl.created_at,
  cl.ended_at,
  cl.called_number,
  cl.user_id,
  org.name AS organization_name,
  a.name AS agent_name,
  cl.call_type,
  cl.call_direction
FROM inbound.call_logs cl
LEFT JOIN inbound.agents a ON cl.agent_id = a.id
LEFT JOIN public.organizations org ON org.id = COALESCE(cl.organization_id, a.organization_id);

-- RLS: allow read when org matches call row OR agent's org (for legacy null org_id rows)
DROP POLICY IF EXISTS call_logs_read ON inbound.call_logs;

CREATE POLICY call_logs_read ON inbound.call_logs
  FOR SELECT USING (
    public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role])
    OR (
      public.my_role() = 'sp_primary'::public.user_role
      AND (
        organization_id IN (
          SELECT c.client_org_id FROM public.sp_client_assignments c WHERE c.sp_user_id = auth.uid()
        )
        OR (
          organization_id IS NULL
          AND agent_id IN (
            SELECT a.id
            FROM inbound.agents a
            WHERE a.organization_id IN (
              SELECT c.client_org_id FROM public.sp_client_assignments c WHERE c.sp_user_id = auth.uid()
            )
          )
        )
      )
    )
    OR (
      public.my_role() = 'sp_sub'::public.user_role
      AND EXISTS (
        SELECT 1 FROM public.sp_sub_deals d
        INNER JOIN inbound.agents a ON a.id = call_logs.agent_id
        WHERE d.sp_sub_user_id = auth.uid()
          AND d.client_org_id = COALESCE(call_logs.organization_id, a.organization_id)
          AND (call_logs.agent_id IS NULL OR d.agent_id = call_logs.agent_id)
      )
    )
    OR (
      (
        organization_id = public.my_org_id()
        OR (
          organization_id IS NULL
          AND agent_id IN (
            SELECT a.id FROM inbound.agents a WHERE a.organization_id = public.my_org_id()
          )
        )
      )
      AND (
        public.my_role() <> 'client_sub'::public.user_role
        OR call_logs.user_id IS NULL
        OR call_logs.user_id = auth.uid()
      )
    )
  );
