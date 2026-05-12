-- =============================================================================
-- 10: REMINDER / REMOTE HOTFIX (run manually in Supabase SQL Editor when needed)
-- =============================================================================
-- Context: Repo migrations 01–09 describe the full public + inbound snapshot.
-- They are NOT auto-applied to your hosted project from this codebase.
-- Use this file for small, idempotent fixes on an ALREADY-RUNNING database.
-- =============================================================================

-- 1) Dashboard / services filter on deleted_at for phone numbers; add if missing.
ALTER TABLE inbound.phone_numbers
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- 2) Admin stats RPC (was missing on remote when introspected via MCP).
CREATE OR REPLACE FUNCTION public.get_call_status_breakdown()
RETURNS json
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, inbound
AS $$
  SELECT coalesce(
    (SELECT json_agg(row_to_json(s))
     FROM (
       SELECT cl.status::text AS status, count(*)::bigint AS count
       FROM inbound.call_logs cl
       GROUP BY cl.status
       ORDER BY cl.status
     ) s),
    '[]'::json
  );
$$;

-- Optional: grant execute to service role / authenticated as your project requires.
-- GRANT EXECUTE ON FUNCTION public.get_call_status_breakdown() TO service_role;

-- 3) PostgREST embed for script submitter: user_id → profiles (fixes PGRST200 on /api/... script list).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'script_change_requests_user_id_fkey'
  ) THEN
    ALTER TABLE inbound.script_change_requests
      ADD CONSTRAINT script_change_requests_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id);
  END IF;
END
$$;

-- 4) Partner commission earnings: create table + demo seed (see migrations/11_commissions.sql).
-- Run the full contents of Backend/app/migrations/11_commissions.sql when the commissions UI is empty.
