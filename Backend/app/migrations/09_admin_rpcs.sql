-- 09: RPCs used by the backend (service role)
-- get_call_status_breakdown was not present in the remote DB when introspected;
-- this definition matches typical admin usage (JSON array of { status, count }).

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
