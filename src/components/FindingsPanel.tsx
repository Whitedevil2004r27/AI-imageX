"use client";

import { AlertCircle, BadgeAlert, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* Structured Findings */}
      <motion.div 
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
        className="p-8 rounded-[2rem] bg-surface border border-border space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShieldCheck className="w-5 h-5 text-accent" />
          </motion.div>
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">Vision Analysis Findings</h2>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-text-secondary leading-relaxed bg-black/20 p-6 rounded-2xl border border-border/50"
        >
          {findings.findings}
        </motion.p>

        <div className="grid grid-cols-2 gap-6 text-sm mt-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-surface/50 p-4 rounded-2xl border border-border"
          >
            <span className="text-text-secondary block text-xs font-bold uppercase tracking-widest mb-1">Regions Evaluated</span>
            <span className="text-text-primary font-semibold block">
              {findings.anatomical_regions.join(", ")}
            </span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-surface/50 p-4 rounded-2xl border border-border"
          >
            <span className="text-text-secondary block text-xs font-bold uppercase tracking-widest mb-1">Prior Comparison</span>
            <span className={`font-semibold block ${findings.requires_comparison ? "text-warning" : "text-success"}`}>
              {findings.requires_comparison ? "Indicated" : "Not Required"}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Abnormalities */}
      <motion.div 
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-8 rounded-[2rem] bg-surface border border-border space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BadgeAlert className="w-5 h-5 text-warning" />
          </motion.div>
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">Detected Abnormalities</h2>
        </div>

        {findings.abnormalities.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 text-success text-sm bg-success/10 p-5 rounded-2xl border border-success/20"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </motion.span>
            No explicit structural abnormalities identified.
          </motion.div>
        ) : (
          <div className="space-y-4">
            {findings.abnormalities.map((abn, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-5 rounded-2xl bg-surface/50 border border-border flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text-primary">{abn.description}</p>
                  <p className="text-xs text-text-secondary">Anatomical Region: {abn.region}</p>
                </div>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 + i * 0.1 }}
                  className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${getSeverityStyle(abn.severity)}`}
                >
                  {abn.severity}
                </motion.span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Similar Cases Carousel */}
      <AnimatePresence>
        {similarCases && similarCases.length > 0 && (
          <motion.div 
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-[2rem] bg-surface border border-border space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-5 h-5 text-primary" />
              </motion.div>
              <h2 className="text-lg font-bold text-text-primary uppercase tracking-wider">Precedent Matches</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {similarCases.map((c, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 15px 30px rgba(6, 182, 212, 0.2)",
                    borderColor: "rgba(6, 182, 212, 0.5)"
                  }}
                  className="min-w-[260px] max-w-[280px] p-4 rounded-xl bg-surface/50 border border-border flex flex-col justify-between space-y-3 transition-all flex-shrink-0 cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-text-secondary">{c.case_id}</span>
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.6 + i * 0.1 }}
                        className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full"
                      >
                        {Math.round(c.similarity_score * 100)}% Match
                      </motion.span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary mt-2 truncate">{c.diagnosis}</h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">{c.outcome}</p>
                  </div>
                  <div className="text-xs bg-black/20 p-2 rounded-lg font-semibold text-text-primary text-center">
                    AI Confidence: {c.confidence}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
