-- 31: access_requests table for landing page waitlist/contact form

CREATE TABLE IF NOT EXISTS public.access_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  company      text,
  employees    text,
  phone        text,
  email        text,
  interest     text,
  status       text NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_requests_status ON public.access_requests (status);
CREATE INDEX IF NOT EXISTS idx_access_requests_created_at ON public.access_requests (created_at DESC);
