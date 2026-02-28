import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useTheme } from "../../theme/ThemeContext";
import blackLogo from "../../assets/black-theme-logo.png";
import whiteLogo from "../../assets/white-theme-logo.png";

export default function AdminFigmaHeader() {
    const { user, logout } = useAuth();
    const { isDarkMode } = useTheme();
    const logoSrc = isDarkMode ? blackLogo : whiteLogo;

    return (
        <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/admin" className="flex items-center gap-3 group">
                        <img src={logoSrc} alt="MedAImart Logo" className="h-9 w-auto transition-transform group-hover:scale-105" />
                        <div className="hidden sm:block">
                            <div className="text-xl font-bold text-primary font-serif">
                                MedAImart
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Admin Terminal</div>
                        </div>
                    </Link>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Environment Tag */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                            <span className="text-[10px] font-bold text-warning uppercase tracking-widest">
                                Live Engine
                            </span>
                        </div>

                        <ThemeSwitcher />

                        <div className="h-6 w-px bg-border hidden sm:block" />

                        {/* User Profile */}
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-foreground">System Admin</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{user?.email || 'admin@medaimart.com'}</span>
                        </div>

                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-danger hover:border-danger hover:bg-danger/5 transition-all shadow-sm flex items-center justify-center font-black text-[10px] uppercase tracking-widest"
                            title="Secure Logout"
                        >
                            LOGOUT

                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
