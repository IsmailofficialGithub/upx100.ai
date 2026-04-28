-- 08: CAMPAIGN FEATURES (Pause logs, Script requests, Target uploads)

-- Campaign Pause Logs
CREATE TABLE IF NOT EXISTS public.campaign_pause_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  agent_id        uuid REFERENCES inbound.agents(id),
  user_id         uuid REFERENCES public.profiles(id),
  action          text NOT NULL, -- 'pause', 'resume'
  reason          text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Script Requests
CREATE TABLE IF NOT EXISTS public.script_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  user_id         uuid REFERENCES public.profiles(id),
  script_text     text NOT NULL,
  campaign_type   text NOT NULL, -- 'inbound', 'outbound'
  status          text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  notes           text,
  reviewed_by     uuid REFERENCES public.profiles(id),
  reviewed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Target Uploads
CREATE TABLE IF NOT EXISTS public.target_uploads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  user_id         uuid REFERENCES public.profiles(id),
  file_url        text NOT NULL,
  row_count       integer DEFAULT 0,
  status          text NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'approved', 'rejected', 'deployed'
  reviewed_by     uuid REFERENCES public.profiles(id),
  reviewed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_target_uploads_org ON public.target_uploads (organization_id);
CREATE INDEX IF NOT EXISTS idx_script_requests_org ON public.script_requests (organization_id);

-- Voice Clones
CREATE TABLE IF NOT EXISTS public.voice_clones (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  user_id         uuid REFERENCES public.profiles(id),
  sample_url      text NOT NULL,
  voice_name      text NOT NULL,
  status          text NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'approved', 'rejected'
  reviewed_by     uuid REFERENCES public.profiles(id),
  reviewed_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_clones_org ON public.voice_clones (organization_id);
