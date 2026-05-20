-- Phone line assignment: one agent per line, many lines per client org, no cross-client sharing.

-- Optional submitter profile link (fixes PostgREST embed phone_numbers_profiles_fkey when missing).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'phone_numbers_profiles_fkey'
  ) THEN
    ALTER TABLE inbound.phone_numbers
      ADD CONSTRAINT phone_numbers_profiles_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Resolve duplicate agent assignments before unique(agent_id) is relied on (keep newest binding).
UPDATE inbound.phone_numbers pn
SET agent_id = NULL
WHERE agent_id IS NOT NULL
  AND id NOT IN (
    SELECT DISTINCT ON (agent_id) id
    FROM inbound.phone_numbers
    WHERE agent_id IS NOT NULL
    ORDER BY agent_id, created_at DESC NULLS LAST, id DESC
  );

CREATE INDEX IF NOT EXISTS idx_phone_numbers_agent_id
  ON inbound.phone_numbers (agent_id)
  WHERE agent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_phone_numbers_org_unassigned
  ON inbound.phone_numbers (organization_id)
  WHERE agent_id IS NULL;
