--  01: SCHEMAS & ENUMS

CREATE SCHEMA IF NOT EXISTS inbound;

-- Enums (Public)
CREATE TYPE public.user_role AS ENUM (
  'gcc_admin',
  'gcc_reviewer',
  'sp_primary',
  'sp_sub',
  'client_admin',
  'client_sub'
);

-- Enums (Inbound)
CREATE TYPE inbound.call_status AS ENUM ('in_progress', 'success', 'follow_up', 'missed', 'failed');
CREATE TYPE inbound.lead_status AS ENUM ('new', 'warm', 'cold', 'success', 'follow_up');
CREATE TYPE inbound.crm_type    AS ENUM ('gohighlevel', 'hubspot', 'salesforce');
CREATE TYPE inbound.crm_sync    AS ENUM ('pending', 'synced', 'failed', 'not_applicable');
CREATE TYPE inbound.phone_provider AS ENUM ('twilio', 'vapi', 'other');
