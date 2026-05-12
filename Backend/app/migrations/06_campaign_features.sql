-- 06: INBOUND — campaign pause, scripts, uploads, voice clones
-- (Runs before RLS policies.) Snapshot aligned with live Supabase.

CREATE TABLE inbound.campaign_pause_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     uuid REFERENCES inbound.agents(id),
  actioned_by  uuid NOT NULL REFERENCES public.profiles(id),
  action       text NOT NULL,
  reason       text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campaign_pause_log_action_check CHECK (action = ANY (ARRAY['pause'::text, 'resume'::text]))
);

CREATE TABLE inbound.script_change_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  agent_id        uuid REFERENCES inbound.agents(id),
  user_id         uuid NOT NULL REFERENCES public.profiles(id),
  reviewed_by     uuid REFERENCES public.profiles(id),
  script_text     text NOT NULL,
  status          public.script_request_status NOT NULL DEFAULT 'pending'::public.script_request_status,
  rejection_note  text,
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  reviewed_at     timestamptz,
  campaign_type   text NOT NULL DEFAULT 'inbound'::text,
  created_at      timestamptz
);

CREATE TABLE inbound.target_account_uploads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  user_id         uuid NOT NULL REFERENCES public.profiles(id),
  reviewed_by     uuid REFERENCES public.profiles(id),
  file_url        text NOT NULL,
  row_count       integer,
  status          public.upload_status NOT NULL DEFAULT 'pending_review'::public.upload_status,
  rejection_note  text,
  uploaded_at     timestamptz NOT NULL DEFAULT now(),
  reviewed_at     timestamptz,
  created_at      timestamptz
);

CREATE TABLE inbound.voice_clone_submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  user_id         uuid NOT NULL REFERENCES public.profiles(id),
  reviewed_by     uuid REFERENCES public.profiles(id),
  deployed_by     uuid REFERENCES public.profiles(id),
  agent_id        uuid REFERENCES inbound.agents(id),
  sample_url      text NOT NULL,
  status          public.voice_clone_status NOT NULL DEFAULT 'submitted'::public.voice_clone_status,
  rejection_note  text,
  submitted_at    timestamptz NOT NULL DEFAULT now(),
  reviewed_at     timestamptz,
  deployed_at     timestamptz
);

CREATE INDEX IF NOT EXISTS idx_target_account_uploads_org ON inbound.target_account_uploads (organization_id);
CREATE INDEX IF NOT EXISTS idx_script_change_requests_org ON inbound.script_change_requests (organization_id);
CREATE INDEX IF NOT EXISTS idx_voice_clone_submissions_org ON inbound.voice_clone_submissions (organization_id);
