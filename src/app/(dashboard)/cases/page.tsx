"use client";

import { useState, useEffect } from "react";
import { FolderHeart, Search, Filter, ArrowUpDown, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalityFilter, setModalityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      setLoading(true);
      const { data, error } = await supabase
        .from("diagnoses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCases(data);
      }
      setLoading(false);
    }
    fetchCases();
  }, []);

  const filteredCases = cases
    .filter(c => 
      ((c.diagnosis_primary?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
       (c.patient_id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
       (c.id?.toLowerCase() || "").includes(searchTerm.toLowerCase())) &&
      (modalityFilter === "all" || (c.modality?.toLowerCase() || "") === modalityFilter.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "desc") {
        return (b.confidence_score || 0) - (a.confidence_score || 0);
      }
      return (a.confidence_score || 0) - (b.confidence_score || 0);
    });

  const toggleSort = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FolderHeart className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Clinical Case Ledger</h1>
          <p className="text-sm text-text-secondary">Filter, review, and verify historical records.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-2xl border border-border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-text-secondary w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Diagnosis, Patient ID, or Case ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={modalityFilter}
              onChange={(e) => setModalityFilter(e.target.value)}
              className="px-4 py-2 pr-8 rounded-xl bg-black/30 border border-border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Modalities</option>
              <option value="xray">X-Ray</option>
              <option value="ct">CT Scan</option>
              <option value="mri">MRI</option>
              <option value="dermatology">Dermatology</option>
            </select>
            <Filter className="absolute right-3 top-3 text-text-secondary w-4 h-4 pointer-events-none" />
          </div>

          <button
            onClick={toggleSort}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface text-text-primary text-sm font-medium border border-border hover:border-primary/50 transition-colors"
          >
            Confidence
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cases Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p>Loading clinical records...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-text-secondary text-sm font-medium">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-secondary">
                    No cases matching filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-text-primary">{c.id}</td>
                    <td className="py-4 px-4 text-text-secondary">{c.patient_id}</td>
                    <td className="py-4 px-4 text-text-primary font-bold">{c.diagnosis_primary || "Pending..."}</td>
                    <td className="py-4 px-4">
                      <span className={`font-bold ${c.confidence_score >= 80 ? 'text-success' : c.confidence_score >= 60 ? 'text-warning' : 'text-error'}`}>
                        {c.confidence_score || 0}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold uppercase ${
                        c.urgency_level === "emergent" ? "text-error" :
                        c.urgency_level === "urgent" ? "text-warning" :
                        "text-accent"
                      }`}>
                        {c.urgency_level || "Routine"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        c.human_review_status === "approved" 
                          ? "bg-success/20 text-success border-success/30" 
                          : "bg-warning/20 text-warning border-warning/30"
                      }`}>
                        {c.human_review_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 text-accent hover:underline"
                      >
                        Inspect
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
