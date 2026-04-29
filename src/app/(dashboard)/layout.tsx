"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  FileText, 
  Settings, 
  LogOut, 
  Activity,
  FolderHeart
} from "lucide-react";
import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Diagnose", href: "/diagnose", icon: ShieldAlert },
    { name: "Cases", href: "/cases", icon: FolderHeart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background text-text-primary">
      {/* Sidebar (Hidden on mobile, visible on desktop lg and up) */}
      <aside className="w-72 bg-surface border-r border-border flex-col shrink-0 hidden lg:flex">
        {/* Logo */}
        <div className="h-20 px-8 border-b border-border flex items-center gap-4">
          <Activity className="w-8 h-8 text-accent animate-pulse" />
          <span className="font-bold text-xl tracking-wider bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI-imageX
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${
                  isActive
                    ? "bg-primary text-text-primary shadow-2xl shadow-primary/30"
                    : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-text-primary" : "text-text-secondary"
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center border border-primary/50">
              <span className="font-bold text-primary text-sm">DR</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Dr. House</p>
              <p className="text-xs text-text-secondary">Clinician</p>
            </div>
          </div>
          <button className="text-text-secondary hover:text-error p-2 rounded-lg hover:bg-surface transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border z-50 flex justify-around items-center h-16 px-2 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 w-full max-w-[80px] ${
                isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header/Navbar */}
        <header className="h-20 bg-surface/30 backdrop-blur-md border-b border-border flex items-center justify-between px-6 md:px-10">
          <div className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
            {pathname === "/dashboard" && "Overview & Statistics"}
            {pathname === "/diagnose" && "Autonomous Image Diagnosis"}
            {pathname.startsWith("/cases") && "Historical Cases & Audit Trails"}
            {pathname === "/settings" && "Preferences & Integrations"}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-success/10 text-success border border-success/20 hidden sm:block">
              System: Operational
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
