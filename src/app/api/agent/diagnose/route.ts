import { NextRequest } from "next/server";
import { runAgentStateLoop } from "@/lib/agent";
import { rateLimitResponse } from "@/lib/rate-limit";
import sharp from "sharp";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Rate limiting: 10 diagnoses per minute per IP
  const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
  const rateLimited = rateLimitResponse(clientIp);
  if (rateLimited) return rateLimited;

  try {
    const contentType = req.headers.get("content-type") || "";

    let image_base64 = "";
    let image_hash = "";
    let modality = "xray";
    let patient_id = "P-0001";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      image_base64 = body.image || "";
      modality = body.modality || "xray";
      patient_id = body.patient_id || "P-0001";
      
      if (image_base64.startsWith("data:")) {
        const base64Data = image_base64.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        
        // Preprocess: Strip EXIF, Resize, Compress
        const processedBuffer = await sharp(buffer)
          .resize({ width: 2048, fit: "inside", withoutEnlargement: true })
          .png()
          .toBuffer();
          
        image_base64 = `data:image/png;base64,${processedBuffer.toString("base64")}`;
        image_hash = crypto.createHash("sha256").update(processedBuffer).digest("hex");
      }
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File;
      modality = (formData.get("modality") as string) || "xray";
      patient_id = (formData.get("patient_id") as string) || "P-0001";

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Preprocess: Strip EXIF, Resize, Compress
        const processedBuffer = await sharp(buffer)
          .resize({ width: 2048, fit: "inside", withoutEnlargement: true })
          .png()
          .toBuffer();

        image_base64 = `data:image/png;base64,${processedBuffer.toString("base64")}`;
        image_hash = crypto.createHash("sha256").update(processedBuffer).digest("hex");
      }
    }

    if (!image_base64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }


    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    const sendEvent = (event: string, data: any) => {
      writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
    };

    // Run agent async loop
    (async () => {
      try {
        const agentGen = runAgentStateLoop(image_base64, modality, patient_id);
        for await (const event of agentGen) {
          if (event.type === "thinking") {
            sendEvent("agent_thinking", { thought: event.data });
          } else if (event.type === "tool_call") {
            sendEvent("tool_call", { tool_name: event.data.tool, input: event.data.input });
          } else if (event.type === "tool_result") {
            sendEvent("tool_result", { tool_name: event.data.tool, result: event.data.result });
          } else if (event.type === "complete") {
            sendEvent("diagnosis_complete", event.data);
          }
        }
      } catch (error: any) {
        sendEvent("error", { message: error.message || "Internal Agent Error" });
      } finally {
        writer.close();
      }
    })();

    return new Response(responseStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
