-- ════════════════════════════════════════════════════════════════
-- AI-imageX: Vector Embeddings Webhook Migration
-- ════════════════════════════════════════════════════════════════
-- NOTE: For production, it is highly recommended to create webhooks 
-- through the Supabase Dashboard (Database -> Webhooks).
-- 
-- If you want to run this manually via SQL, ensure the `pg_net` 
-- extension is enabled in your project.
-- ════════════════════════════════════════════════════════════════

-- 1. Enable the pg_net extension (required for HTTP requests)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Create the webhook trigger function
CREATE OR REPLACE FUNCTION public.trigger_diagnosis_embedding()
RETURNS TRIGGER AS $$
DECLARE
  api_url TEXT := 'https://your-production-domain.com/api/webhooks/embeddings'; -- ⚠️ UPDATE THIS
  webhook_secret TEXT := 'your-super-secret-webhook-token'; -- ⚠️ UPDATE THIS
  payload JSONB;
BEGIN
  -- Construct the payload
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', row_to_json(NEW),
    'old_record', null
  );

  -- Perform the async HTTP POST request using pg_net
  PERFORM net.http_post(
    url := api_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || webhook_secret
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach the trigger to the diagnoses table
DROP TRIGGER IF EXISTS trigger_diagnosis_embedding_on_insert ON public.diagnoses;
CREATE TRIGGER trigger_diagnosis_embedding_on_insert
AFTER INSERT ON public.diagnoses
FOR EACH ROW
EXECUTE FUNCTION public.trigger_diagnosis_embedding();
