-- ─────────────────────────────────────────────
-- 002_todos.sql  –  lists + todos tables
-- ─────────────────────────────────────────────

-- ── Lists ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.lists (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  color      TEXT        NOT NULL DEFAULT '#007AFF',
  icon       TEXT        NOT NULL DEFAULT 'list',
  position   INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lists_user_id_idx ON public.lists(user_id);

ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lists_select_own" ON public.lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "lists_insert_own" ON public.lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lists_update_own" ON public.lists
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lists_delete_own" ON public.lists
  FOR DELETE USING (auth.uid() = user_id);


-- ── Todos ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.todos (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id      UUID        REFERENCES public.lists(id) ON DELETE SET NULL,
  title        TEXT        NOT NULL,
  notes        TEXT,
  due_date     DATE,
  due_time     TIME,
  priority     TEXT        NOT NULL DEFAULT 'none'
                             CHECK (priority IN ('none', 'low', 'medium', 'high')),
  is_completed BOOLEAN     NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  position     INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS todos_user_id_idx   ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS todos_list_id_idx   ON public.todos(list_id);
CREATE INDEX IF NOT EXISTS todos_due_date_idx  ON public.todos(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS todos_completed_idx ON public.todos(user_id, is_completed);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "todos_select_own" ON public.todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "todos_insert_own" ON public.todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "todos_update_own" ON public.todos
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "todos_delete_own" ON public.todos
  FOR DELETE USING (auth.uid() = user_id);
