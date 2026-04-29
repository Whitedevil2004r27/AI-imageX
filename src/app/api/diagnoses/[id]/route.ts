import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/diagnoses/:id — Full diagnosis with audit trail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("diagnoses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 404 });
  }

  // Also fetch audit logs for this diagnosis
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("diagnosis_id", id)
    .order("timestamp", { ascending: true });

  return new Response(JSON.stringify({ ...data, audit_log: auditLogs }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
