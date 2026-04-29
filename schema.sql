-- AI-imageX PostgreSQL Supabase Schema
-- Run this in your Supabase SQL Editor to prepare the environment.

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Users Table (Fallback extension to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'clinician', 'admin')),
    specialization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Create Diagnoses Table
CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT NOT NULL,
    image_url TEXT,
    image_hash TEXT UNIQUE,
    findings_raw TEXT,
    findings_structured JSONB,
    diagnosis_primary TEXT,
    diagnosis_differential TEXT[],
    confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
    recommended_specialist TEXT,
    urgency_level TEXT CHECK (urgency_level IN ('routine', 'urgent', 'emergent')),
    agent_reasoning JSONB,
    human_review_required BOOLEAN DEFAULT TRUE,
    human_review_status TEXT DEFAULT 'pending' CHECK (human_review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    is_public_case BOOLEAN DEFAULT FALSE
);

-- 4. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnosis_id TEXT,
    event_type TEXT NOT NULL,
    tool_name TEXT,
    input_data JSONB,
    output_data JSONB,
    agent_state JSONB,
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT
);

-- 5. Create Case Embeddings Table (Vector DB)
CREATE TABLE IF NOT EXISTS case_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnosis_id UUID REFERENCES diagnoses(id) ON DELETE CASCADE,
    embedding vector(1536),
    embedding_model TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Build Optimized Query Indexes
CREATE INDEX IF NOT EXISTS idx_diagnoses_patient ON diagnoses(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_created ON diagnoses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_embeddings_diagnosis ON case_embeddings(diagnosis_id);

-- 7. Create IVFFlat Cosine Distance Vector Search Index
-- Note: Lists size is recommended as 100 for small collections
CREATE INDEX IF NOT EXISTS idx_case_embeddings_vector 
ON case_embeddings USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 8. Create Patient Profiles Table
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT UNIQUE NOT NULL,
    age INTEGER,
    gender TEXT,
    medical_history TEXT[],
    current_medications TEXT[],
    allergies TEXT[],
    prior_diagnoses TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patient_profiles_id ON patient_profiles(patient_id);
