"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, History, Shield, Loader2 } from "lucide-react";
import AuditTrail from "@/components/AuditTrail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CaseAuditPage({ params }: PageProps) {
  const { id } = use(params);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`/api/diagnoses/${id}/audit`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [id]);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/cases/${id}`}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case {id}
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <History className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Full Audit Trail — {id}
          </h1>
          <p className="text-sm text-text-secondary">
            Complete chronological record of every agent decision and tool invocation for HIPAA compliance.
          </p>
        </div>
      </div>

      {/* Compliance banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
        <Shield className="w-5 h-5 text-accent flex-shrink-0" />
        <p className="text-xs text-text-secondary leading-relaxed">
          This audit trail is immutable and tamper-evident. All tool calls, agent state transitions,
          input/output payloads, and user actions are cryptographically logged for compliance with
          HIPAA §164.312(b) and GDPR Article 30.
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6 rounded-2xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-text-primary">Agent Event Timeline</h2>
          <span className="text-xs text-text-secondary font-mono">
            {events.length} events recorded
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-text-secondary gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading audit records...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-text-secondary text-sm">
            No audit events found for this diagnosis.
          </div>
        ) : (
          <AuditTrail events={events} />
        )}
      </div>
    </div>
  );
}
