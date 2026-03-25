-- Migration: 001_add_user_id_to_notes
-- Adds per-user ownership to the notes table and enables Row Level Security.
-- Run this in: Supabase Dashboard → SQL Editor

-- 1. Add user_id column (nullable so existing rows are not broken)
ALTER TABLE notes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 3. Only the owner can read their notes
CREATE POLICY "users_select_own_notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Users can only insert notes for themselves
CREATE POLICY "users_insert_own_notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Users can only update their own notes
CREATE POLICY "users_update_own_notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Users can only delete their own notes
CREATE POLICY "users_delete_own_notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- AFTER running the above, assign existing notes to your account.
-- Find your UUID in: Supabase Dashboard → Authentication → Users
-- Then run:
--
--   UPDATE notes SET user_id = 'YOUR-USER-UUID' WHERE user_id IS NULL;
--
-- ---------------------------------------------------------------
