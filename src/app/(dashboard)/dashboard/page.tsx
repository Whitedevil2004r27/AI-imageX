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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-[70vh] text-text-secondary"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
        >
          <Loader2 className="w-12 h-12 text-primary mb-4" />
        </motion.div>
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg font-medium"
        >
          Loading clinical dashboard...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        className="relative p-8 rounded-2xl bg-gradient-to-r from-surface to-primary/10 border border-border overflow-hidden group"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_right,#7c3aed20,transparent_40%)]" 
        />
        <div className="relative z-10 max-w-2xl space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-text-primary"
          >
            Clinical Overview
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-base leading-relaxed"
          >
            Autonomous diagnostic pipeline is active. Review real-time findings and oversee specialist routing.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4 flex gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/diagnose"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-text-primary font-semibold hover:bg-primary-dark shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
              >
                New Diagnosis
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-text-primary font-semibold hover:bg-surface/80 hover:border-primary/30 transition-all duration-300"
              >
                View All Cases
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 20px 40px -12px rgba(124, 58, 237, 0.2)",
                borderColor: "rgba(124, 58, 237, 0.3)"
              }}
              className="p-6 rounded-2xl bg-surface border border-border transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">{stat.name}</span>
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="mt-4"
              >
                <span className="text-3xl font-bold text-text-primary tracking-tight">
                  {stat.value}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Sections Grid */}
      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Recent Cases */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Recent Cases</h2>
            <motion.div whileHover={{ x: 3 }}>
              <Link href="/cases" className="text-accent text-sm hover:underline flex items-center gap-1">
                View Ledger <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
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
                <AnimatePresence>
                  {recentCases.map((c, index) => (
                    <motion.tr 
                      key={c.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(124, 58, 237, 0.05)" }}
                      className="transition-colors"
                    >
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
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${c.confidence_score}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-full rounded-full ${c.confidence_score >= 80 ? 'bg-success' : c.confidence_score >= 60 ? 'bg-warning' : 'bg-error'}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.3 + index * 0.05 }}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          c.human_review_status === "approved" 
                            ? "bg-success/20 text-success border-success/30" 
                            : "bg-warning/20 text-warning border-warning/30"
                        }`}>
                          {c.human_review_status}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
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
        </motion.div>

        {/* Action Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/diagnose"
                  className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-primary hover:bg-surface/80 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg bg-primary/10 text-primary"
                    >
                      <ShieldAlert className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-text-primary">Perform Diagnosis</p>
                      <p className="text-xs text-text-secondary">Upload diagnostic image</p>
                    </div>
                  </div>
                  <motion.span 
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 text-text-secondary" />
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/cases?status=pending"
                  className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-warning hover:bg-surface/80 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="p-2 rounded-lg bg-warning/10 text-warning"
                    >
                      <Clock className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-text-primary">Pending Reviews</p>
                      <p className="text-xs text-text-secondary">Needs human oversight</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-surface to-accent/5 border border-border relative overflow-hidden"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" 
            />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Compliance Note</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              This system implements full medical audit compliance. Every decision step, image preprocessing step, and external data lookup is securely logged.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
