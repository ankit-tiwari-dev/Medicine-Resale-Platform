import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../common/ThemeSwitcher";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, isAuthenticated } = useAuth();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "How It Works", path: "/#how-it-works", isHash: true },
        { name: "Sell Medicines", path: "/register" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b border-border/40 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-lg font-black tracking-tighter text-foreground uppercase">
                    MedAImart
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.isHash ? (
                            <a key={link.name} href={link.path} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                {link.name}
                            </a>
                        ) : (
                            <Link key={link.name} to={link.path} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                {link.name}
                            </Link>
                        )
                    ))}

                    <div className="h-3 w-px bg-border/40 mx-2" />

                    {isAuthenticated ? (
                        <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-foreground">
                            Account
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="text-xs font-bold uppercase tracking-widest text-foreground">
                                Register
                            </Link>
                        </>
                    )}

                    <div className="flex items-center gap-6 ml-4">
                        <Link to="/cart" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                            Cart
                            {cartCount > 0 && <span>({cartCount})</span>}
                        </Link>
                        <ThemeSwitcher />
                    </div>
                </nav>

                {/* Mobile Controls */}
                <div className="flex lg:hidden items-center gap-4">
                    <ThemeSwitcher />
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground">
                        <span className="text-[10px] font-black uppercase tracking-widest">{isMenuOpen ? "CLOSE" : "MENU"}</span>

                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border/40 p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight text-foreground">
                            {link.name}
                        </Link>
                    ))}
                    {isAuthenticated ? (
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight text-foreground">
                            Account
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight text-foreground">
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight text-foreground">
                                Register
                            </Link>
                        </>
                    )}
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight text-foreground">
                        Cart ({cartCount})
                    </Link>
                </div>
            )}
        </header>
    );
}
