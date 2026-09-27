-- ════════════════════════════════════════════════════════════════
-- Blog Drafts & Posts Tables for Supabase
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ════════════════════════════════════════════════════════════════

-- 1. DRAFTS TABLE — stores auto-saved drafts
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_email TEXT NOT NULL,
  title TEXT DEFAULT '',
  blocks JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by author + status
CREATE INDEX IF NOT EXISTS idx_drafts_author_status
  ON drafts (author_email, status, updated_at DESC);

-- 2. POSTS TABLE — stores published blog posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  author_email TEXT NOT NULL,
  title TEXT NOT NULL,
  blocks JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'archived', 'deleted')),
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for listing published posts
CREATE INDEX IF NOT EXISTS idx_posts_published
  ON posts (status, published_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Add optional preview metadata columns
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS cover_image TEXT DEFAULT '';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT DEFAULT '';

-- Allow all operations via service role key (our API uses service role)
-- For anon key access, create more restrictive policies
CREATE POLICY "Allow all for service role" ON drafts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for service role" ON posts
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Updated_at auto-trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ════════════════════════════════════════════════════════════════
-- 5. STORAGE BUCKET FOR BLOG IMAGES
-- Creates the public 'images' bucket in Supabase Storage
-- ════════════════════════════════════════════════════════════════

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

-- Allow public read access to all images
CREATE POLICY "Public Read Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Allow users to update their own images
CREATE POLICY "Allow update access"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images');

-- Allow users to delete their own images
CREATE POLICY "Allow delete access"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');

