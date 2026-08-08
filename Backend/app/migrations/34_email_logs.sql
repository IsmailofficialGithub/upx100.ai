-- 34_email_logs.sql
CREATE TABLE IF NOT EXISTS public.email_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  call_log_id     uuid REFERENCES inbound.call_logs(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  subject         text,
  body            text,
  status          text NOT NULL DEFAULT 'sent',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_email_logs_org_created 
  ON public.email_logs (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_logs_call_log 
  ON public.email_logs (call_log_id);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Super admins can view all email logs" 
  ON public.email_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('gcc_admin', 'gcc_reviewer')
    )
  );

CREATE POLICY "Org members can view their org's email logs" 
  ON public.email_logs FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "SP primary can view their clients' email logs" 
  ON public.email_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.sp_client_assignments sca
      WHERE sca.sp_user_id = auth.uid() 
      AND sca.client_org_id = public.email_logs.organization_id
    )
  );

CREATE POLICY "SP sub can view their clients' email logs" 
  ON public.email_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.sp_sub_deals ssd
      WHERE ssd.sp_sub_user_id = auth.uid() 
      AND ssd.client_org_id = public.email_logs.organization_id
    )
  );
