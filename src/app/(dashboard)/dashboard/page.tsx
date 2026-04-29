"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      
      // Fetch Total Diagnoses
      const { count: totalCount } = await supabase.from("diagnoses").select("*", { count: "exact", head: true });
      
      // Fetch Avg Confidence
      const { data: confidenceData } = await supabase.from("diagnoses").select("confidence_score");
      const avgConfidence = confidenceData?.length 
        ? (confidenceData.reduce((acc, curr) => acc + (curr.confidence_score || 0), 0) / confidenceData.length).toFixed(1) 
        : 0;

      // Fetch Pending Referrals (urgency level urgent/emergent)
      const { count: pendingReferrals } = await supabase
        .from("diagnoses")
        .select("*", { count: "exact", head: true })
        .in("urgency_level", ["urgent", "emergent"]);

      // Fetch Human Reviews Pending
      const { count: humanReviews } = await supabase
        .from("diagnoses")
        .select("*", { count: "exact", head: true })
        .eq("human_review_status", "pending");

      setStats([
        { name: "Total Diagnoses", value: totalCount || 0, icon: ShieldAlert, color: "text-primary", bg: "bg-primary/10" },
        { name: "Avg Confidence", value: `${avgConfidence}%`, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
        { name: "Urgent Referrals", value: pendingReferrals || 0, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
        { name: "Reviews Pending", value: humanReviews || 0, icon: Users, color: "text-success", bg: "bg-success/10" },
      ]);

      // Fetch Recent Cases
      const { data: recentData } = await supabase
        .from("diagnoses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      setRecentCases(recentData || []);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-text-secondary">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading clinical dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-r from-surface to-primary/10 border border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,#7c3aed20,transparent_40%)]" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Clinical Overview
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Autonomous diagnostic pipeline is active. Review real-time findings and oversee specialist routing.
          </p>
          <div className="pt-4 flex gap-4">
            <Link
              href="/diagnose"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-text-primary font-semibold hover:bg-primary-dark shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
            >
              New Diagnosis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-text-primary font-semibold hover:bg-surface/80 transition-all duration-300"
            >
              View All Cases
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">{stat.name}</span>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-text-primary tracking-tight">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Cases */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Recent Cases</h2>
            <Link href="/cases" className="text-accent text-sm hover:underline flex items-center gap-1">
              View Ledger <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-text-secondary text-sm font-medium">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {recentCases.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-text-primary">
                      <Link href={`/cases/${c.id}`} className="hover:text-primary transition-colors">
                        {c.id}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-text-primary font-semibold">{c.diagnosis_primary || "Analyzing..."}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${c.confidence_score >= 80 ? 'text-success' : c.confidence_score >= 60 ? 'text-warning' : 'text-error'}`}>
                          {c.confidence_score}%
                        </span>
                        <div className="w-16 h-2 bg-surface/80 rounded-full overflow-hidden border border-border">
                          <div
                            className={`h-full rounded-full ${c.confidence_score >= 80 ? 'bg-success' : c.confidence_score >= 60 ? 'bg-warning' : 'bg-error'}`}
                            style={{ width: `${c.confidence_score}%` }}
                          />
                        </div>
                      </div>
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
                  </tr>
                ))}
                {recentCases.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-secondary">
                      No cases recorded in the system yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/diagnose"
                className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-primary hover:bg-surface/80 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Perform Diagnosis</p>
                    <p className="text-xs text-text-secondary">Upload diagnostic image</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/cases?status=pending"
                className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-warning hover:bg-surface/80 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10 text-warning">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Pending Reviews</p>
                    <p className="text-xs text-text-secondary">Needs human oversight</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-surface to-accent/5 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Compliance Note</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              This system implements full medical audit compliance. Every decision step, image preprocessing step, and external data lookup is securely logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
