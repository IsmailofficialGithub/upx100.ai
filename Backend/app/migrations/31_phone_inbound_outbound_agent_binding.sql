-- Allow one phone line on one inbound agent AND one outbound agent (not two of the same type).

ALTER TABLE inbound.phone_numbers
  ADD COLUMN IF NOT EXISTS inbound_agent_id uuid REFERENCES inbound.agents(id),
  ADD COLUMN IF NOT EXISTS outbound_agent_id uuid REFERENCES inbound.agents(id);

-- Migrate legacy agent_id into the correct slot by agent type.
UPDATE inbound.phone_numbers pn
SET
  inbound_agent_id = CASE
    WHEN a.agent_type = 'outbound' THEN pn.inbound_agent_id
    ELSE pn.agent_id
  END,
  outbound_agent_id = CASE
    WHEN a.agent_type = 'outbound' THEN pn.agent_id
    ELSE pn.outbound_agent_id
  END
FROM inbound.agents a
WHERE pn.agent_id IS NOT NULL
  AND pn.agent_id = a.id;

-- Orphan bindings (agent row missing): default to inbound slot.
UPDATE inbound.phone_numbers pn
SET inbound_agent_id = pn.agent_id
WHERE pn.agent_id IS NOT NULL
  AND pn.inbound_agent_id IS NULL
  AND pn.outbound_agent_id IS NULL;

ALTER TABLE inbound.phone_numbers DROP CONSTRAINT IF EXISTS phone_numbers_agent_id_key;
ALTER TABLE inbound.phone_numbers DROP CONSTRAINT IF EXISTS phone_numbers_agent_id_fkey;

DROP INDEX IF EXISTS inbound.idx_phone_numbers_agent_id;
DROP INDEX IF EXISTS inbound.idx_phone_numbers_org_unassigned;

ALTER TABLE inbound.phone_numbers DROP COLUMN IF EXISTS agent_id;

CREATE UNIQUE INDEX IF NOT EXISTS phone_numbers_inbound_agent_id_key
  ON inbound.phone_numbers (inbound_agent_id)
  WHERE inbound_agent_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS phone_numbers_outbound_agent_id_key
  ON inbound.phone_numbers (outbound_agent_id)
  WHERE outbound_agent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_phone_numbers_inbound_agent_id
  ON inbound.phone_numbers (inbound_agent_id)
  WHERE inbound_agent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_phone_numbers_outbound_agent_id
  ON inbound.phone_numbers (outbound_agent_id)
  WHERE outbound_agent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_phone_numbers_org_unassigned_inbound
  ON inbound.phone_numbers (organization_id)
  WHERE inbound_agent_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_phone_numbers_org_unassigned_outbound
  ON inbound.phone_numbers (organization_id)
  WHERE outbound_agent_id IS NULL;
