-- 05: UTILITIES (Notifications)

CREATE TABLE inbound.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text,
  title      text,
  message    text,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON inbound.notifications (user_id, read_at) WHERE read_at IS NULL;
