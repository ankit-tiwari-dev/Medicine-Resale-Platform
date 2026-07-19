import { Outlet, Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ThemeSwitcher from "../components/common/ThemeSwitcher";
import { AppLogo } from "../components/common/AppLogo";


/**
 * AuthSplitLayout.jsx
 * Strict minimalist layout for authentication.
 */
export default function AuthSplitLayout() {
  return (
    <AppShell className="min-h-screen bg-background overflow-hidden relative">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left Side: Minimal Message (Hidden on Mobile) */}
        <aside className="hidden lg:flex lg:w-1/2 flex-col justify-center p-20 bg-black text-white px-24">
          <div className="max-w-md space-y-12">
            <Link to="/">
              <AppLogo className="text-white" />
            </Link>

            <h1 className="text-6xl font-black tracking-tighter normal-case leading-[0.85]">
              MedAImart
            </h1>

            <div className="h-px w-12 bg-white/20" />

            <p className="text-sm font-medium leading-relaxed text-white/60">
              MedAImart is a secure web application for buying and selling verified medicines.
              Sign in with your Google account or email to access your dashboard.
            </p>
          </div>
        </aside>

        {/* Right Side: Form Panel */}
        <main className="flex-1 flex flex-col bg-background relative px-6">

          {/* Minimal Header */}
          <header className="h-20 flex items-center justify-between">
            <Link to="/" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <span className="tracking-widest">&larr;</span> Home

            </Link>

            <ThemeSwitcher />
          </header>

          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>

          <footer className="py-8 border-t border-border/40">
            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest text-center">
              V.2.4.0 • MedAImart
            </p>
          </footer>
        </main>

      </div>
    </AppShell>
  );
}
