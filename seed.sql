-- AI-imageX Clinical Seeding Data
-- Run this in your Supabase SQL Editor after schema.sql

-- 1. Insert Sample Patients
INSERT INTO patient_profiles (patient_id, age, gender, medical_history, current_medications, allergies, prior_diagnoses)
VALUES 
('P-0192', 45, 'Male', ARRAY['Hypertension', 'Type 2 Diabetes'], ARRAY['Lisinopril', 'Metformin'], ARRAY['Penicillin'], ARRAY['Pneumonia (2022)']),
('P-5521', 29, 'Female', ARRAY['Asthma'], ARRAY['Albuterol'], ARRAY['Latex'], ARRAY['None']),
('P-3342', 68, 'Male', ARRAY['COPD', 'Heart Disease'], ARRAY['Aspirin', 'Statin'], ARRAY['Sulfa'], ARRAY['Myocardial Infarction (2020)'])
ON CONFLICT (patient_id) DO NOTHING;

-- 2. Insert Historical Diagnoses for Precedent Matching
INSERT INTO diagnoses (id, patient_id, diagnosis_primary, confidence_score, urgency_level, is_public_case, human_review_status)
VALUES 
('d8888888-8888-4888-a888-888888888881', 'P-0192', 'Lobar Pneumonia', 92.5, 'urgent', true, 'approved'),
('d8888888-8888-4888-a888-888888888882', 'P-5521', 'Normal Chest X-Ray', 98.0, 'routine', true, 'approved'),
('d8888888-8888-4888-a888-888888888883', 'P-3342', 'Pleural Effusion', 88.2, 'emergent', true, 'pending')
ON CONFLICT DO NOTHING;

-- 3. Insert Initial Audit Logs
INSERT INTO audit_logs (diagnosis_id, event_type, tool_name, input_data, output_data)
VALUES 
('d8888888-8888-4888-a888-888888888881', 'tool_called', 'analyze_image_medical', '{"modality": "xray"}', '{"findings": "Infiltration noted in left lower lobe."}'),
('d8888888-8888-4888-a888-888888888881', 'tool_called', 'search_similar_cases', '{"findings_text": "Lobar opacity"}', '{"results": ["Case C-221: Pneumonia matched"]}'),
('d8888888-8888-4888-a888-888888888883', 'human_review_required', 'system', '{"trigger": "low_confidence_or_urgent"}', '{"reviewer_id": "awaiting_clinician"}');
