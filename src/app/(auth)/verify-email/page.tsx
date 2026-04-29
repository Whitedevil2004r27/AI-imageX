"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-text-primary">
      <div className="w-full max-w-md space-y-8 bg-surface border border-border p-8 rounded-2xl shadow-2xl shadow-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col items-center space-y-3 text-center">
          <Activity className="w-10 h-10 text-accent animate-pulse" />
          <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Verify Credentials
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            We have dispatched a verification packet to your secure clinical mailbox. Please authorize access.
          </p>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-surface text-text-primary text-sm font-medium border border-border hover:border-primary/50 transition-colors"
          >
            Return to Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}
