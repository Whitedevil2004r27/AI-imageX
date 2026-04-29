import { ReactNode } from "react";
import { Activity } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md space-y-8 animate-fadeIn">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-7 h-7 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-imageX
            </span>
          </Link>
        </div>
        
        <div className="bg-surface border border-border/50 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/50 backdrop-blur-sm">
          {children}
        </div>

        <div className="text-center">
          <p className="text-xs text-text-secondary leading-relaxed max-w-[280px] mx-auto">
            Secure Clinical Access Gateway. <br /> HIPAA & GDPR Compliant Processing.
          </p>
        </div>
      </div>
    </div>
  );
}
