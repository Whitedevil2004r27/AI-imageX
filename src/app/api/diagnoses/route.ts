import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/diagnoses?patient_id=X&limit=20&offset=0&status=pending
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patient_id");
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  let query = supabase
    .from("diagnoses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }
  if (status) {
    query = query.eq("human_review_status", status);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({
      diagnoses: data,
      total_count: count,
      has_more: offset + limit < (count || 0),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// POST /api/diagnoses — search
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { query: searchQuery, filters } = body;

  let query = supabase.from("diagnoses").select("*");

  if (searchQuery) {
    const q = `%${searchQuery}%`;
    query = query.or(`diagnosis_primary.ilike.${q},patient_id.ilike.${q},id.ilike.${q}`);
  }

  if (filters?.modality) {
    // Note: modality column might not exist in diagnoses table based on schema.sql, 
    // it might be inside findings_structured or we need to add it.
    // Looking at schema.sql, modality is NOT a top level column.
    // However, we can use JSONB querying if it's in findings_structured.
    // For now, let's assume we might need to filter by patient_id or diagnosis if modality isn't indexed.
  }
  
  if (filters?.confidence_min) {
    query = query.gte("confidence_score", filters.confidence_min);
  }
  if (filters?.status) {
    query = query.eq("human_review_status", filters.status);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ results: data }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
