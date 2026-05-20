-- GCC direct script edits: service-role only (no client write path via RLS)

ALTER TABLE inbound.script_audit_log ENABLE ROW LEVEL SECURITY;
