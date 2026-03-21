import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ClipboardCheck, 
    UserCheck, 
    UserPlus, 
    ShoppingBag, 
    Users, 
    CreditCard, 
    Activity, 
    FileText, 
    Settings,
    LogOut,
    Shield
} from 'lucide-react';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
    {
        group: "Operations", 
        items: [
            { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { to: "/admin/medicines-review", label: "Verification Queue", icon: ClipboardCheck },
            { to: "/admin/riders-kyc", label: "Rider KYC Audit", icon: UserCheck },
            { to: "/admin/assign-rider", label: "Rider Assignment", icon: UserPlus },
        ]
    },
    {
        group: "Management", 
        items: [
            { to: "/admin/orders", label: "Order Pipeline", icon: ShoppingBag },
            { to: "/admin/users", label: "Network Users", icon: Users },
            { to: "/admin/disputes", label: "Arbitration Hub", icon: Shield },
            { to: "/admin/withdrawals", label: "Payout Controls", icon: CreditCard },
        ]
    },
    {
        group: "System", 
        items: [
            { to: "/admin/stats", label: "System Health", icon: Activity },
            { to: "/admin/logs", label: "Audit Logs", icon: FileText },
        ]
    }
];

export default function AdminSidebar({ onNavItemClick }) {
    const { logout } = useAuth();
    
    return (
        <aside className="w-64 bg-card border-r border-border flex flex-col h-screen lg:sticky top-0 z-40 transition-all duration-300">
            {/* Sidebar Header */}
            <div className="h-20 flex items-center px-6 pt-2 border-b border-border bg-card/80 backdrop-blur-md flex-shrink-0">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                            <Shield className="size-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-sm font-semibold tracking-tight text-foreground">
                                MedAImart <span className="text-primary text-[9px] font-sans font-bold uppercase tracking-widest ml-1">Admin</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 side-scrollbar space-y-8">
                {navItems.map((group) => (
                    <div key={group.group} className="space-y-2">
                        <h3 className="px-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                            {group.group}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.to === "/admin"}
                                    onClick={onNavItemClick}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 group
                                        ${isActive
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"}
                                    `}
                                >
                                    <item.icon className={`size-4 transition-transform group-hover:scale-105`} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div className="pt-8 pb-4">
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-card/50 hover:bg-muted/30 transition-colors">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Theme</span>
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border bg-muted/10 space-y-3 mb-6 flex-shrink-0">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Admin Node #1</span>
                        <span className="text-[8px] text-muted-foreground font-semibold uppercase tracking-tight mt-0.5 opacity-60">v7.3.1-Production</span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        logout();
                        onNavItemClick?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-danger hover:bg-danger/5 transition-all duration-200 group"
                >
                    <LogOut className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>System Logout</span>
                </button>
            </div>
        </aside>
    );
}
