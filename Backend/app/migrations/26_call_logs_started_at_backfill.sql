-- Backfill incorrect shared started_at values using Vapi recording URL timestamps.

UPDATE inbound.call_logs cl
SET started_at = to_timestamp(
  (regexp_match(cl.recording_url, '-(\d{13})-'))[1]::bigint / 1000.0
)
WHERE cl.recording_url ~ '-[0-9]{13}-'
  AND (regexp_match(cl.recording_url, '-(\d{13})-'))[1] IS NOT NULL;

-- Rows without recording: derive from ended_at or created_at minus duration when started_at is stale.
UPDATE inbound.call_logs cl
SET started_at = COALESCE(
  cl.ended_at - (cl.duration_sec * interval '1 second'),
  cl.created_at - (cl.duration_sec * interval '1 second'),
  cl.created_at
)
WHERE cl.recording_url IS NULL
  AND cl.duration_sec IS NOT NULL
  AND cl.duration_sec > 0
  AND cl.created_at IS NOT NULL
  AND (
    cl.started_at IS NULL
    OR cl.started_at < cl.created_at - interval '1 day'
  );
