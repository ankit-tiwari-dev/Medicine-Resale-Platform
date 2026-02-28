import { NavLink, Outlet } from "react-router-dom";
import ThemeSwitcher from "../components/common/ThemeSwitcher";



const riderLinks = [
  { to: "/rider", label: "Dashboard", initial: "DB" },
  { to: "/rider/tasks", label: "Assigned Tasks", initial: "TSK" },
  { to: "/rider/confirm-collection", label: "Collection Proof", initial: "COL" },
  { to: "/rider/stats", label: "Operation Stats", initial: "STS" },
  { to: "/rider/kyc/upload-docs", label: "KYC Upload", initial: "DOC" },
  { to: "/rider/kyc/verify-docs", label: "KYC Verification", initial: "VER" },
  { to: "/rider/kyc/consent", label: "Legal Consent", initial: "LEG" }
];


const RiderLayout = () => {
  return (
    <div className="app-shell min-h-screen bg-muted/10 flex overflow-x-hidden">
      <aside className="fixed inset-y-0 left-0 z-50 w-[280px] hidden lg:flex flex-col border-r border-border/60 bg-card/80 backdrop-blur-xl shadow-xl shadow-primary/5 group">

        {/* Terminal Header */}
        <div className="h-20 flex items-center px-8 border-b border-border/50">
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
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto side-scrollbar">
          <div className="px-4 mb-4">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Command Center</div>
          </div>

          {riderLinks.map((link) => (
            <NavLink
              key={link.to}
              end={link.to === "/rider"}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 group/item ${isActive
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`text-[10px] font-black uppercase tracking-widest w-6 transition-transform ${isActive ? 'text-black' : 'text-primary'}`}>{link.initial}</div>
                    <span className="tracking-tight">{link.label}</span>
                  </div>
                  <span className={`opacity-0 -translate-x-2 transition-all duration-300 group-hover/item:opacity-40 group-hover/item:translate-x-0 active:opacity-10 font-black`}>&rarr;</span>
                </>
              )}
            </NavLink>

          ))}
        </nav>

        {/* Sync Status & Theme */}
        <div className="p-6 mt-auto border-t border-border/40 bg-muted/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nodes Synced</div>
            </div>
          </div>

          <div className="flex items-center justify-center py-2 bg-card rounded-2xl border border-border shadow-sm">
            <ThemeSwitcher />
          </div>
        </div>
      </aside>

      {/* Mobile Top Header - Placeholder if needed for responsive, but main target is desktop shell first */}
      <main className="flex-1 lg:pl-[280px] min-h-screen w-full transition-all duration-300 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default RiderLayout;
