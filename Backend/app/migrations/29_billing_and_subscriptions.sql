-- 29: BILLING & SUBSCRIPTIONS

-- ============================================================================
-- 1. Create Tables
-- ============================================================================

-- Table A: Subscription Packages (Pricing / Tiers / Limits)
CREATE TABLE public.subscription_packages (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                      text NOT NULL,
  description               text,
  stripe_product_id         text UNIQUE,
  stripe_price_id           text UNIQUE,
  amount_cents              integer NOT NULL DEFAULT 0,
  currency                  char(3) NOT NULL DEFAULT 'usd',
  interval                  text NOT NULL DEFAULT 'month',
  max_inbound_phone_numbers  integer NOT NULL DEFAULT 1,
  max_outbound_phone_numbers integer NOT NULL DEFAULT 1,
  max_agents                integer NOT NULL DEFAULT 1,
  allow_voice_cloning       boolean NOT NULL DEFAULT false,
  max_lead_upload_rows      integer NOT NULL DEFAULT 100,
  additional_features       jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active                 boolean NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

-- Table B: Subscriptions
CREATE TABLE public.subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id        uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  package_id             uuid REFERENCES public.subscription_packages(id) ON DELETE SET NULL,
  stripe_customer_id     text UNIQUE,
  stripe_subscription_id text UNIQUE,
  status                 text NOT NULL DEFAULT 'incomplete',
  stripe_price_id        text,
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_organization_subscription UNIQUE (organization_id)
);

-- Table C: Billing Invoices
CREATE TABLE public.billing_invoices (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id        uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  stripe_invoice_id      text NOT NULL UNIQUE,
  stripe_subscription_id text,
  stripe_charge_id       text,
  amount_cents           integer NOT NULL,
  amount_paid_cents      integer NOT NULL DEFAULT 0,
  currency               char(3) NOT NULL DEFAULT 'usd',
  status                 text NOT NULL,
  billing_reason         text,
  invoice_pdf_url        text,
  paid_at                timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- Table D: Payment Methods (Card Cache)
CREATE TABLE public.payment_methods (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id          uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  stripe_payment_method_id text NOT NULL UNIQUE,
  card_brand               text NOT NULL,
  card_last4               char(4) NOT NULL,
  card_exp_month           integer NOT NULL,
  card_exp_year            integer NOT NULL,
  is_default               boolean NOT NULL DEFAULT false,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- Table E: Stripe Webhook Logs
CREATE TABLE public.stripe_webhook_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id  text NOT NULL UNIQUE,
  event_type       text NOT NULL,
  payload          jsonb NOT NULL,
  status           text NOT NULL DEFAULT 'pending',
  error_message    text,
  processed_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. Indexes
-- ============================================================================
CREATE INDEX idx_packages_stripe_price ON public.subscription_packages (stripe_price_id) WHERE stripe_price_id IS NOT NULL;
CREATE INDEX idx_subscriptions_org_id ON public.subscriptions (organization_id);
CREATE INDEX idx_invoices_organization_id ON public.billing_invoices (organization_id);
CREATE INDEX idx_invoices_stripe_id ON public.billing_invoices (stripe_invoice_id);
CREATE INDEX idx_payment_methods_organization ON public.payment_methods (organization_id);
CREATE INDEX idx_webhook_logs_event_id ON public.stripe_webhook_logs (stripe_event_id);
CREATE INDEX idx_webhook_logs_status ON public.stripe_webhook_logs (status);

-- ============================================================================
-- 3. Row Level Security (RLS) & Policies
-- ============================================================================
ALTER TABLE public.subscription_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policies for Packages: Anyone authenticated can read active packages
CREATE POLICY packages_read ON public.subscription_packages
  FOR SELECT USING (is_active = true);

-- Policies for Subscriptions: Read-only for organization members or admin roles
CREATE POLICY subscriptions_read ON public.subscriptions
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

-- Policies for Invoices: Read-only for organization members or admin roles
CREATE POLICY invoices_read ON public.billing_invoices
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

-- Policies for Payment Methods: Read-only for organization members or admin roles
CREATE POLICY payment_methods_read ON public.payment_methods
  FOR SELECT USING (
    (organization_id = public.my_org_id())
    OR (public.my_role() = ANY (ARRAY['gcc_admin'::public.user_role, 'gcc_reviewer'::public.user_role]))
  );

-- Note: Stripe Webhook Logs have no public policies since they are only manipulated by backend workers/services.

-- ============================================================================
-- 4. Initial Seed Data
-- ============================================================================
INSERT INTO public.subscription_packages (
  name, 
  description, 
  stripe_product_id, 
  stripe_price_id, 
  amount_cents, 
  max_inbound_phone_numbers, 
  max_outbound_phone_numbers, 
  max_agents, 
  allow_voice_cloning, 
  max_lead_upload_rows
) VALUES 
(
  'Free', 
  'Basic testing tier', 
  NULL, 
  NULL, 
  0, 
  1, 
  1, 
  1, 
  false, 
  100
),
(
  'Pro', 
  'For growing teams', 
  NULL, 
  NULL, 
  4900, 
  5, 
  5, 
  5, 
  true, 
  5000
),
(
  'Premium', 
  'For large operations', 
  NULL, 
  NULL, 
  14900, 
  20, 
  20, 
  20, 
  true, 
  50000
);

