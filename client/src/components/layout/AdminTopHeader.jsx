import React from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeSwitcher from '../common/ThemeSwitcher';

export default function AdminTopHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-surface border-b border-border sticky top-0 z-30 flex items-center justify-between px-8">
            {/* Search Bar - High Density */}
            <div className="w-full max-w-md relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-info transition-colors">
                    <Search size={16} />
                </div>
                <input
                    type="text"
                    placeholder="Global system search (orders, users, tx_id)..."
                    className="w-full h-10 pl-10 pr-4 bg-surface-muted rounded-md border border-border text-sm focus:outline-none focus:ring-1 focus:ring-info focus:bg-surface transition-all"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <ThemeSwitcher />

                {/* Environment Tag */}
                <div className="flex items-center gap-2 px-3 py-1 bg-warning/5 border border-warning/10 rounded-full">
                    <div className="size-1.5 rounded-full bg-warning animate-pulse" />
                    <span className="text-[10px] font-bold text-warning uppercase tracking-widest">Live Engine</span>
                </div>

                {/* Notifications */}
                <button className="relative px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                    Alerts
                    <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-red-500 rounded-full" />
                </button>

                <div className="h-6 w-px bg-border" />

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-foreground">System Admin</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{user?.email || 'admin@medaimart.com'}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 hover:border-red-500 hover:bg-red-500/5 transition-all shadow-sm"
                        title="Secure Logout"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
