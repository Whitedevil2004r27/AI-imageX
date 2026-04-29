"use client";

import { useState } from "react";
import { Settings, Shield, Key, User, Eye, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("AIX_••••••••••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);

  const handleToggle2FA = () => {
    setIs2FAEnabled(prev => !prev);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">System Preferences</h1>
          <p className="text-sm text-text-secondary">Manage credentials, clinical defaults, and compliance rules.</p>
        </div>
      </div>

      {/* Profile */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <User className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Clinician Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-secondary mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="Gregory House, M.D."
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-2">Specialization</label>
            <input
              type="text"
              defaultValue="Infectious Disease / Nephrology"
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-border text-text-primary text-sm focus:outline-none focus:border-primary cursor-not-allowed opacity-70"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Security & 2FA */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Shield className="w-5 h-5 text-success" />
          <h2 className="text-lg font-semibold text-text-primary">Multi-Factor Authentication</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-border">
          <div>
            <p className="text-sm font-semibold text-text-primary">Two-Factor Authentication (2FA)</p>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Enforce TOTP verification protocols (Google Authenticator, Duo) for enhanced security clearance.
            </p>
          </div>
          
          <button
            onClick={handleToggle2FA}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              is2FAEnabled 
                ? "bg-success/20 text-success border-success/30" 
                : "bg-warning/20 text-warning border-warning/30"
            }`}
          >
            {is2FAEnabled ? "Active" : "Enable 2FA"}
          </button>
        </div>
      </div>

      {/* API Integration */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Key className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-semibold text-text-primary">Developer API Integration</h2>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-text-secondary mb-1">Secret Token</label>
          <div className="flex gap-3 relative max-w-lg">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => setShowKey(prev => !prev)}
              className="absolute right-3 top-3 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed mt-2">
            Safeguard tokens. Revoking or swapping invalidates dependent clinical gateway proxies.
          </p>
        </div>
      </div>
    </div>
  );
}
