-- Migration: Secure profiles RLS
-- Problem: The "Public profiles are viewable by everyone" policy exposed stripe_customer_id to all users.

-- Step 1: Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

-- Step 2: Add a secure policy — users can only read their own profile
CREATE POLICY "Users can view own profile." ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Step 3: For the dashboard/navbar to show avatars publicly, create a safe public view
-- that EXCLUDES sensitive fields (stripe_customer_id, plan internals)
-- This is optional — only needed if you display public profile info
CREATE OR REPLACE VIEW public_profiles AS
  SELECT id, username, full_name, avatar_url
  FROM profiles;
