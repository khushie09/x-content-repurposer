-- Migration v2: Auth, RLS, usage tracking
-- Run this AFTER migration.sql in Supabase SQL Editor

-- 1. Add user_id to existing tables
ALTER TABLE public.history ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.saved  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Enable RLS
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved   ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies for history
CREATE POLICY "history_select_own" ON public.history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "history_insert_own" ON public.history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_delete_own" ON public.history FOR DELETE USING (auth.uid() = user_id);

-- 4. RLS policies for saved
CREATE POLICY "saved_select_own" ON public.saved FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_own" ON public.saved FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own" ON public.saved FOR DELETE USING (auth.uid() = user_id);

-- 5. Usage table (per-user monthly repurpose count)
CREATE TABLE IF NOT EXISTS public.usage (
  id        uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month     text    NOT NULL,          -- format: "2026-08"
  count     integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, month)
);
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usage_select_own" ON public.usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_insert_own" ON public.usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usage_update_own" ON public.usage FOR UPDATE USING (auth.uid() = user_id);

-- 6. Atomic usage increment — SECURITY DEFINER so it runs as the function owner
--    and can INSERT+UPDATE atomically regardless of per-row RLS.
CREATE OR REPLACE FUNCTION public.increment_usage(p_month text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_count integer;
BEGIN
  INSERT INTO public.usage (user_id, month, count)
  VALUES (auth.uid(), p_month, 1)
  ON CONFLICT (user_id, month)
  DO UPDATE SET count = public.usage.count + 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

-- 7. Performance indexes
CREATE INDEX IF NOT EXISTS idx_history_user_id    ON public.history(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_id      ON public.saved(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_user_month   ON public.usage(user_id, month);
