import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useTheme } from "../../theme/ThemeContext";
import blackLogo from "../../assets/black-theme-logo.png";
import whiteLogo from "../../assets/white-theme-logo.png";

export default function AdminFigmaHeader({ onMenuToggle, isMenuOpen }) {
    const { user, logout } = useAuth();
    const { isDarkMode } = useTheme();
    const logoSrc = isDarkMode ? blackLogo : whiteLogo;

    return (
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                        >
                            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>

                        {/* Logo */}
                        <Link to="/admin" className="flex items-center gap-3 group">
                            <img src={logoSrc} alt="MedAImart Logo" className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-105" />
                            <div className="hidden xs:block">
                                <div className="text-lg sm:text-xl font-bold text-primary font-serif leading-none">
                                    MedAImart
                                </div>
                                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">Admin Terminal</div>
                            </div>
                        </Link>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-3 md:gap-6">
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
                            <span className="text-sm font-bold text-foreground leading-none">System Admin</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">{user?.email || 'admin@medaimart.com'}</span>
                        </div>

                        <button
                            onClick={logout}
                            className="px-3 sm:px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-danger hover:border-danger hover:bg-danger/5 transition-all shadow-sm flex items-center justify-center font-black text-[10px] uppercase tracking-widest"
                            title="Secure Logout"
                        >
                            <span className="hidden xs:inline">LOGOUT</span>
                            <span className="xs:hidden">OUT</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
