-- Add notification flag to todos
ALTER TABLE todos ADD COLUMN IF NOT EXISTS notify boolean DEFAULT false NOT NULL;
