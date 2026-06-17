-- Persist calendar pipeline stage for meeting outcome tracker rollups.

ALTER TABLE inbound.leads
  ADD COLUMN IF NOT EXISTS meeting_outcome text;

COMMENT ON COLUMN inbound.leads.meeting_outcome IS
  'Pipeline outcome for calendar tracker: qualified, proposal, negotiation, closedWon, noShow, unqualified';

UPDATE inbound.leads
SET meeting_outcome = 'qualified'
WHERE meeting_outcome IS NULL
  AND (meeting_time IS NOT NULL OR meeting_date IS NOT NULL);
