"use client";

import { Terminal, Cpu, Database, CheckCircle2, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AgentThought {
  thought?: string;
  tool_name?: string;
  input?: any;
  result?: any;
  timestamp: string;
}

interface ThinkingDisplayProps {
  logs: AgentThought[];
  isComplete: boolean;
  confidence: number;
}

export default function AgentThinkingDisplay({ logs, isComplete, confidence }: ThinkingDisplayProps) {
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-surface border border-border rounded-2xl p-6 flex flex-col h-[calc(100vh-200px)] relative overflow-hidden"
    >
      {/* Animated background glow when processing */}
      <AnimatePresence>
        {!isComplete && logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-accent/20 rounded-full blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-center justify-between border-b border-border pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={!isComplete ? { 
              rotate: 360,
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
          >
            <Cpu className="w-5 h-5 text-accent" />
          </motion.div>
          <h2 className="text-lg font-bold tracking-tight text-text-primary">Agent Reasoning Engine</h2>
        </div>
        <AnimatePresence>
          {isComplete && (
            <motion.span 
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/20 text-success border border-success/30"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mr-1"
              >
                ✓
              </motion.span>
              Analysis Finalized
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Agent Event Logs */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin relative z-10">
        <AnimatePresence>
          {logs.map((log, idx) => {
            const isTool = log.tool_name;
            const isOpen = openAccordions[idx];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border border-border relative overflow-hidden ${
                  isTool ? 'bg-surface/40 border-primary/30' : 'bg-surface/20'
                }`}
              >
                {/* Shimmer effect for new entries */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                />
                
                <div className="flex items-start gap-3 relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className={`p-2 rounded-lg mt-0.5 ${
                      isTool ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {isTool ? <Database className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                  </motion.div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm font-semibold ${isTool ? 'text-primary' : 'text-text-primary'}`}>
                        {isTool ? `Tool Use: ${log.tool_name}` : 'AI Thought'}
                      </p>
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-[10px] text-text-secondary font-mono"
                      >
                        {log.timestamp}
                      </motion.span>
                    </div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm text-text-secondary leading-relaxed"
                    >
                      {log.thought || `Executing ${log.tool_name} with context.`}
                    </motion.p>

                    {/* Collapsible Tool Inputs/Outputs */}
                    {isTool && (log.input || log.result) && (
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleAccordion(idx)}
                          className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
                        >
                          {isOpen ? 'Hide Payload' : 'View Payload'}
                          <motion.span
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </motion.span>
                        </motion.button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2 space-y-2 text-xs font-mono bg-black/40 p-3 rounded-lg overflow-x-auto max-w-full"
                            >
                              {log.input && (
                                <div>
                                  <span className="text-primary font-bold">Input:</span>
                                  <pre className="mt-1 text-text-secondary whitespace-pre-wrap">
                                    {JSON.stringify(log.input, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.result && (
                                <div className="mt-2 pt-2 border-t border-border/30">
                                  <span className="text-success font-bold">Output:</span>
                                  <pre className="mt-1 text-text-secondary whitespace-pre-wrap">
                                    {JSON.stringify(log.result, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
        
        {!isComplete && logs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-accent p-2"
          >
            <motion.span 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-accent rounded-full" 
            />
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Waiting for agent decision...
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Confidence Meter */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="border-t border-border pt-4 space-y-2 relative z-10"
          >
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-text-secondary">Diagnostic Confidence</span>
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className={`font-bold ${confidence >= 80 ? 'text-success' : confidence >= 60 ? 'text-warning' : 'text-error'}`}
              >
                {confidence}%
              </motion.span>
            </div>
            <div className="w-full h-3 bg-surface/80 rounded-full overflow-hidden border border-border p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  confidence >= 80 ? 'bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                  confidence >= 60 ? 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                  'bg-error shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
