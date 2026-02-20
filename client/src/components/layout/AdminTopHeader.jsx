import React from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
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
                <button className="relative p-2 text-foreground-muted hover:text-primary transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 size-2 bg-danger rounded-full border-2 border-surface" />
                </button>

                <div className="h-6 w-px bg-border" />

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-primary">System Admin</span>
                        <span className="text-[10px] text-foreground-muted font-medium">{user?.email || 'admin@medaimart.com'}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-full border border-border text-foreground-muted hover:text-danger hover:border-danger hover:bg-danger/5 transition-all shadow-low"
                        title="Secure Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
