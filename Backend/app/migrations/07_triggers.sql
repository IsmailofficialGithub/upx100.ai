-- 07: TRIGGERS

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END;
$$;

CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON inbound.agents
  FOR EACH ROW 
  EXECUTE FUNCTION public.set_updated_at();
