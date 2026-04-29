"use client";

import { AlertCircle, BadgeAlert, CheckCircle2, ShieldCheck } from "lucide-react";

interface Finding {
  findings: string;
  anatomical_regions: string[];
  abnormalities: Array<{
    region: string;
    description: string;
    severity: "mild" | "moderate" | "severe";
  }>;
  confidence: number;
  requires_comparison: boolean;
}

interface CasesCarouselProps {
  similarCases: Array<{
    case_id: string;
    diagnosis: string;
    confidence: number;
    similarity_score: number;
    outcome: string;
  }>;
}

interface FindingsPanelProps {
  findings: Finding | null;
  similarCases: Array<any>;
}

export default function FindingsPanel({ findings, similarCases }: FindingsPanelProps) {
  if (!findings) return null;

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe": return "bg-error/20 text-error border-error/30 shadow-[0_0_10px_rgba(239,68,68,0.15)]";
      case "moderate": return "bg-warning/20 text-warning border-warning/30";
      case "mild": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-surface/50 text-text-secondary border-border";
    }
  };

  return (
    <div className="space-y-8">
      {/* Structured Findings */}
      <div className="p-8 rounded-[2rem] bg-surface border border-border space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">Vision Analysis Findings</h2>
        </div>
        
        <p className="text-sm text-text-secondary leading-relaxed bg-black/20 p-6 rounded-2xl border border-border/50">
          {findings.findings}
        </p>

        <div className="grid grid-cols-2 gap-6 text-sm mt-4">
          <div className="bg-surface/50 p-4 rounded-2xl border border-border">
            <span className="text-text-secondary block text-xs font-bold uppercase tracking-widest mb-1">Regions Evaluated</span>
            <span className="text-text-primary font-semibold block">
              {findings.anatomical_regions.join(", ")}
            </span>
          </div>
          <div className="bg-surface/50 p-4 rounded-2xl border border-border">
            <span className="text-text-secondary block text-xs font-bold uppercase tracking-widest mb-1">Prior Comparison</span>
            <span className={`font-semibold block ${findings.requires_comparison ? "text-warning" : "text-success"}`}>
              {findings.requires_comparison ? "Indicated" : "Not Required"}
            </span>
          </div>
        </div>
      </div>

      {/* Abnormalities */}
      <div className="p-8 rounded-[2rem] bg-surface border border-border space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <BadgeAlert className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">Detected Abnormalities</h2>
        </div>

        {findings.abnormalities.length === 0 ? (
          <div className="flex items-center gap-3 text-success text-sm bg-success/10 p-5 rounded-2xl border border-success/20">
            <CheckCircle2 className="w-5 h-5" />
            No explicit structural abnormalities identified.
          </div>
        ) : (
          <div className="space-y-4">
            {findings.abnormalities.map((abn, i) => (
              <div key={i} className="p-5 rounded-2xl bg-surface/50 border border-border flex items-center justify-between group hover:border-primary/50 transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text-primary">{abn.description}</p>
                  <p className="text-xs text-text-secondary">Anatomical Region: {abn.region}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${getSeverityStyle(abn.severity)}`}>
                  {abn.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Similar Cases Carousel */}
      {similarCases && similarCases.length > 0 && (
        <div className="p-8 rounded-[2rem] bg-surface border border-border space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">Precedent Matches</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {similarCases.map((c, i) => (
              <div key={i} className="min-w-[260px] max-w-[280px] p-4 rounded-xl bg-surface/50 border border-border flex flex-col justify-between space-y-3 group hover:border-accent/50 transition-all flex-shrink-0">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-text-secondary">{c.case_id}</span>
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {Math.round(c.similarity_score * 100)}% Match
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-text-primary mt-2 truncate">{c.diagnosis}</h3>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">{c.outcome}</p>
                </div>
                <div className="text-xs bg-black/20 p-2 rounded-lg font-semibold text-text-primary text-center">
                  AI Confidence: {c.confidence}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
