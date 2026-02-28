import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
    {
        group: "Operations", items: [
            { to: "/admin/medicines-review", label: "Verification Queue" },
            { to: "/admin/riders-kyc", label: "Rider KYC Audit" },
            { to: "/admin/assign-rider", label: "Rider Assignment" },
        ]
    },
    {
        group: "Management", items: [
            { to: "/admin/orders", label: "Order Pipeline" },
            { to: "/admin/users", label: "Network Users" },
            { to: "/admin/withdrawals", label: "Payout Controls" },
        ]
    },
    {
        group: "System", items: [
            { to: "/admin/stats", label: "System Health" },
            { to: "/admin/logs", label: "Audit Logs" },
            { to: "/admin/settings", label: "Global Settings" },
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
                    flex items-center px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${isActive
                                            ? "bg-foreground text-background shadow-md shadow-foreground/10"
                                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}
                  `}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border bg-muted/20 space-y-3">
                <div className="flex items-center gap-4 px-4 py-4 rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Admin Node #1</span>
                        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-0.5">v7.3.1-Production</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/5 transition-all"
                >
                    System Logout
                </button>
            </div>
        </aside>
    );
}
