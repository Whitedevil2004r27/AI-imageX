"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  BrainCircuit, 
  Activity, 
  Search, 
  FileText, 
  Lock, 
  ArrowRight,
  ChevronRight,
  Database,
  Cpu
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-[1536px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-imageX
            </span>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
            <a href="#features" className="hover:text-primary transition-colors">Capabilities</a>
            <a href="#compliance" className="hover:text-primary transition-colors">Compliance</a>
            <a href="#orchestration" className="hover:text-primary transition-colors">Orchestration</a>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              href="/login" 
              className="text-[10px] font-black text-text-secondary hover:text-text-primary transition-all uppercase tracking-[0.2em]"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-4 md:px-8 py-2.5 md:py-3 rounded-xl bg-primary text-text-primary text-[10px] font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all uppercase tracking-[0.2em]"
            >
              Request Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-28 md:pt-20 pb-20 px-6 md:px-12">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
          <div className="space-y-8 md:space-y-12 animate-slideIn flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary tracking-[0.2em] uppercase">
              <BrainCircuit className="w-4 h-4" />
              Agentic Medical Intelligence
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-bold leading-[0.95] tracking-tighter">
                Next-Gen <br className="hidden sm:block" />
                <span className="text-accent italic">Radiology</span> <br className="hidden sm:block" />
                Assistant
              </h1>
              <p className="text-base md:text-xl text-text-secondary max-w-xl leading-relaxed pt-2 md:pt-4 mx-auto lg:mx-0">
                AI-imageX leverages advanced reasoning to orchestrate diagnostic image processing and HIPAA clinical precision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 md:pt-6 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className="px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-primary text-text-primary font-bold shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Start Diagnostic Run
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login" 
                className="px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-surface border border-border text-text-primary font-bold hover:bg-surface/80 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                View Case Ledger
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 sm:gap-12 pt-8 md:pt-12 border-t border-border/50 w-full">
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-2xl md:text-4xl font-bold text-text-primary">99.9%</span>
                <span className="text-[8px] md:text-[10px] text-text-secondary uppercase font-black tracking-widest leading-tight">Audit <br />Compliance</span>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-2xl md:text-4xl font-bold text-text-primary">&lt; 15s</span>
                <span className="text-[8px] md:text-[10px] text-text-secondary uppercase font-black tracking-widest leading-tight">Inference <br />Latency</span>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-2xl md:text-4xl font-bold text-text-primary">Native</span>
                <span className="text-[8px] md:text-[10px] text-text-secondary uppercase font-black tracking-widest leading-tight">Multi <br />Modality</span>
              </div>
            </div>
          </div>

          <div className="relative group animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[4rem] blur-3xl group-hover:scale-110 transition-transform duration-1000 -z-10" />
            <div className="relative rounded-[3.5rem] border border-border/50 overflow-hidden shadow-2xl shadow-black/80 aspect-video">
              <img 
                src="/hero_medical_ai_interface.png" 
                alt="AI-imageX Interface" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
            </div>
            
            {/* Floating UI Badges */}
            <div className="absolute -top-8 -right-8 p-5 rounded-3xl bg-surface/80 border border-primary/30 shadow-2xl backdrop-blur-2xl animate-float hidden xl:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center border border-success/30">
                  <ShieldCheck className="w-7 h-7 text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">HIPAA Secure</p>
                  <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">AES-256 Enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 md:py-40 px-6 md:px-12 bg-surface/10 relative">
        <div className="max-w-[1536px] mx-auto">
          <div className="text-center space-y-4 md:space-y-8 mb-16 md:mb-32">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight">Engineered for Clinical Precision</h2>
            <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Beyond simple classification, AI-imageX mimics the specialized reasoning loop 
              of a senior consultant radiologist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {[
              {
                icon: <Search className="w-6 h-6" />,
                title: "Deep Vision Analysis",
                desc: "High-resolution processing of DICOM and imagery with Sharp™ preprocessing for sub-millimeter abnormality detection."
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Precedent Matching",
                desc: "Real-time semantic search across historical diagnostic data using Supabase pgvector for accurate similarity comparisons."
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: "Agentic Orchestration",
                desc: "Autonomous tool execution loop that iterates on findings until confidence thresholds are met, reducing clinical fatigue."
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: "Immutable Audit Trail",
                desc: "Every reasoning step, tool input, and confidence shift is logged for medical-legal compliance and peer review."
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Structured Reporting",
                desc: "Automated generation of detailed clinical reports with differential diagnoses, ICD-10 coding, and urgency routing."
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Human Oversight",
                desc: "Clinician-in-the-loop validation for high-risk findings, ensuring AI serves as a catalyst, not a replacement."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-surface border border-border/50 hover:border-primary/50 transition-all duration-700 group flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 sm:mb-10 group-hover:scale-110 transition-transform duration-700">
                  {feature.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 md:py-32 px-6 md:px-12 border-t border-border/30">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight">AI-imageX</span>
            </div>
            <p className="text-sm text-text-secondary font-medium">© 2026 Advanced Medical Agentic Systems Inc. <br /> HIPAA Secure & GDPR Compliant Clinical Gateway.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 md:gap-x-16 gap-y-4 justify-center md:justify-end text-[10px] font-black uppercase tracking-widest text-text-secondary">
            <Link href="/signup" className="hover:text-primary transition-colors">Enroll Institution</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">FDA Status</Link>
            <Link href="#" className="hover:text-primary transition-colors">Security Audit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
