import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeSwitcher from '../common/ThemeSwitcher';
import {
    LayoutDashboard,
    ClipboardCheck,
    Users,
    ShieldCheck,
    Truck,
    History,
    BarChart3,
    Wallet,
    Settings,
    ShieldAlert,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
    {
        group: "Operations", items: [
            { to: "/admin/medicines-review", label: "Verification Queue", icon: ClipboardCheck },
            { to: "/admin/riders-kyc", label: "Rider KYC Audit", icon: ShieldCheck },
            { to: "/admin/assign-rider", label: "Rider Assignment", icon: Truck },
        ]
    },
    {
        group: "Management", items: [
            { to: "/admin/orders", label: "Order Pipeline", icon: History },
            { to: "/admin/users", label: "Network Users", icon: Users },
            { to: "/admin/withdrawals", label: "Payout Controls", icon: Wallet },
        ]
    },
    {
        group: "System", items: [
            { to: "/admin/stats", label: "System Health", icon: BarChart3 },
            { to: "/admin/logs", label: "Audit Logs", icon: ShieldAlert },
            { to: "/admin/settings", label: "Global Settings", icon: Settings },
        ]
    }
];

export default function AdminSidebar() {
    const { logout } = useAuth();
    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
            {/* Sidebar Header */}
            <div className="h-16 flex items-center px-6 border-b border-border bg-surface">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold shadow-low">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-sm font-bold tracking-tight text-primary">
                                MedAImart Admin
                            </span>
                        </div>
                    </div>
                    <ThemeSwitcher />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {navItems.map((group) => (
                    <div key={group.group} className="space-y-2">
                        <h3 className="px-3 text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                            {group.group}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all
                    ${isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-foreground-muted hover:bg-surface-muted hover:text-primary"}
                  `}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border bg-surface-muted/30 space-y-3">
                <div className="flex items-center gap-3 px-2 py-3 rounded-lg border border-border bg-surface shadow-low">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary">Admin Node #1</span>
                        <span className="text-[9px] text-foreground-muted">v7.3.1-Production</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all group"
                >
                    <LogOut size={16} />
                    <span>System Logout</span>
                </button>
            </div>
        </aside>
    );
}
