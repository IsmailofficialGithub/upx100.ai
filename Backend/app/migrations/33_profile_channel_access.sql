-- Channel access: which call directions a user may see (inbound / outbound).
-- Existing users default to both enabled. GCC roles always have full access in app logic.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS can_inbound boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS can_outbound boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.can_inbound IS
  'When false, user cannot see inbound agents/call logs. GCC roles ignore this flag.';

COMMENT ON COLUMN public.profiles.can_outbound IS
  'When false, user cannot see outbound agents/targets/campaigns/call logs. GCC roles ignore this flag.';

-- At least one channel must remain enabled
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_channel_access_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_channel_access_check
  CHECK (can_inbound OR can_outbound);
