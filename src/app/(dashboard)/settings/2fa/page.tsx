"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Key, ArrowLeft } from "lucide-react";

export default function Settings2FAPage() {
  const [method, setMethod] = useState<"totp" | "sms">("totp");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(true);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <Link
        href="/settings"
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </Link>

      <div className="flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-success" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Configure Two-Factor Authentication
          </h1>
          <p className="text-sm text-text-secondary">
            Strengthen clinical gateway access with hardware-backed verification.
          </p>
        </div>
      </div>

      {/* Method selection */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <h3 className="text-base font-semibold text-text-primary">Select MFA Method</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMethod("totp")}
            className={`p-4 rounded-xl border text-left transition-all ${
              method === "totp"
                ? "border-primary bg-primary/10"
                : "border-border bg-surface/50 hover:border-primary/30"
            }`}
          >
            <Key className={`w-5 h-5 mb-2 ${method === "totp" ? "text-primary" : "text-text-secondary"}`} />
            <p className="text-sm font-semibold text-text-primary">TOTP Authenticator</p>
            <p className="text-xs text-text-secondary mt-1">Google Authenticator, Authy, Duo</p>
          </button>
          <button
            onClick={() => setMethod("sms")}
            className={`p-4 rounded-xl border text-left transition-all ${
              method === "sms"
                ? "border-primary bg-primary/10"
                : "border-border bg-surface/50 hover:border-primary/30"
            }`}
          >
            <ShieldCheck className={`w-5 h-5 mb-2 ${method === "sms" ? "text-primary" : "text-text-secondary"}`} />
            <p className="text-sm font-semibold text-text-primary">SMS Verification</p>
            <p className="text-xs text-text-secondary mt-1">Receive codes via SMS</p>
          </button>
        </div>
      </div>

      {/* QR + Verification */}
      {!verified ? (
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-6">
          {method === "totp" && (
            <div className="flex flex-col items-center p-4 bg-black/40 border border-border rounded-xl">
              <div className="w-40 h-40 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner">
                <div className="w-36 h-36 border-4 border-black border-dashed flex items-center justify-center">
                  <span className="text-[8px] text-black font-mono font-bold text-center uppercase">
                    AI-imageX<br />TOTP Secret
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-text-secondary mt-3">
                Secret: AIX-TOTP-{Math.random().toString(36).substr(2, 8).toUpperCase()}
              </span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Enter 6-Digit Verification Code
              </label>
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
              className="w-full py-3 px-4 rounded-xl bg-success text-text-primary font-bold hover:opacity-90 shadow-lg shadow-success/20 transition-all cursor-pointer"
            >
              Verify & Activate
            </button>
          </form>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-success/10 border border-success/30 text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-success mx-auto" />
          <h3 className="text-lg font-bold text-success">2FA Successfully Activated</h3>
          <p className="text-sm text-text-secondary">
            Your clinical gateway is now protected with {method === "totp" ? "TOTP authenticator" : "SMS"} verification.
          </p>
          <Link
            href="/settings"
            className="inline-block mt-3 px-6 py-2 rounded-xl bg-surface border border-border text-text-primary text-sm font-medium hover:border-primary/50 transition-colors"
          >
            Return to Settings
          </Link>
        </div>
      )}
    </div>
  );
}
