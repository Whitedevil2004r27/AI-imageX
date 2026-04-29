-- ════════════════════════════════════════════════════════════════
-- AI-imageX: Row Level Security (RLS) Migration
-- Run this in your Supabase SQL Editor to protect all clinical data
-- ════════════════════════════════════════════════════════════════

-- ─── 1. Enable RLS on all public tables ───────────────────────
ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_embeddings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles    ENABLE ROW LEVEL SECURITY;

-- ─── 2. Helper function: get the current user's role ──────────
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;

CREATE OR REPLACE FUNCTION private.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- ════════════════════════════════════════════════════════════════
-- USERS TABLE POLICIES
-- ════════════════════════════════════════════════════════════════

-- Users can only read their own profile
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- Allow user profile creation during signup (service role or matching id)
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (id = auth.uid());

-- Admins can read all users
DROP POLICY IF EXISTS "users_admin_select_all" ON public.users;
CREATE POLICY "users_admin_select_all"
  ON public.users FOR SELECT
  USING (private.current_user_role() = 'admin');

-- ════════════════════════════════════════════════════════════════
-- DIAGNOSES TABLE POLICIES
-- ════════════════════════════════════════════════════════════════

-- Clinicians and admins can read all diagnoses
DROP POLICY IF EXISTS "diagnoses_clinician_select" ON public.diagnoses;
CREATE POLICY "diagnoses_clinician_select"
  ON public.diagnoses FOR SELECT
  USING (private.current_user_role() IN ('clinician', 'admin'));

-- Patients can only read their own diagnoses
DROP POLICY IF EXISTS "diagnoses_patient_select_own" ON public.diagnoses;
CREATE POLICY "diagnoses_patient_select_own"
  ON public.diagnoses FOR SELECT
  USING (
    private.current_user_role() = 'patient'
    AND patient_id = (SELECT email FROM public.users WHERE id = auth.uid())
  );

-- Clinicians and admins can insert diagnoses
DROP POLICY IF EXISTS "diagnoses_clinician_insert" ON public.diagnoses;
CREATE POLICY "diagnoses_clinician_insert"
  ON public.diagnoses FOR INSERT
  WITH CHECK (private.current_user_role() IN ('clinician', 'admin'));

-- Clinicians and admins can update diagnoses (e.g., review status)
DROP POLICY IF EXISTS "diagnoses_clinician_update" ON public.diagnoses;
CREATE POLICY "diagnoses_clinician_update"
  ON public.diagnoses FOR UPDATE
  USING (private.current_user_role() IN ('clinician', 'admin'));

-- Only admins can delete diagnoses
DROP POLICY IF EXISTS "diagnoses_admin_delete" ON public.diagnoses;
CREATE POLICY "diagnoses_admin_delete"
  ON public.diagnoses FOR DELETE
  USING (private.current_user_role() = 'admin');

-- ════════════════════════════════════════════════════════════════
-- AUDIT LOGS TABLE POLICIES
-- ════════════════════════════════════════════════════════════════

-- Only clinicians and admins can read audit logs
DROP POLICY IF EXISTS "audit_logs_clinician_select" ON public.audit_logs;
CREATE POLICY "audit_logs_clinician_select"
  ON public.audit_logs FOR SELECT
  USING (private.current_user_role() IN ('clinician', 'admin'));

-- Only the system (via service role) can write audit logs
-- This policy allows server-side writes from API routes
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_insert"
  ON public.audit_logs FOR INSERT
  WITH CHECK (private.current_user_role() IN ('clinician', 'admin'));

-- ════════════════════════════════════════════════════════════════
-- CASE EMBEDDINGS TABLE POLICIES
-- ════════════════════════════════════════════════════════════════

-- Clinicians and admins can read all embeddings (needed for vector search)
DROP POLICY IF EXISTS "case_embeddings_clinician_select" ON public.case_embeddings;
CREATE POLICY "case_embeddings_clinician_select"
  ON public.case_embeddings FOR SELECT
  USING (private.current_user_role() IN ('clinician', 'admin'));

-- Only clinicians and admins can insert embeddings
DROP POLICY IF EXISTS "case_embeddings_clinician_insert" ON public.case_embeddings;
CREATE POLICY "case_embeddings_clinician_insert"
  ON public.case_embeddings FOR INSERT
  WITH CHECK (private.current_user_role() IN ('clinician', 'admin'));

-- ════════════════════════════════════════════════════════════════
-- PATIENT PROFILES TABLE POLICIES
-- ════════════════════════════════════════════════════════════════

-- Clinicians and admins can read all patient profiles
DROP POLICY IF EXISTS "patient_profiles_clinician_select" ON public.patient_profiles;
CREATE POLICY "patient_profiles_clinician_select"
  ON public.patient_profiles FOR SELECT
  USING (private.current_user_role() IN ('clinician', 'admin'));

-- Patients can only view their own profile
DROP POLICY IF EXISTS "patient_profiles_patient_select_own" ON public.patient_profiles;
CREATE POLICY "patient_profiles_patient_select_own"
  ON public.patient_profiles FOR SELECT
  USING (
    private.current_user_role() = 'patient'
    AND patient_id = (SELECT email FROM public.users WHERE id = auth.uid())
  );

-- Clinicians and admins can create/update patient profiles
DROP POLICY IF EXISTS "patient_profiles_clinician_insert" ON public.patient_profiles;
CREATE POLICY "patient_profiles_clinician_insert"
  ON public.patient_profiles FOR INSERT
  WITH CHECK (private.current_user_role() IN ('clinician', 'admin'));

DROP POLICY IF EXISTS "patient_profiles_clinician_update" ON public.patient_profiles;
CREATE POLICY "patient_profiles_clinician_update"
  ON public.patient_profiles FOR UPDATE
  USING (private.current_user_role() IN ('clinician', 'admin'));

-- ════════════════════════════════════════════════════════════════
-- SERVICE ROLE BYPASS (for API routes using service role key)
-- These allow backend API routes to perform unrestricted operations
-- They only activate when SUPABASE_SERVICE_ROLE_KEY is used
-- ════════════════════════════════════════════════════════════════
-- Note: The service_role bypasses RLS by default in Supabase.
-- No additional policy needed — keep server-side calls using
-- createClient with SUPABASE_SERVICE_ROLE_KEY for full access.
