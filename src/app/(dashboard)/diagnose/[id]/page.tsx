"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Loader2 } from "lucide-react";
import FindingsPanel from "@/components/FindingsPanel";
import DiagnosisReport from "@/components/DiagnosisReport";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DiagnosisDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiagnosis() {
      try {
        const res = await fetch(`/api/diagnoses/${id}`);
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDiagnosis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Retrieving diagnosis record...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-text-secondary">
        Diagnosis record not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <Link
          href="/diagnose"
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Diagnosis
        </Link>
        <Link
          href={`/cases/${id}/audit`}
          className="text-xs font-medium text-accent hover:underline"
        >
          View Full Audit Trail →
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Diagnosis: {data.diagnosis_primary}
          </h1>
          <p className="text-sm text-text-secondary">
            Case {data.id} — {data.modality} — Created{" "}
            {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Agent summary badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Confidence</span>
          <span className={`text-2xl font-bold block mt-1 ${
            data.confidence_score >= 80 ? "text-success" :
            data.confidence_score >= 60 ? "text-warning" : "text-error"
          }`}>
            {data.confidence_score}%
          </span>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Agent Iterations</span>
          <span className="text-2xl font-bold text-accent block mt-1">
            {data.agent_reasoning?.iterations || "—"}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Urgency</span>
          <span className={`text-2xl font-bold block mt-1 ${
            data.urgency_level === "emergent" ? "text-error" :
            data.urgency_level === "urgent" ? "text-warning" : "text-accent"
          }`}>
            {data.urgency_level?.toUpperCase() || "—"}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-text-secondary block">Review Status</span>
          <span className={`text-2xl font-bold block mt-1 ${
            data.human_review_status === "approved" ? "text-success" :
            data.human_review_status === "rejected" ? "text-error" : "text-warning"
          }`}>
            {data.human_review_status?.toUpperCase() || "—"}
          </span>
        </div>
      </div>

      {/* Findings */}
      <FindingsPanel
        findings={data.findings_structured}
        similarCases={[]}
      />

      {/* Report */}
      <DiagnosisReport
        report={{
          report_html: `<div class="text-sm text-text-secondary">Full report for case ${data.id}.</div>`,
          report_text: `Diagnosis: ${data.diagnosis_primary}`,
          icd_codes: data.findings_structured?.findings?.includes("Pneumonia") ? ["J18.9"] : ["Z00.00"],
        }}
        primaryDiagnosis={data.diagnosis_primary}
        differentials={data.diagnosis_differential || []}
        confidence={data.confidence_score}
        referral={data.referral || null}
      />
    </div>
  );
}
