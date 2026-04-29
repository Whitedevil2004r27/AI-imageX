"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Key } from "lucide-react";

export default function Setup2FAPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-text-primary">
      <div className="w-full max-w-md space-y-8 bg-surface border border-border p-8 rounded-2xl shadow-2xl shadow-primary/10 relative overflow-hidden">
        <div className="flex flex-col items-center space-y-3 text-center">
          <ShieldCheck className="w-10 h-10 text-success animate-bounce" />
          <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Enforce MFA Access
          </h1>
          <p className="text-sm text-text-secondary">
            Scan the QR payload or input the generated code to enable hardware authorization.
          </p>
        </div>

        {/* Mock QR Code */}
        <div className="flex flex-col items-center p-4 bg-black/40 border border-border rounded-xl">
          <div className="w-40 h-40 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner">
            <div className="w-36 h-36 border-4 border-black border-dashed flex items-center justify-center">
              <span className="text-[8px] text-black font-mono font-bold text-center uppercase">AI-imageX<br/>TOTP Payload</span>
            </div>
          </div>
          <span className="text-xs font-mono text-text-secondary mt-3">Secret: AIX-TOTP-GATEWAY-772</span>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Enter 6-Digit Token</label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-border text-text-primary text-sm font-mono text-center tracking-[1em] focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-success text-text-primary font-bold hover:opacity-90 shadow-lg shadow-success/20 hover:shadow-success/40 transition-all duration-300 cursor-pointer"
          >
            Activate Compliance Rules
          </button>
        </form>
      </div>
    </div>
  );
}
