-- Run this once in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/tjynazwczmfjzmstrlkm/sql/new

CREATE TABLE IF NOT EXISTS public.history (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  original_content text        NOT NULL,
  selected_formats text[]      NOT NULL,
  tone            text        NOT NULL,
  generated_results jsonb     NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.saved (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  history_id      uuid        REFERENCES public.history(id) ON DELETE SET NULL,
  format_id       text        NOT NULL,
  type            text        NOT NULL,
  platform        text        NOT NULL,
  content         text        NOT NULL,
  character_count integer     NOT NULL,
  created_at      timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS history_created_at_idx ON public.history(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_created_at_idx   ON public.saved(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_history_id_idx   ON public.saved(history_id);

-- Disable RLS (single-user app, no auth required)
ALTER TABLE public.history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved   DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.history TO anon, authenticated;
GRANT ALL ON public.saved   TO anon, authenticated;
