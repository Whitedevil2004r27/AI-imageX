-- ════════════════════════════════════════════════════════════════
-- AI-imageX: Vector Extension Migration
-- Run this in your Supabase SQL Editor to resolve the 'extension_in_public' warning.
-- ════════════════════════════════════════════════════════════════

-- 1. Create a dedicated schema for extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Grant necessary usage permissions so other roles can access it
GRANT USAGE ON SCHEMA extensions TO postgres, authenticated, anon, service_role;

-- 3. Move the vector extension out of the public schema
ALTER EXTENSION vector SET SCHEMA extensions;
