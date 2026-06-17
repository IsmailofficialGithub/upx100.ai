-- Industry vertical for agent onboarding (script / scraper context)
ALTER TABLE inbound.agents
  ADD COLUMN IF NOT EXISTS industry_vertical text;
