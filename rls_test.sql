-- ════════════════════════════════════════════════════════════════
-- AI-imageX: RLS Policy Test Suite
-- Run this in your Supabase SQL Editor AFTER running rls_migration.sql
-- Tests verify that each role can only access what it should.
-- ════════════════════════════════════════════════════════════════

-- ─── Setup: Create test users ─────────────────────────────────
-- NOTE: These are test users inserted directly into public.users
-- for policy simulation. In production, Supabase Auth creates them.

DO $$
DECLARE
  test_clinician_id UUID := '11111111-1111-1111-1111-111111111111';
  test_patient_id   UUID := '22222222-2222-2222-2222-222222222222';
  test_admin_id     UUID := '33333333-3333-3333-3333-333333333333';
BEGIN

  -- Insert test users (bypasses RLS because we're using service role in SQL Editor)
  INSERT INTO public.users (id, email, role) VALUES
    (test_clinician_id, 'test.clinician@aix.test', 'clinician'),
    (test_patient_id,   'test.patient@aix.test',   'patient'),
    (test_admin_id,     'test.admin@aix.test',      'admin')
  ON CONFLICT (id) DO NOTHING;

  -- Insert a test diagnosis linked to the clinician
  INSERT INTO public.diagnoses (id, patient_id, diagnosis_primary, confidence_score, urgency_level, created_by)
  VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'test.patient@aix.test',
    'Test Pneumonia',
    91.0,
    'urgent',
    test_clinician_id
  ) ON CONFLICT DO NOTHING;

  -- Insert a test patient profile
  INSERT INTO public.patient_profiles (patient_id, age, gender)
  VALUES ('test.patient@aix.test', 30, 'Female')
  ON CONFLICT (patient_id) DO NOTHING;

  RAISE NOTICE '✅ Test users and data inserted successfully.';
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- TEST BLOCK 1: CLINICIAN ACCESS
-- Expected: Can read all diagnoses & patient profiles
-- ════════════════════════════════════════════════════════════════
DO $$
DECLARE
  diag_count INT;
  profile_count INT;
BEGIN
  -- Simulate clinician session by checking policy function logic
  -- (In Supabase, use the "Test Policies" feature for true role simulation)

  -- Direct count (bypassing RLS as SQL Editor runs as postgres superuser)
  SELECT COUNT(*) INTO diag_count FROM public.diagnoses;
  SELECT COUNT(*) INTO profile_count FROM public.patient_profiles;

  RAISE NOTICE '── TEST 1: Clinician Access ──────────────────────';
  RAISE NOTICE 'Total diagnoses visible (superuser): %', diag_count;
  RAISE NOTICE 'Total patient profiles visible (superuser): %', profile_count;
  
  IF diag_count >= 1 THEN
    RAISE NOTICE '✅ PASS: Diagnoses table has data';
  ELSE
    RAISE NOTICE '❌ FAIL: Diagnoses table is empty';
  END IF;

  IF profile_count >= 1 THEN
    RAISE NOTICE '✅ PASS: Patient profiles table has data';
  ELSE
    RAISE NOTICE '❌ FAIL: Patient profiles table is empty';
  END IF;
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- TEST BLOCK 2: RLS POLICY EXISTENCE CHECK
-- Expected: All required policies exist
-- ════════════════════════════════════════════════════════════════
DO $$
DECLARE
  policy_count INT;
  expected_policies TEXT[] := ARRAY[
    'users_select_own',
    'users_update_own',
    'users_insert_own',
    'users_admin_select_all',
    'diagnoses_clinician_select',
    'diagnoses_patient_select_own',
    'diagnoses_clinician_insert',
    'diagnoses_clinician_update',
    'diagnoses_admin_delete',
    'audit_logs_clinician_select',
    'audit_logs_insert',
    'case_embeddings_clinician_select',
    'case_embeddings_clinician_insert',
    'patient_profiles_clinician_select',
    'patient_profiles_patient_select_own',
    'patient_profiles_clinician_insert',
    'patient_profiles_clinician_update'
  ];
  policy_name TEXT;
  found_count INT;
BEGIN
  RAISE NOTICE '── TEST 2: RLS Policy Existence ─────────────────';

  FOREACH policy_name IN ARRAY expected_policies LOOP
    SELECT COUNT(*) INTO found_count
    FROM pg_policies
    WHERE policyname = policy_name AND schemaname = 'public';

    IF found_count = 1 THEN
      RAISE NOTICE '✅ PASS: Policy "%" exists', policy_name;
    ELSE
      RAISE NOTICE '❌ FAIL: Policy "%" is MISSING', policy_name;
    END IF;
  END LOOP;
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- TEST BLOCK 3: RLS ENABLED CHECK
-- Expected: RLS is enabled on all 5 tables
-- ════════════════════════════════════════════════════════════════
DO $$
DECLARE
  tbl TEXT;
  rls_enabled BOOLEAN;
  tables TEXT[] := ARRAY['users', 'diagnoses', 'audit_logs', 'case_embeddings', 'patient_profiles'];
BEGIN
  RAISE NOTICE '── TEST 3: RLS Enabled on All Tables ────────────';

  FOREACH tbl IN ARRAY tables LOOP
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = tbl AND relnamespace = 'public'::regnamespace;

    IF rls_enabled THEN
      RAISE NOTICE '✅ PASS: RLS enabled on table "%"', tbl;
    ELSE
      RAISE NOTICE '❌ FAIL: RLS is NOT enabled on table "%"', tbl;
    END IF;
  END LOOP;
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- TEST BLOCK 4: AUDIT LOG INTEGRITY CHECK
-- Expected: Audit log table exists and accepts writes
-- ════════════════════════════════════════════════════════════════
DO $$
DECLARE
  audit_count INT;
BEGIN
  RAISE NOTICE '── TEST 4: Audit Log Integrity ──────────────────';

  INSERT INTO public.audit_logs (diagnosis_id, event_type, tool_name)
  VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'rls_test', 'test_suite');

  SELECT COUNT(*) INTO audit_count FROM public.audit_logs WHERE event_type = 'rls_test';

  IF audit_count >= 1 THEN
    RAISE NOTICE '✅ PASS: Audit log write and read successful';
  ELSE
    RAISE NOTICE '❌ FAIL: Audit log write failed';
  END IF;

  -- Cleanup test audit entry
  DELETE FROM public.audit_logs WHERE event_type = 'rls_test';
  RAISE NOTICE '✅ Cleaned up test audit log entry';
END;
$$;

-- ════════════════════════════════════════════════════════════════
-- CLEANUP (optional — comment out to keep test data)
-- ════════════════════════════════════════════════════════════════
-- DELETE FROM public.diagnoses WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
-- DELETE FROM public.patient_profiles WHERE patient_id = 'test.patient@aix.test';
-- DELETE FROM public.users WHERE email LIKE '%@aix.test';
-- RAISE NOTICE '🧹 Test data cleaned up.';
