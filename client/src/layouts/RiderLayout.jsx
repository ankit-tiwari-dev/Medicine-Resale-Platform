import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ThemeSwitcher from "../components/common/ThemeSwitcher";



import { 
  LayoutDashboard, 
  ClipboardList, 
  PackageCheck, 
  BarChart3, 
  FileUp, 
  ShieldCheck, 
  Gavel, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const riderNavGroups = [
  {
    label: "Fleet Tasks",
    links: [
      { to: "/rider", label: "Operations Center", icon: LayoutDashboard },
      { to: "/rider/tasks", label: "Active Shipments", icon: ClipboardList },
      { to: "/rider/confirm-collection", label: "Collection Proof", icon: PackageCheck },
    ]
  },
  {
    label: "Compliance & Safety",
    links: [
      { to: "/rider/kyc/upload-docs", label: "Identity Upload", icon: FileUp },
      { to: "/rider/kyc/verify-docs", label: "Verification Gate", icon: ShieldCheck },
      { to: "/rider/kyc/consent", label: "Legal Protocols", icon: Gavel },
    ]
  },
  {
    label: "Performance",
    links: [
      { to: "/rider/stats", label: "Network Stats", icon: BarChart3 },
    ]
  }
];


const RiderLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell h-screen overflow-hidden bg-muted/10 flex">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col border-r border-border/40 bg-card/60 backdrop-blur-xl shadow-xl shadow-primary/5 group transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Terminal Header */}
        <div className="h-24 flex items-center px-8 pt-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-inner font-black text-[10px] uppercase tracking-widest">
              SYS
            </div>

            <div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5 leading-none">Fleet Node</div>
              <div className="text-sm font-bold text-foreground font-serif tracking-tight">Logistics <span className="text-primary">v4.8</span></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto side-scrollbar pr-2">
          {riderNavGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <h3 className="px-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/rider"}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all group border
                      ${isActive
                        ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                        : "text-muted-foreground/80 hover:bg-muted/50 hover:text-foreground border-transparent hover:border-border/20"}
                    `}
                  >
                    <link.icon className={`size-4 transition-transform group-hover:scale-105`} />
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight className="size-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-40 group-hover:translate-x-0" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sync Status & Theme */}
        <div className="p-4 mt-auto border-t border-border/40 bg-muted/5 rounded-2xl mx-2 mb-6 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between px-2">
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Theme</span>
             <ThemeSwitcher />
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border/50 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shadow-inner font-black text-[9px] uppercase tracking-widest">
            SYS
          </div>
          <div>
            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-0.5">Fleet Node</div>
            <div className="text-xs font-bold text-foreground font-serif tracking-tight leading-none">Logistics <span className="text-primary">v4.8</span></div>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-foreground hover:bg-muted transition-colors"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <main className="flex-1 lg:pl-[280px] pt-16 lg:pt-0 h-screen overflow-y-auto side-scrollbar w-full transition-all duration-300 flex flex-col relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default RiderLayout;
