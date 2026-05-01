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
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

export default function LandingPage() {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="max-w-[1536px] mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
          {/* Left: Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 md:gap-4 cursor-pointer"
          >
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30"
            >
              <Activity className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-lg md:text-xl font-bold tracking-tight animate-text-gradient">
              AI-imageX
            </span>
          </motion.div>

          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
            {["Capabilities", "Compliance", "Orchestration"].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -2, color: "#7c3aed" }}
                className="hover:text-primary transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-4 md:gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/login" 
                className="text-[10px] font-black text-text-secondary hover:text-text-primary transition-all uppercase tracking-[0.2em]"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)" }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup" 
                className="px-4 md:px-8 py-2.5 md:py-3 rounded-xl bg-primary text-text-primary text-[10px] font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all uppercase tracking-[0.2em]"
              >
                Request Access
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-28 md:pt-20 pb-20 px-6 md:px-12">
        {/* Animated Background Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10" 
        />

        <div className="max-w-[1536px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8 md:space-y-12 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div 
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary tracking-[0.2em] uppercase"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BrainCircuit className="w-4 h-4" />
              </motion.div>
              Agentic Medical Intelligence
            </motion.div>
            
            <motion.div variants={fadeInUp} className="space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-bold leading-[0.95] tracking-tighter">
                <motion.span
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block"
                >
                  Next-Gen
                </motion.span> <br className="hidden sm:block" />
                <motion.span 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-accent italic inline-block"
                >
                  Radiology
                </motion.span> <br className="hidden sm:block" />
                <motion.span
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="inline-block"
                >
                  Assistant
                </motion.span>
              </h1>
              <motion.p 
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
                className="text-base md:text-xl text-text-secondary max-w-xl leading-relaxed pt-2 md:pt-4 mx-auto lg:mx-0"
              >
                AI-imageX leverages advanced reasoning to orchestrate diagnostic image processing and HIPAA clinical precision.
              </motion.p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 md:pt-6 w-full sm:w-auto"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link 
                  href="/signup" 
                  className="px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-primary text-text-primary font-bold shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all flex items-center justify-center gap-2 text-sm md:text-base group"
                >
                  Start Diagnostic Run
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link 
                  href="/login" 
                  className="px-8 md:px-12 py-4 md:py-5 rounded-2xl bg-surface border border-border text-text-primary font-bold hover:bg-surface/80 hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  View Case Ledger
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 sm:gap-12 pt-8 md:pt-12 border-t border-border/50 w-full"
            >
              {[
                { value: "99.9%", label: "Audit\nCompliance" },
                { value: "< 15s", label: "Inference\nLatency" },
                { value: "Native", label: "Multi\nModality" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col gap-1 md:gap-2"
                >
                  <span className="text-2xl md:text-4xl font-bold text-text-primary">{stat.value}</span>
                  <span className="text-[8px] md:text-[10px] text-text-secondary uppercase font-black tracking-widest leading-tight whitespace-pre-line">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative group"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[4rem] blur-3xl -z-10" 
            />
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-[3.5rem] border border-border/50 overflow-hidden shadow-2xl shadow-black/80 aspect-video"
            >
              <img 
                src="/hero_medical_ai_interface.png" 
                alt="AI-imageX Interface" 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
              
              {/* Scan line effect */}
              <motion.div
                animate={{ y: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
              />
            </motion.div>
            
            {/* Floating UI Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute -top-8 -right-8 p-5 rounded-3xl bg-surface/80 border border-primary/30 shadow-2xl backdrop-blur-2xl animate-float hidden xl:block"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center border border-success/30"
                >
                  <ShieldCheck className="w-7 h-7 text-success" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-text-primary">HIPAA Secure</p>
                  <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">AES-256 Enabled</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" ref={featuresRef} className="py-20 md:py-40 px-6 md:px-12 bg-surface/10 relative overflow-hidden">
        {/* Animated background decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] border border-primary/5 rounded-full pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] border border-accent/5 rounded-full pointer-events-none"
        />
        
        <div className="max-w-[1536px] mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 md:space-y-8 mb-16 md:mb-32"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              Engineered for{" "}
              <span className="animate-text-gradient">Clinical Precision</span>
            </h2>
            <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Beyond simple classification, AI-imageX mimics the specialized reasoning loop 
              of a senior consultant radiologist.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12"
          >
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
              <motion.div 
                key={i} 
                variants={fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)",
                  borderColor: "rgba(124, 58, 237, 0.5)"
                }}
                className="p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-surface border border-border/50 transition-all duration-500 group flex flex-col items-center text-center md:items-start md:text-left cursor-pointer"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 sm:mb-10"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-tight group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 md:py-32 px-6 md:px-12 border-t border-border/30"
      >
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 cursor-pointer"
            >
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30"
              >
                <Activity className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-2xl font-bold tracking-tight">AI-imageX</span>
            </motion.div>
            <p className="text-sm text-text-secondary font-medium">© 2026 Advanced Medical Agentic Systems Inc. <br /> HIPAA Secure & GDPR Compliant Clinical Gateway.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-x-8 md:gap-x-16 gap-y-4 justify-center md:justify-end text-[10px] font-black uppercase tracking-widest text-text-secondary"
          >
            {["Enroll Institution", "Privacy Policy", "FDA Status", "Security Audit"].map((item, i) => (
              <motion.div key={item} whileHover={{ y: -2, color: "#7c3aed" }}>
                <Link href={i === 0 ? "/signup" : "#"} className="hover:text-primary transition-colors">
                  {item}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
