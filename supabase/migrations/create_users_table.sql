-- ════════════════════════════════════════════════════════════════
-- Users Table for Supabase (NextAuth user sync & role management)
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  image TEXT DEFAULT '',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to users
CREATE POLICY "Allow public read users" ON users
  FOR SELECT USING (true);

-- Allow insert/update operations
CREATE POLICY "Allow insert users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update users" ON users
  FOR UPDATE USING (true) WITH CHECK (true);
