"use client";

import { useState } from "react";
import { Clock, Database, Terminal, ChevronDown, ChevronRight, Shield } from "lucide-react";

interface AuditEvent {
  id: string;
  event_type: string;
  tool_name: string | null;
  input_data: any;
  output_data: any;
  agent_state: { step: string; confidence: number };
  user_id: string | null;
  timestamp: string;
  ip_address: string | null;
}

interface AuditTrailProps {
  events: AuditEvent[];
}

export default function AuditTrail({ events }: AuditTrailProps) {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getEventIcon = (event_type: string) => {
    switch (event_type) {
      case "tool_called":
        return <Database className="w-4 h-4 text-primary" />;
      case "created":
      case "finalized":
        return <Terminal className="w-4 h-4 text-success" />;
      case "review_requested":
        return <Shield className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-accent" />;
    }
  };

  const getEventColor = (event_type: string) => {
    switch (event_type) {
      case "tool_called": return "border-primary/40";
      case "created": return "border-success/40";
      case "finalized": return "border-success/40";
      case "review_requested": return "border-warning/40";
      default: return "border-border";
    }
  };

  return (
    <div className="space-y-1">
      {events.map((event, idx) => {
        const isOpen = expandedEvents[event.id];
        return (
          <div key={event.id} className="relative pl-8">
            {/* Timeline line */}
            {idx < events.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-border/30" />
            )}

            {/* Timeline dot */}
            <div className={`absolute left-0 top-2 w-8 h-8 rounded-full bg-surface border-2 ${getEventColor(event.event_type)} flex items-center justify-center`}>
              {getEventIcon(event.event_type)}
            </div>

            {/* Event card */}
            <div
              className={`ml-4 p-4 rounded-xl bg-surface/50 border border-border hover:border-primary/20 transition-all cursor-pointer mb-3 ${isOpen ? "ring-1 ring-primary/20" : ""}`}
              onClick={() => toggle(event.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {event.event_type.replace("_", " ")}
                  </span>
                  {event.tool_name && (
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {event.tool_name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {event.agent_state && (
                    <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {event.agent_state.step} ({event.agent_state.confidence}%)
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-text-secondary">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-text-secondary" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  )}
                </div>
              </div>

              {/* Expanded payload */}
              {isOpen && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-3 text-xs font-mono">
                  {event.input_data && (
                    <div>
                      <span className="text-primary font-bold block mb-1">Input Payload:</span>
                      <pre className="bg-black/40 p-3 rounded-lg text-text-secondary whitespace-pre-wrap overflow-x-auto max-h-48">
                        {JSON.stringify(event.input_data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {event.output_data && (
                    <div>
                      <span className="text-success font-bold block mb-1">Output Payload:</span>
                      <pre className="bg-black/40 p-3 rounded-lg text-text-secondary whitespace-pre-wrap overflow-x-auto max-h-48">
                        {JSON.stringify(event.output_data, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="flex gap-4 text-text-secondary">
                    {event.user_id && <span>User: {event.user_id}</span>}
                    {event.ip_address && <span>IP: {event.ip_address}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
