"use client";

import { useState } from "react";
import ImageUploadZone from "@/components/ImageUploadZone";
import AgentThinkingDisplay, { AgentThought } from "@/components/AgentThinkingDisplay";
import FindingsPanel from "@/components/FindingsPanel";
import DiagnosisReport from "@/components/DiagnosisReport";
import { ShieldAlert } from "lucide-react";

import { useToast } from "@/components/Toast";

export default function DiagnosePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modality, setModality] = useState<string>("xray");
  const [patientId, setPatientId] = useState<string>("P-0192");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [logs, setLogs] = useState<AgentThought[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const { addToast } = useToast();
  
  const [diagnosisData, setDiagnosisData] = useState<{
    findings: any;
    similar_cases: any[];
    referral: any;
    report: any;
    diagnosis_primary: string;
    diagnosis_differential: string[];
    confidence: number;
  } | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setLogs([]);
    setIsComplete(false);
    setDiagnosisData(null);
  };

  const startDiagnosis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setLogs([]);
    setIsComplete(false);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("modality", modality);
    formData.append("patient_id", patientId);

    try {
      const response = await fetch("/api/agent/diagnose", {
        method: "POST",
        body: formData,
      });

      if (!response.body) throw new Error("Stream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.trim()) continue;
          
          const eventMatch = line.match(/^event: (.+)$/m);
          const dataMatch = line.match(/^data: (.+)$/m);

          if (eventMatch && dataMatch) {
            const eventName = eventMatch[1];
            const eventData = JSON.parse(dataMatch[1]);
            const timestamp = new Date().toLocaleTimeString();

            if (eventName === "agent_thinking") {
              setLogs(prev => [...prev, { thought: eventData.thought, timestamp }]);
            } else if (eventName === "tool_call") {
              setLogs(prev => [...prev, { tool_name: eventData.tool_name, input: eventData.input, timestamp }]);
            } else if (eventName === "tool_result") {
              setLogs(prev => [...prev, { tool_name: eventData.tool_name, result: eventData.result, timestamp }]);
            } else if (eventName === "diagnosis_complete") {
              setDiagnosisData(eventData);
              setIsComplete(true);
              setIsAnalyzing(false);
              addToast("Autonomous diagnosis complete. Findings ready for review.", "success");
            } else if (eventName === "error") {
              addToast(eventData.message, "error");
              setIsAnalyzing(false);
            }
          }
        }
      }
    } catch (err: any) {
      addToast(err.message || "Diagnostic run failed", "error");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Autonomous Diagnosis Pipeline</h1>
          <p className="text-sm text-text-secondary">Multi-step automated radiological and dermatological intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Control panel and Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-base font-semibold text-text-primary">Diagnosis Parameters</h3>
            
            <div>
              <label className="block text-xs text-text-secondary mb-2">Imaging Modality</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                disabled={isAnalyzing}
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="xray">X-Ray (Chest, Ortho)</option>
                <option value="ct">CT Scan (Head, Internal)</option>
                <option value="mri">MRI (Joints, Soft Tissue)</option>
                <option value="dermatology">Dermatology (Lesions)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-2">Patient ID Context</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                disabled={isAnalyzing}
                placeholder="P-XXXX"
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-base font-semibold text-text-primary">Upload Evaluation Image</h3>
            <ImageUploadZone onImageSelect={handleImageSelect} />
            
            <button
              onClick={startDiagnosis}
              disabled={!selectedFile || isAnalyzing}
              className={`w-full py-3 px-6 rounded-xl font-bold text-text-primary transition-all duration-300 ${
                !selectedFile || isAnalyzing
                  ? "bg-surface border border-border text-text-secondary cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20 hover:shadow-primary/40"
              }`}
            >
              {isAnalyzing ? "Analyzing..." : "Run Diagnosis Agent"}
            </button>
          </div>
        </div>

        {/* Center Column: Thinking Display */}
        <div className="lg:col-span-1">
          <AgentThinkingDisplay 
            logs={logs} 
            isComplete={isComplete} 
            confidence={diagnosisData?.confidence || 0} 
          />
        </div>

        {/* Right Column: Final Reports and Results */}
        <div className="lg:col-span-1 overflow-y-auto h-[calc(100vh-200px)] space-y-6 pr-2">
          {diagnosisData ? (
            <>
              <FindingsPanel
                findings={diagnosisData.findings}
                similarCases={diagnosisData.similar_cases}
              />
              <DiagnosisReport
                report={diagnosisData.report}
                primaryDiagnosis={diagnosisData.diagnosis_primary}
                differentials={diagnosisData.diagnosis_differential}
                confidence={diagnosisData.confidence}
                referral={diagnosisData.referral}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full border border-dashed border-border rounded-2xl bg-surface/20 text-text-secondary p-8 text-center">
              <ShieldAlert className="w-10 h-10 opacity-30 mb-4 text-primary" />
              <p className="text-sm font-medium">No report computed yet.</p>
              <p className="text-xs mt-1">Select an image and execute workflow to view structured findings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
