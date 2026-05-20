-- 13: Ensure HITL seed/submission rows get real creation timestamps.

UPDATE inbound.script_change_requests
SET created_at = COALESCE(submitted_at, now())
WHERE created_at IS NULL;

ALTER TABLE inbound.script_change_requests
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

UPDATE inbound.target_account_uploads
SET created_at = COALESCE(uploaded_at, now())
WHERE created_at IS NULL;

ALTER TABLE inbound.target_account_uploads
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE inbound.voice_clone_submissions
  ADD COLUMN IF NOT EXISTS created_at timestamptz;

UPDATE inbound.voice_clone_submissions
SET created_at = COALESCE(submitted_at, now())
WHERE created_at IS NULL;

ALTER TABLE inbound.voice_clone_submissions
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;
