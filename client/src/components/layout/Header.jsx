import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { ShoppingCart, User, LogIn, UserPlus, Home, Info, PlusCircle } from "lucide-react";
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, isAuthenticated } = useAuth();

    const navLinks = [
        { name: "Home", path: "/", icon: Home },
        { name: "How It Works", path: "/#how-it-works", isHash: true, icon: Info },
        { name: "Sell Medicines", path: "/register", icon: PlusCircle },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b border-border/40 transition-colors duration-300 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-lg font-black tracking-tighter text-foreground uppercase flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs italic">M</div>
                    MedAImart
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.isHash ? (
                            <a key={link.name} href={link.path} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <link.icon size={14} className="opacity-60" />
                                {link.name}
                            </a>
                        ) : (
                            <Link key={link.name} to={link.path} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <link.icon size={14} className="opacity-60" />
                                {link.name}
                            </Link>
                        )
                    ))}

                    <div className="h-3 w-px bg-border/40 mx-2" />

                    {isAuthenticated ? (
                        <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <User size={14} />
                            Account
                        </Link>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                <LogIn size={14} />
                                Login
                            </Link>
                            <Link to="/register" className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <UserPlus size={14} />
                                Register
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-6 ml-4">
                        <Link to={isAuthenticated ? "/dashboard/cart" : "/cart"} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group relative">
                            <div className="relative">
                                <ShoppingCart size={16} className="group-hover:text-primary transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in duration-300">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            Cart
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
                    <Link to={isAuthenticated ? "/dashboard/cart" : "/cart"} onClick={() => setIsMenuOpen(false)} className="text-lg font-bold uppercase tracking-tight text-foreground">
                        Cart ({cartCount})
                    </Link>
                </div>
            )}
        </header>
    );
}
