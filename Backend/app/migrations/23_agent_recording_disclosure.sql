-- AI/recording disclosure toggle per agent (sent to voice webhook when enabled).

ALTER TABLE inbound.agents
  ADD COLUMN IF NOT EXISTS recording_disclosure_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN inbound.agents.recording_disclosure_enabled IS
  'When true, play RECORDING_DISCLOSURE_MESSAGE at call start; webhook sends empty string when false.';
