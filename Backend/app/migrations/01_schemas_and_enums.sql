-- 01: SCHEMAS & ENUMS
-- Snapshot aligned with Supabase (public + inbound) — May 2026

CREATE SCHEMA IF NOT EXISTS inbound;

-- Public enums
CREATE TYPE public.user_role AS ENUM (
  'gcc_admin',
  'gcc_reviewer',
  'sp_primary',
  'sp_sub',
  'client_admin',
  'client_sub'
);

CREATE TYPE public.script_request_status AS ENUM ('pending', 'approved', 'rejected', 'deployed');
CREATE TYPE public.upload_status AS ENUM ('pending_review', 'approved', 'rejected');
CREATE TYPE public.voice_clone_status AS ENUM ('submitted', 'approved', 'rejected', 'deployed');

-- Inbound enums
CREATE TYPE inbound.call_status AS ENUM ('in_progress', 'success', 'follow_up', 'missed', 'failed');
CREATE TYPE inbound.lead_status AS ENUM ('new', 'warm', 'cold', 'success', 'follow_up');
CREATE TYPE inbound.crm_type AS ENUM ('gohighlevel', 'hubspot', 'salesforce');
CREATE TYPE inbound.crm_sync AS ENUM ('pending', 'synced', 'failed', 'not_applicable');
CREATE TYPE inbound.phone_provider AS ENUM ('twilio', 'vapi', 'other');
