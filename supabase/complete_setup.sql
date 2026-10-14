-- ══════════════════════════════════════════════════════════════════════════════
-- COMPLETE SUPABASE DATABASE SETUP FOR PORTFOLIO & BLOG
-- Project: rnbzjgkvvwnxljfegpfw.supabase.co
--
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/rnbzjgkvvwnxljfegpfw
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New query", paste this entire script, and click "Run" (or Ctrl/Cmd + Enter)
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. USERS TABLE (NextAuth Google sync & role management)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  image TEXT DEFAULT '',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow insert users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update users" ON users
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed your admin user account
INSERT INTO users (id, email, username, image, role)
VALUES (
  '0b5cf019-3905-4b88-8092-3ff8f953581d',
  'avinashrajraj628@gmail.com',
  'Avinash Raj',
  '',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. DRAFTS TABLE (Auto-saved blog drafts)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_email TEXT NOT NULL,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  blocks JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drafts_author_status
  ON drafts (author_email, status, updated_at DESC);

ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for drafts" ON drafts
  FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. POSTS TABLE (Published blog posts)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  author_email TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  blocks JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'archived', 'deleted')),
  likes INT DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_published
  ON posts (status, published_at DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for posts" ON posts
  FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. COMMENTS TABLE (Post discussions and replies)
-- ══════════════════════════════════════════════════════════════════════════════
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

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Allow comment inserts" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow comment updates" ON comments
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow comment deletes" ON comments
  FOR DELETE USING (true);

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. POST_LIKES TABLE (Track who liked which post)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_email ON post_likes(user_email);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read post_likes" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "Allow insert post_likes" ON post_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow delete post_likes" ON post_likes
  FOR DELETE USING (true);

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. STORAGE BUCKET FOR BLOG IMAGES
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

CREATE POLICY "Public Read Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow update access"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images');

CREATE POLICY "Allow delete access"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');
