import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, X, LayoutDashboard, Pill, Upload, History, Wallet, ShoppingCart, User, ChevronRight, LogOut } from "lucide-react";
import { AppLogo } from "../components/common/AppLogo";
import ThemeSwitcher from "../components/common/ThemeSwitcher";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/my-medicines", label: "My Medicines", icon: Pill },
  { to: "/dashboard/upload-medicine", label: "Upload Medicine", icon: Upload },
  { to: "/dashboard/orders", label: "Orders", icon: History },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/dashboard/profile", label: "Profile", icon: User }
];

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 h-16 bg-surface border-b border-border flex items-center justify-between px-4">
        <Link to="/app" onClick={() => setIsSidebarOpen(false)}>
          <AppLogo />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-foreground-muted hover:text-primary transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex overflow-hidden">
        {/* Responsive Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border transition-transform duration-300 transform
            lg:translate-x-0 lg:static lg:block
            ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col h-full p-6">
            <div className="hidden lg:flex items-center justify-between mb-10">
              <Link to="/app">
                <AppLogo />
              </Link>
              <ThemeSwitcher />
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/dashboard"}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-foreground-muted hover:bg-surface-muted hover:text-primary"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <link.icon
                          size={18}
                          className={isActive ? "text-primary-foreground" : "text-primary"}
                        />
                        {link.label}
                      </div>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all group"
              >
                <LogOut size={18} />
                Logout Session
              </button>
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
        <main className="flex-1 min-w-0 bg-background lg:p-8">
          <div className="max-w-6xl mx-auto p-4 lg:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
