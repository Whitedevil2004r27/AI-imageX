"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, FileText, History, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchCase() {
      setLoading(true);
      const res = await fetch(`/api/diagnoses/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCaseData(data);
      }
      setLoading(false);
    }
    fetchCase();
  }, [id]);

  const [downloading, setDownloading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Simulate generation delay
    setTimeout(() => {
      setDownloading(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 1500);
  };

  const handleAction = async (action: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      const endpoint = `/api/diagnoses/${id}/${action === "approved" ? "approve" : "reject"}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          reviewer_notes: notes,
          rejection_reason: notes 
        }),
      });

      if (res.ok) {
        setCaseData({ ...caseData, human_review_status: action });
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-text-secondary">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Fetching clinical case file...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-text-secondary">
        <AlertCircle className="w-12 h-12 text-error mb-4 opacity-50" />
        <p className="text-lg font-medium text-text-primary">Case Not Found</p>
        <Link href="/cases" className="text-accent hover:underline mt-2">Return to Case Ledger</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {showNotification && (
        <div className="fixed top-6 right-6 p-4 rounded-2xl bg-success text-text-primary shadow-2xl shadow-success/30 flex items-center gap-3 animate-slideIn z-50">
          <CheckCircle2 className="w-5 h-5" />
          <div className="text-sm font-bold">
            Report Downloaded Successfully
          </div>
        </div>
      )}

      {/* Back Nav */}
      <div className="flex items-center justify-between">
        <Link href="/cases" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Cases
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
            caseData.human_review_status === "approved" ? "bg-success/20 text-success border-success/30" :
            caseData.human_review_status === "rejected" ? "bg-error/20 text-error border-error/30" :
            "bg-warning/20 text-warning border-warning/30 animate-pulse"
          }`}>
            {(caseData.human_review_status || "pending").toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Case Record: {caseData.id}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-surface/50 p-3 rounded-xl border border-border">
                <span className="text-text-secondary block text-xs">Patient ID</span>
                <span className="text-text-primary font-semibold mt-1 block">{caseData.patient_id}</span>
              </div>
              <div className="bg-surface/50 p-3 rounded-xl border border-border">
                <span className="text-text-secondary block text-xs">Modality</span>
                <span className="text-text-primary font-semibold mt-1 block uppercase">{caseData.modality || "N/A"}</span>
              </div>
              <div className="bg-surface/50 p-3 rounded-xl border border-border">
                <span className="text-text-secondary block text-xs">Urgency</span>
                <span className={`font-semibold mt-1 block uppercase ${caseData.urgency_level === "urgent" || caseData.urgency_level === "emergent" ? "text-warning" : "text-accent"}`}>
                  {caseData.urgency_level || "Routine"}
                </span>
              </div>
              <div className="bg-surface/50 p-3 rounded-xl border border-border">
                <span className="text-text-secondary block text-xs">Confidence</span>
                <span className="text-text-primary font-semibold mt-1 block">{caseData.confidence_score}%</span>
              </div>
            </div>

            <div>
              <h3 className="text-md font-bold text-accent mt-4">Primary Assessment</h3>
              <p className="text-base font-bold text-text-primary mt-1">{caseData.diagnosis_primary || "Pending Diagnosis"}</p>
              <div className="text-sm text-text-secondary bg-surface p-3 rounded-xl mt-2 border border-border/50">
                <p className="font-semibold mb-1 text-text-primary">Findings Summary:</p>
                {caseData.findings_structured?.findings || "No findings available."}
              </div>
            </div>

            {/* Differential Diagnosis */}
            {caseData.diagnosis_differential && caseData.diagnosis_differential.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">Differential Diagnosis</h3>
                <div className="flex flex-wrap gap-2">
                  {caseData.diagnosis_differential.map((d: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-text-secondary font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Report Section */}
            {caseData.agent_reasoning?.report && (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Full Clinical Report</h3>
                  <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="text-xs text-accent hover:underline font-bold flex items-center gap-2"
                  >
                    {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {downloading ? "Generating..." : "Download PDF (v1.0)"}
                  </button>
                </div>
                <div 
                  className="prose prose-invert max-w-none text-sm text-text-secondary bg-black/20 p-6 rounded-2xl border border-border/50 font-mono leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: caseData.agent_reasoning.report }}
                />
              </div>
            )}
          </div>

          {/* Human Clinician Approval Workflow */}
          {caseData.human_review_status === "pending" && (
            <div className="p-6 rounded-2xl bg-surface border border-warning/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <h2 className="text-lg font-semibold text-text-primary">Human Oversight Verification</h2>
              </div>

              <div className="space-y-3">
                <label className="block text-xs text-text-secondary mb-1">Reviewer Directives / Override Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Enter clinical justification or audit notes..."
                  className="w-full px-4 py-2 rounded-xl bg-black/30 border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => handleAction("approved")}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-success text-text-primary font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-success/20 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Approve Diagnosis
                </button>
                <button
                  onClick={() => handleAction("rejected")}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-error text-text-primary font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-error/20 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Reject / Escalate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audit Trail Timeline */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Agent Audit Trail</h2>
            </div>
            <Link
              href={`/cases/${id}/audit`}
              className="text-xs font-medium text-accent hover:underline"
            >
              Full Trail →
            </Link>
          </div>

          <div className="space-y-6 pt-2">
            {(caseData.audit_log || []).slice(0, 5).map((event: any, i: number) => (
              <div key={event.id} className="flex gap-3 relative">
                {i !== (caseData.audit_log?.length || 0) - 1 && (
                  <div className="absolute top-6 left-[15px] bottom-[-24px] w-[2px] bg-border/50" />
                )}
                <div className="w-8 h-8 rounded-full bg-surface border border-primary flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary font-mono">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-text-primary uppercase">{event.event_type.replace(/_/g, ' ')}</p>
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    {event.tool_name ? `Tool: ${event.tool_name}` : "System event"}
                  </p>
                </div>
              </div>
            ))}
            {(!caseData.audit_log || caseData.audit_log.length === 0) && (
              <p className="text-xs text-text-secondary text-center py-4 italic">No audit events recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
