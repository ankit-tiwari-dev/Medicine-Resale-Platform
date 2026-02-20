import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, LogIn, ShoppingBag } from "lucide-react";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useTheme } from "../../theme/ThemeContext";
import blackLogo from "../../assets/black-theme-logo.png";
import whiteLogo from "../../assets/white-theme-logo.png";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isDarkMode } = useTheme();
    const logoSrc = isDarkMode ? blackLogo : whiteLogo;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-surface">
            <div className="h-16 lg:h-18 flex items-center">
                <div className="max-w-container mx-auto w-full px-[var(--spacing-container-px)] flex items-center justify-between gap-4 lg:gap-8">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group z-50">
                        <img src={logoSrc} alt="MedAImart Logo" className="h-9 lg:h-10 w-auto transition-transform group-hover:scale-105" />
                        <span className="font-display text-xl font-bold tracking-tight text-primary">
                            MedAImart
                        </span>
                    </Link>

                    {/* Search Bar - Center (Hidden on small mobile) */}
                    <div className="hidden sm:flex flex-1 max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Search verified medicines..."
                            className="w-full h-10 bg-surface-muted border border-border rounded-lg px-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors">
                            <Search size={18} />
                        </div>
                    </div>

                    {/* Actions - Right (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <ThemeSwitcher />
                        <Link to="/browse" className="text-sm font-medium text-foreground-muted hover:text-primary transition-colors">
                            Browse
                        </Link>
                        <Link to="/login" className="text-sm font-medium text-foreground-muted hover:text-primary transition-colors">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-low hover:shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Sell Medicines
                        </Link>
                    </nav>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <ThemeSwitcher />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-foreground-muted hover:text-primary transition-colors z-50"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-surface z-40 lg:hidden animate-in fade-in duration-200">
                    <nav className="flex flex-col h-full pt-24 px-6 gap-2">
                        <Link
                            to="/browse"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 p-4 text-lg font-bold text-foreground border-b border-border/50"
                        >
                            <ShoppingBag className="text-primary" />
                            Browse Medicines
                        </Link>
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 p-4 text-lg font-bold text-foreground border-b border-border/50"
                        >
                            <LogIn className="text-primary" />
                            Secure Login
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsMenuOpen(false)}
                            className="mt-4 bg-primary text-primary-foreground p-4 rounded-xl text-center text-lg font-bold shadow-lg shadow-primary/20"
                        >
                            Sell on MedAImart
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
