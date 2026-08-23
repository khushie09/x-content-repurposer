-- Migration v2: Auth, RLS, usage tracking
-- IDEMPOTENT — safe to run multiple times
-- Run this AFTER migration.sql in the Supabase SQL Editor

-- ── 1. Add user_id to existing tables ───────────────────────────
ALTER TABLE public.history
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.saved
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- ── 2. Enable RLS ────────────────────────────────────────────────
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved   ENABLE ROW LEVEL SECURITY;

-- ── 3. History RLS policies (DROP first = idempotent) ────────────
DROP POLICY IF EXISTS "history_select_own" ON public.history;
DROP POLICY IF EXISTS "history_insert_own" ON public.history;
DROP POLICY IF EXISTS "history_delete_own" ON public.history;

CREATE POLICY "history_select_own" ON public.history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "history_insert_own" ON public.history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_delete_own" ON public.history
  FOR DELETE USING (auth.uid() = user_id);

-- ── 4. Saved RLS policies ────────────────────────────────────────
DROP POLICY IF EXISTS "saved_select_own" ON public.saved;
DROP POLICY IF EXISTS "saved_insert_own" ON public.saved;
DROP POLICY IF EXISTS "saved_delete_own" ON public.saved;

CREATE POLICY "saved_select_own" ON public.saved
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_own" ON public.saved
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own" ON public.saved
  FOR DELETE USING (auth.uid() = user_id);

-- ── 5. Usage table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usage (
  id      uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month   text    NOT NULL,   -- "YYYY-MM"
  count   integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, month)
);
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usage_select_own" ON public.usage;
DROP POLICY IF EXISTS "usage_insert_own" ON public.usage;
DROP POLICY IF EXISTS "usage_update_own" ON public.usage;

CREATE POLICY "usage_select_own" ON public.usage
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_insert_own" ON public.usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usage_update_own" ON public.usage
  FOR UPDATE USING (auth.uid() = user_id);

-- ── 6. Atomic usage increment (SECURITY DEFINER bypasses RLS) ───
CREATE OR REPLACE FUNCTION public.increment_usage(p_month text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_count integer;
BEGIN
  INSERT INTO public.usage (user_id, month, count)
  VALUES (auth.uid(), p_month, 1)
  ON CONFLICT (user_id, month)
  DO UPDATE SET count = usage.count + 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

-- ── 7. Grants ────────────────────────────────────────────────────
GRANT ALL ON public.history TO authenticated;
GRANT ALL ON public.saved   TO authenticated;
GRANT ALL ON public.usage   TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_usage(text) TO authenticated;

-- ── 8. Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_history_user_id  ON public.history(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_id    ON public.saved(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_user_month ON public.usage(user_id, month);
