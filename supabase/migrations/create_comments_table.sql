-- ════════════════════════════════════════════════════════════════
-- Blog Comments Table for Supabase
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT '',
  author_email TEXT DEFAULT '',
  is_author BOOLEAN DEFAULT false,
  text TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for retrieving comments for a post ordered by creation
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to comments
CREATE POLICY "Allow public read comments" ON comments
  FOR SELECT USING (true);

-- Allow comment inserts (anyone or authenticated)
CREATE POLICY "Allow comment inserts" ON comments
  FOR INSERT WITH CHECK (true);

-- Allow comment updates (e.g. for likes)
CREATE POLICY "Allow comment updates" ON comments
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow comment deletes
CREATE POLICY "Allow comment deletes" ON comments
  FOR DELETE USING (true);
