"use client";

import { Terminal, Cpu, Database, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";

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

  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-6 bg-surface border border-border rounded-2xl p-6 flex flex-col h-[calc(100vh-200px)]">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Cpu className={`w-5 h-5 text-accent ${!isComplete ? 'animate-spin' : ''}`} />
          <h2 className="text-lg font-bold tracking-tight text-text-primary">Agent Reasoning Engine</h2>
        </div>
        {isComplete && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/20 text-success border border-success/30">
            Analysis Finalized
          </span>
        )}
      </div>

      {/* Agent Event Logs */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {logs.map((log, idx) => {
          const isTool = log.tool_name;
          const isOpen = openAccordions[idx];

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border border-border relative overflow-hidden transition-all duration-300 ${
                isTool ? 'bg-surface/40 border-primary/30' : 'bg-surface/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${
                  isTool ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                }`}>
                  {isTool ? <Database className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold ${isTool ? 'text-primary' : 'text-text-primary'}`}>
                      {isTool ? `Tool Use: ${log.tool_name}` : 'AI Thought'}
                    </p>
                    <span className="text-[10px] text-text-secondary font-mono">{log.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {log.thought || `Executing ${log.tool_name} with context.`}
                  </p>

                  {/* Collapsible Tool Inputs/Outputs */}
                  {isTool && (log.input || log.result) && (
                    <div className="mt-3 pt-2 border-t border-border/50">
                      <button
                        onClick={() => toggleAccordion(idx)}
                        className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
                      >
                        {isOpen ? 'Hide Payload' : 'View Payload'}
                        <ArrowRight className={`w-3 h-3 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="mt-2 space-y-2 text-xs font-mono bg-black/40 p-3 rounded-lg overflow-x-auto max-w-full">
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
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {!isComplete && logs.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-accent p-2 animate-pulse">
            <span className="w-2 h-2 bg-accent rounded-full animate-ping" />
            Waiting for agent decision...
          </div>
        )}
      </div>

      {/* Confidence Meter */}
      {isComplete && (
        <div className="border-t border-border pt-4 space-y-2 animate-fadeIn">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-text-secondary">Diagnostic Confidence</span>
            <span className={`font-bold ${confidence >= 80 ? 'text-success' : confidence >= 60 ? 'text-warning' : 'text-error'}`}>
              {confidence}%
            </span>
          </div>
          <div className="w-full h-3 bg-surface/80 rounded-full overflow-hidden border border-border p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                confidence >= 80 ? 'bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                confidence >= 60 ? 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                'bg-error shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
