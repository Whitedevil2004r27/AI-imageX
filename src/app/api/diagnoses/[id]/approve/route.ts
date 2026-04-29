import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { reviewer_notes } = body;

    // Update diagnosis status
    const { error: updateError } = await supabase
      .from("diagnoses")
      .update({
        human_review_status: "approved",
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // Log audit event
    const { error: auditError } = await supabase
      .from("audit_logs")
      .insert({
        diagnosis_id: id,
        event_type: "human_approved",
        details: reviewer_notes || "Human clinician approved the diagnosis.",
        timestamp: new Date().toISOString()
      });

    if (auditError) console.error("Failed to log audit event:", auditError);

    return new Response(
      JSON.stringify({
        diagnosis_id: id,
        status: "approved",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Approval failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
