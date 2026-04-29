"use client";

import { ShieldCheck, FileText, Printer, AlertTriangle, UserCog } from "lucide-react";

interface ReportProps {
  report: {
    report_html: string;
    report_text: string;
    icd_codes: string[];
  } | null;
  primaryDiagnosis: string;
  differentials: string[];
  confidence: number;
  referral: {
    should_refer: boolean;
    specialist_type: string;
    urgency: string;
    clinical_justification: string;
  } | null;
}

export default function DiagnosisReport({
  report,
  primaryDiagnosis,
  differentials,
  confidence,
  referral
}: ReportProps) {
  if (!report) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border space-y-6 print:bg-white print:text-black print:p-0">
      {/* Report Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 print:border-black">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary print:text-black" />
          <h2 className="text-lg font-semibold text-text-primary print:text-black">
            Clinical Evaluation Record
          </h2>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface/50 text-text-primary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all duration-300 print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print / Export PDF
        </button>
      </div>

      {/* Assessment Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <span className="text-xs text-text-secondary block">Primary Diagnosis</span>
          <span className="text-base font-bold text-primary mt-1 block">{primaryDiagnosis}</span>
        </div>

        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
          <span className="text-xs text-text-secondary block">Confidence Threshold</span>
          <span className="text-base font-bold text-accent mt-1 block">{confidence}%</span>
        </div>

        <div className="p-4 rounded-xl bg-black/30 border border-border">
          <span className="text-xs text-text-secondary block">ICD-10 Codes</span>
          <span className="text-base font-mono font-bold text-text-primary mt-1 block">
            {report.icd_codes?.length ? report.icd_codes.join(", ") : "N/A"}
          </span>
        </div>
      </div>

      {/* Referral Check */}
      {referral && referral.should_refer && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-bold text-warning">Specialist Referral Triggered</p>
            <p className="text-text-primary font-semibold">
              Target Specialist: <span className="underline">{referral.specialist_type}</span> ({referral.urgency})
            </p>
            <p className="text-text-secondary text-xs leading-relaxed mt-1">
              Justification: {referral.clinical_justification}
            </p>
          </div>
        </div>
      )}

      {/* Differentials */}
      {differentials && differentials.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-text-secondary tracking-wider uppercase">
            Differential Diagnoses (Ranked)
          </span>
          <div className="flex flex-wrap gap-2">
            {differentials.map((d, i) => (
              <span
                key={d}
                className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-text-primary"
              >
                {i + 1}. {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-text-secondary tracking-wider uppercase flex items-center gap-1">
          <UserCog className="w-3 h-3" />
          Required Next Actions
        </span>
        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 bg-surface/40 p-4 rounded-xl border border-border">
          {confidence < 80 ? (
            <li className="text-warning font-medium">Schedule manual clinician case review (Confidence &lt; 80%)</li>
          ) : (
            <li className="text-success font-medium">Confidence threshold met for autonomous filing</li>
          )}
          {referral?.should_refer && (
            <li>Initiate specialist routing workflows for {referral.specialist_type}</li>
          )}
          <li>Archive raw evaluation metrics into medical vault ledger</li>
        </ul>
      </div>

      {/* HTML Report Content */}
      <div className="mt-6 border-t border-border pt-4 print:border-black">
        <div
          className="prose prose-invert max-w-none print:text-black"
          dangerouslySetInnerHTML={{ __html: report.report_html }}
        />
      </div>
    </div>
  );
}
