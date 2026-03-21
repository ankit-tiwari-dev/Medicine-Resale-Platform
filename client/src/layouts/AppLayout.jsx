import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { AppLogo } from "../components/common/AppLogo";

import ThemeSwitcher from "../components/common/ThemeSwitcher";
import { useAuth } from "../hooks/useAuth";

import { 
  LayoutDashboard, 
  Package, 
  FileUp, 
  ShoppingBag, 
  Wallet, 
  ShoppingCart, 
  User, 
  LogOut,
  ChevronRight
} from "lucide-react";

const navGroups = [
  {
    label: "Seller Module (Resale)",
    links: [
      { to: "/dashboard", label: "Performance Hub", icon: LayoutDashboard },
      { to: "/dashboard/upload-medicine", label: "Initialize Listing", icon: FileUp },
      { to: "/dashboard/my-medicines", label: "Asset Inventory", icon: Package },
    ]
  },
  {
    label: "Buyer Module (Procurement)",
    links: [
      { to: "/dashboard/orders", label: "Active Procurements", icon: ShoppingBag },
      { to: "/dashboard/cart", label: "Procurement Cart", icon: ShoppingCart },
      { to: "/dashboard/wallet", label: "Financial Ledger", icon: Wallet },
    ]
  },
  {
    label: "System Node",
    links: [
      { to: "/dashboard/profile", label: "Clinical Profile", icon: User },
    ]
  }
];

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="relative h-screen bg-background flex flex-col overflow-hidden">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 h-16 bg-surface border-b border-border flex items-center justify-between px-4">
        <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)}>
          <AppLogo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-foreground-muted hover:text-primary transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{isSidebarOpen ? "CLOSE" : "MENU"}</span>

          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Responsive Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 flex-shrink-0 bg-card border-r border-border/50 transition-transform duration-300 transform
            lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block
            ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Terminal Header */}
            <div className="h-24 flex items-center px-8 pt-4 border-b border-border/50 bg-muted/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-inner font-black text-[10px] uppercase tracking-widest">
                  USR
                </div>
                <div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5 leading-none">Access Node</div>
                  <div className="text-sm font-bold text-foreground font-serif tracking-tight">Clinical <span className="text-primary">Portal</span></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 p-4 min-h-0">
              <nav className="flex-1 space-y-8 overflow-y-auto side-scrollbar pr-2 py-4">
                {navGroups.map((group) => (
                  <div key={group.label} className={`space-y-2 p-2 rounded-2xl border transition-all ${
                    group.label.includes('Seller') ? 'bg-emerald-green/[0.03] border-emerald-green/10' :
                    group.label.includes('Buyer') ? 'bg-primary/[0.03] border-primary/10' :
                    'bg-muted/5 border-border/30'
                  }`}>
                    <h3 className={`px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] opacity-60 ${
                      group.label.includes('Seller') ? 'text-emerald-green' :
                      group.label.includes('Buyer') ? 'text-primary' :
                      'text-muted-foreground'
                    }`}>
                      {group.label}
                    </h3>
                    <div className="space-y-1">
                      {group.links.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          end={link.to === "/dashboard"}
                          onClick={() => setIsSidebarOpen(false)}
                          className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all group border
                            ${isActive
                              ? (group.label.includes('Seller') 
                                  ? "bg-emerald-green/10 text-emerald-green border-emerald-green/20 shadow-sm"
                                  : group.label.includes('Buyer')
                                    ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                                    : "bg-muted text-foreground border-border/50")
                              : "text-muted-foreground/80 hover:bg-muted/50 hover:text-foreground border-transparent hover:border-border/30"}
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

              <div className="mt-auto p-4 border-t border-border/40 bg-muted/5 rounded-2xl mx-2 mb-6 space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Theme</span>
                  <ThemeSwitcher />
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all group"
                >
                  <LogOut className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Logout Session</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto side-scrollbar min-w-0 bg-background lg:p-8">
          <div className="max-w-6xl mx-auto p-4 lg:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
