import { Outlet, Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ThemeSwitcher from "../components/common/ThemeSwitcher";
import { ShieldCheck, Lock, Activity, CheckCircle2, ChevronLeft } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import blackLogo from "../assets/black-theme-logo.png";
import whiteLogo from "../assets/white-theme-logo.png";

/**
 * AuthSplitLayout.jsx
 * Premium two-sided layout for authentication flows.
 * Provides a high-trust, immersive visual experience on the left 
 * and a focused, clean interface for the auth forms on the right.
 */
export default function AuthSplitLayout() {
  const { isDarkMode } = useTheme();
  const logoSrc = isDarkMode ? blackLogo : whiteLogo;

  return (
    <AppShell className="min-h-screen bg-background overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Visual Trust Panel - Left Side (Hidden on Mobile) */}
        <aside className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-black via-[#000814] to-clinical-navy-dark">

          {/* Background Aesthetic Layers */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Subtle Aurora Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-soft-cyan/5 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-green/5 blur-[100px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.01)_0%,transparent_100%)]" />
          </div>

          {/* Top Section: Brand */}
          <Link to="/" className="relative z-10 flex items-center gap-3 group w-fit">
            <img src={blackLogo} alt="MedAImart Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              MedAImart
            </span>
          </Link>

          {/* Middle Section: Trust Content */}
          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-serif font-bold text-white leading-[1.1] mb-8">
              Clinical-Grade <br />
              <span className="text-primary italic">Pharmaceutical</span> Resale.
            </h1>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "Forensic Integrity", desc: "AI-powered batch verification and seal audit." },
                { icon: Lock, title: "Escrow Protocol", desc: "Funds secured until unit integrity is confirmed." },
                { icon: CheckCircle2, title: "Regulatory Alignment", desc: "Compliant with healthcare redistribution standards." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                    <item.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-sans mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Footer Context */}
          <div className="relative z-10 flex flex-col gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
              Identity Protection Active • Session Encrypted
            </p>
          </div>
        </aside>

        {/* Form Panel - Right Side */}
        <main className="flex-1 flex flex-col bg-background relative">

          {/* Integrated Header - Precision 3-Column Layout */}
          <header className="absolute top-0 left-0 right-0 h-16 lg:h-20 flex items-center px-4 lg:px-12 z-30">
            {/* Column 1: Back (Left) */}
            <div className="w-1/3 flex justify-start">
              <Link to="/" className="inline-flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs font-bold text-muted-foreground hover:text-primary transition-colors group px-2 py-1.5 bg-card/50 backdrop-blur-md rounded-xl border border-border/50 shadow-sm">
                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="uppercase tracking-wider hidden sm:inline-block">Return to Marketplace</span>
                <span className="uppercase tracking-wider sm:hidden">Back</span>
              </Link>
            </div>

            {/* Column 2: Logo (Center) */}
            <div className="w-1/3 flex justify-center">
              <Link to="/" className="flex items-center transition-transform active:scale-95">
                <img src={logoSrc} alt="MedAImart Logo" className="h-8 lg:h-10 w-auto" />
              </Link>
            </div>

            {/* Column 3: Switcher (Right) */}
            <div className="w-1/3 flex justify-end">
              <ThemeSwitcher />
            </div>
          </header>

          {/* The Auth Form Container */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 pt-24 lg:pt-32">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Outlet />
            </div>
          </div>

          {/* Simple Bottom Indicator */}
          <footer className="py-8 px-12 border-t border-border/50 lg:border-t-0">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] text-center lg:text-right">
              Institutional Access • V.2.4.0
            </p>
          </footer>
        </main>

      </div>
    </AppShell>
  );
}
