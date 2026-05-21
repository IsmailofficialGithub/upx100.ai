-- Agent RAG / company knowledge file URL (Supabase storage bucket: knowledge_base)
ALTER TABLE inbound.agents
  ADD COLUMN IF NOT EXISTS knowledge_base_url text;

COMMENT ON COLUMN inbound.agents.knowledge_base_url IS
  'Public URL of uploaded company knowledge file (CSV, PDF, TXT, etc.) in knowledge_base storage bucket';
