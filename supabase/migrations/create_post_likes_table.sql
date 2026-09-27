-- ════════════════════════════════════════════════════════════════
-- Blog Post Likes Table & Column for Supabase
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ════════════════════════════════════════════════════════════════

-- 1. Dedicated table for post likes
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_email)
);

-- Index for instant lookup of user likes by post or email
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_email ON post_likes(user_email);

-- 2. Direct counter column on posts table for instant reading
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read post_likes" ON post_likes
  FOR SELECT USING (true);

-- Allow insert post_likes
CREATE POLICY "Allow insert post_likes" ON post_likes
  FOR INSERT WITH CHECK (true);

-- Allow delete post_likes
CREATE POLICY "Allow delete post_likes" ON post_likes
  FOR DELETE USING (true);
