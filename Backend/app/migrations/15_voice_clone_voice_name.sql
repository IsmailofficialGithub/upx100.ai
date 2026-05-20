-- Display name and sample duration for voice clone HITL

ALTER TABLE inbound.voice_clone_submissions
  ADD COLUMN IF NOT EXISTS voice_name text,
  ADD COLUMN IF NOT EXISTS duration_sec numeric(6, 2);
