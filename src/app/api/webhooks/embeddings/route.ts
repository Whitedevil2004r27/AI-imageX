import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    // 1. Verify Webhook Secret
    const authHeader = req.headers.get('Authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Webhook Payload
    const payload = await req.json();
    
    // Ensure it's an INSERT event on the diagnoses table
    if (payload.type !== 'INSERT' || payload.table !== 'diagnoses') {
      return NextResponse.json({ message: 'Ignored: Not a diagnosis insert' });
    }

    const diagnosis = payload.record;
    if (!diagnosis || !diagnosis.id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 3. Construct the text to embed
    const textToEmbed = `
      Diagnosis: ${diagnosis.diagnosis_primary || 'Unknown'}
      Findings: ${diagnosis.findings_raw || 'No findings provided.'}
      Urgency: ${diagnosis.urgency_level || 'Routine'}
      Confidence: ${diagnosis.confidence_score || 'N/A'}
    `.trim().replace(/\n/g, ' ');

    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is not set. Skipping embedding generation.");
      return NextResponse.json({ message: 'Skipped: No OpenAI API Key' });
    }

    // Lazy-initialize clients (avoids build-time crash when env vars are absent)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 4. Generate Embedding using OpenAI
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: textToEmbed,
      encoding_format: 'float',
    });

    const embedding = response.data[0].embedding;

    // 5. Store Embedding in Supabase
    const { error: dbError } = await supabaseAdmin
      .from('case_embeddings')
      .insert({
        diagnosis_id: diagnosis.id,
        embedding: embedding,
        embedding_model: 'text-embedding-3-small',
      });

    if (dbError) {
      console.error("Database Error:", dbError);
      return NextResponse.json({ error: 'Failed to save embedding' }, { status: 500 });
    }

    return NextResponse.json({ success: true, diagnosis_id: diagnosis.id });
  } catch (error: any) {
    console.error("Embedding generation failed:", error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
