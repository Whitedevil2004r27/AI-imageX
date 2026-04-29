import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DiagnosisRecord {
  id: string;
  patient_id: string;
  modality: string;
  diagnosis_primary: string;
  diagnosis_differential: string[];
  confidence_score: number;
  recommended_specialist: string | null;
  urgency_level: "routine" | "urgent" | "emergent";
  human_review_status: "pending" | "approved" | "rejected" | "needs_revision";
  findings_structured: any;
  agent_reasoning: any;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  diagnosis_id: string;
  event_type: string;
  tool_name: string | null;
  input_data: any;
  output_data: any;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "patient" | "clinician" | "admin";
  specialization: string | null;
  two_fa_enabled: boolean;
}

// ─── Agent Store ─────────────────────────────────────────────────────────────

interface AgentState {
  isAnalyzing: boolean;
  currentStep: string;
  logs: Array<{
    thought?: string;
    tool_name?: string;
    input?: any;
    result?: any;
    timestamp: string;
  }>;
  diagnosisResult: any | null;

  setAnalyzing: (v: boolean) => void;
  setCurrentStep: (step: string) => void;
  addLog: (log: AgentState["logs"][0]) => void;
  setDiagnosisResult: (result: any) => void;
  resetAgent: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  isAnalyzing: false,
  currentStep: "idle",
  logs: [],
  diagnosisResult: null,

  setAnalyzing: (v) => set({ isAnalyzing: v }),
  setCurrentStep: (step) => set({ currentStep: step }),
  addLog: (log) => set((s) => ({ logs: [...s.logs, log] })),
  setDiagnosisResult: (result) =>
    set({ diagnosisResult: result, isAnalyzing: false }),
  resetAgent: () =>
    set({ isAnalyzing: false, currentStep: "idle", logs: [], diagnosisResult: null }),
}));

// ─── Auth Store ──────────────────────────────────────────────────────────────

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;

  login: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "usr_demo_001",
    email: "dr.house@aix.hospital.org",
    name: "Dr. Gregory House",
    role: "clinician",
    specialization: "Infectious Disease / Nephrology",
    two_fa_enabled: false,
  },
  isAuthenticated: true,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// ─── Cases Store ─────────────────────────────────────────────────────────────

interface CasesState {
  cases: DiagnosisRecord[];
  selectedCase: DiagnosisRecord | null;
  auditLogs: AuditLogEntry[];

  setCases: (cases: DiagnosisRecord[]) => void;
  selectCase: (c: DiagnosisRecord | null) => void;
  setAuditLogs: (logs: AuditLogEntry[]) => void;
  updateCaseStatus: (id: string, status: DiagnosisRecord["human_review_status"]) => void;
}

export const useCasesStore = create<CasesState>((set) => ({
  cases: [],
  selectedCase: null,
  auditLogs: [],

  setCases: (cases) => set({ cases }),
  selectCase: (c) => set({ selectedCase: c }),
  setAuditLogs: (logs) => set({ auditLogs: logs }),
  updateCaseStatus: (id, status) =>
    set((s) => ({
      cases: s.cases.map((c) =>
        c.id === id ? { ...c, human_review_status: status } : c
      ),
    })),
}));
