-- 35_outbound_targets_company_name.sql
ALTER TABLE inbound.outbound_targets
ADD COLUMN IF NOT EXISTS company_name text;
