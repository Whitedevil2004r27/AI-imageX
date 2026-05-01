"use client";

import { useState } from "react";
import { ShieldCheck, FileText, Printer, AlertTriangle, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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

  const [showFHIR, setShowFHIR] = useState<boolean>(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const fhirPayload = {
    resourceType: "DiagnosticReport",
    id: `DR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: confidence >= 80 ? "final" : "preliminary",
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/v2-0074",
        code: "RAD",
        display: "Radiology"
      }]
    }],
    code: {
      coding: [{
        system: "http://hl7.org/fhir/sid/icd-10",
        code: report?.icd_codes?.[0] || "Z00.0",
        display: primaryDiagnosis
      }]
    },
    conclusion: primaryDiagnosis,
    conclusionCode: [{
      coding: [{
        system: "http://hl7.org/fhir/sid/icd-10",
        code: report?.icd_codes?.[0] || "Z00.0"
      }]
    }]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-surface border border-border space-y-6 print:bg-white print:text-black print:p-0"
    >
      {/* Report Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 print:border-black">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FileText className="w-5 h-5 text-primary print:text-black" />
          </motion.div>
          <h2 className="text-lg font-semibold text-text-primary print:text-black">
            Clinical Evaluation Record
          </h2>
        </div>
        
        <div className="flex items-center gap-2 print:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFHIR(!showFHIR)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-surface/50 text-accent hover:bg-accent/20 border border-border hover:border-accent/50 transition-all duration-300"
          >
            {showFHIR ? "Hide FHIR JSON" : "FHIR HL7 Export"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-surface/50 text-text-primary hover:bg-primary/20 border border-border hover:border-primary/50 transition-all duration-300"
          >
            <Printer className="w-4 h-4" />
            Print
          </motion.button>
        </div>
      </div>

      {/* FHIR Drawer */}
      <AnimatePresence>
        {showFHIR && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-xl bg-black/40 border border-accent/30 space-y-2 font-mono text-xs print:hidden overflow-hidden"
          >
            <div className="text-accent font-black uppercase tracking-widest text-[9px]">HL7 FHIR DiagnosticReport Resource</div>
            <pre className="text-text-secondary overflow-x-auto max-w-full whitespace-pre-wrap bg-black/20 p-3 rounded-lg border border-border/40">
              {JSON.stringify(fhirPayload, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assessment Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-primary/10 border border-primary/20"
        >
          <span className="text-xs text-text-secondary block">Primary Diagnosis</span>
          <span className="text-base font-bold text-primary mt-1 block">{primaryDiagnosis}</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-accent/10 border border-accent/20"
        >
          <span className="text-xs text-text-secondary block">Confidence Threshold</span>
          <span className="text-base font-bold text-accent mt-1 block">{confidence}%</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-black/30 border border-border"
        >
          <span className="text-xs text-text-secondary block">ICD-10 Codes</span>
          <span className="text-base font-mono font-bold text-text-primary mt-1 block">
            {report.icd_codes?.length ? report.icd_codes.join(", ") : "N/A"}
          </span>
        </motion.div>
      </div>

      {/* Referral Check */}
      <AnimatePresence>
        {referral && referral.should_refer && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            </motion.div>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-warning">Specialist Referral Triggered</p>
              <p className="text-text-primary font-semibold">
                Target Specialist: <span className="underline">{referral.specialist_type}</span> ({referral.urgency})
              </p>
              <p className="text-text-secondary text-xs leading-relaxed mt-1">
                Justification: {referral.clinical_justification}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Differentials */}
      {differentials && differentials.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <span className="text-xs font-bold text-text-secondary tracking-wider uppercase">
            Differential Diagnoses (Ranked)
          </span>
          <div className="flex flex-wrap gap-2">
            {differentials.map((d, i) => (
              <motion.span
                key={d}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-text-primary cursor-pointer hover:border-primary/50 transition-colors"
              >
                {i + 1}. {d}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Items */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <span className="text-xs font-bold text-text-secondary tracking-wider uppercase flex items-center gap-1">
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <UserCog className="w-3 h-3" />
          </motion.span>
          Required Next Actions
        </span>
        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 bg-surface/40 p-4 rounded-xl border border-border">
          {confidence < 80 ? (
            <motion.li 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-warning font-medium"
            >
              Schedule manual clinician case review (Confidence &lt; 80%)
            </motion.li>
          ) : (
            <motion.li 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-success font-medium"
            >
              Confidence threshold met for autonomous filing
            </motion.li>
          )}
          {referral?.should_refer && (
            <li>Initiate specialist routing workflows for {referral.specialist_type}</li>
          )}
          <li>Archive raw evaluation metrics into medical vault ledger</li>
        </ul>
      </motion.div>

      {/* HTML Report Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 border-t border-border pt-4 print:border-black"
      >
        <div
          className="prose prose-invert max-w-none print:text-black"
          dangerouslySetInnerHTML={{ __html: report.report_html }}
        />
      </motion.div>
    </motion.div>
  );
}
