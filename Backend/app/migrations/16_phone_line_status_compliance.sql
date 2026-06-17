-- Operational line status + one client per phone number (compliance).

UPDATE inbound.phone_numbers
SET status = 'porting'
WHERE port_requested = true
   OR lower(coalesce(status, '')) IN ('pending', 'submitted', 'in_progress', 'processing', 'porting');

UPDATE inbound.phone_numbers
SET status = 'suspended'
WHERE lower(coalesce(status, '')) IN ('suspended', 'inactive', 'disabled', 'revoked');

UPDATE inbound.phone_numbers
SET status = 'active'
WHERE lower(coalesce(status, '')) IN ('active', 'live', 'ready', 'online', '');

ALTER TABLE inbound.phone_numbers
  DROP CONSTRAINT IF EXISTS phone_numbers_status_check;

ALTER TABLE inbound.phone_numbers
  ADD CONSTRAINT phone_numbers_status_check
  CHECK (status IN ('active', 'porting', 'suspended'));

ALTER TABLE inbound.phone_numbers
  ALTER COLUMN status SET DEFAULT 'active';

-- Back-fill org on legacy null rows to system sentinel before NOT NULL (adjust if you delete sentinel).
UPDATE inbound.phone_numbers
SET organization_id = '00000000-0000-4000-a000-000000000003'
WHERE organization_id IS NULL;

ALTER TABLE inbound.phone_numbers
  ALTER COLUMN organization_id SET NOT NULL;

-- phone_number already UNIQUE globally; document 1:1 client assignment via organization_id.
