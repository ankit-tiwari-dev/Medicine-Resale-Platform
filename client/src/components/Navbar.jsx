import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import symbol from '../assets/symbol.png';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Tinted Palette Theme with Glass effect
    const BRAND_COLOR = "bg-teal-50/90 backdrop-blur-md border-b border-teal-100/50";
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/register-rider';

    if (isAuthPage) return null;

    return (
        <>
            {/* Desktop Header */}
            <header className="hidden lg:block fixed top-0 w-full z-50 transition-all duration-300">
                {/* Main Navbar */}
                <div className={`${BRAND_COLOR} h-16 px-4 lg:px-12 flex items-center justify-between shadow-sm`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 h-full group">
                        <div className="h-10 w-10 flex items-center justify-center bg-teal-50 rounded-xl border border-teal-100 transition-transform group-hover:scale-105">
                            <img
                                src={symbol}
                                alt="MedAImart"
                                className="h-full w-full object-contain p-1.5"
                            />
                        </div>
                        {/* Font Serif added to match Hero */}
                        <span className="text-2xl font-bold tracking-tight flex items-center font-serif">
                            <span className="text-slate-900">Med</span>
                            <span className="text-teal-600">AI</span>
                            <span className="text-slate-900">mart</span>
                        </span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-10 text-slate-600">
                        <Link to="/cart" className="relative flex items-center gap-2 group hover:text-teal-700 transition-colors">
                            <div className="relative">
                                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden xl:inline text-sm font-bold tracking-wide">CART</span>
                        </Link>

                        {/* Profile / Login */}
                        <div className="relative">
                            {user ? (
                                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                    <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center font-bold text-sm border border-teal-100 text-teal-700 group-hover:bg-teal-100 transition-colors">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden xl:block text-sm font-bold truncate max-w-[100px] text-slate-700 group-hover:text-teal-700 transition-colors">{user.name}</span>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 group hover:text-teal-700 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-105 border border-slate-200">
                                        <User className="w-5 h-5" strokeWidth={2} />
                                    </div>
                                    <span className="text-sm font-bold tracking-wide">SIGN IN</span>
                                </Link>
                            )}

                            {/* Dropdown */}
                            {isProfileOpen && user && (
                                <div className="absolute top-14 right-0 w-56 bg-white rounded-xl shadow-xl py-2 text-slate-700 border border-slate-100 animate-in fade-in slide-in-from-top-2 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 mb-1 bg-slate-50/50">
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/dashboard" className="block px-4 py-2.5 hover:bg-slate-50 font-medium transition-colors" onClick={() => setIsProfileOpen(false)}>Dashboard</Link>
                                    <Link to="/profile" className="block px-4 py-2.5 hover:bg-slate-50 font-medium transition-colors" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                                    <div className="h-px bg-slate-100 my-1" />
                                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-medium transition-colors">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 lg:hidden pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex justify-around items-center h-16">
                    <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/' ? 'text-teal-600' : 'text-slate-400'}`}>
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                    <Link to="/sell" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/sell' ? 'text-teal-600' : 'text-slate-400'}`}>
                        <PlusCircle className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Sell</span>
                    </Link>
                    <Link to="/cart" className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/cart' ? 'text-teal-600' : 'text-slate-400'}`}>
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-teal-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
                        </div>
                        <span className="text-[10px] font-bold">Cart</span>
                    </Link>
                    <Link to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/dashboard' ? 'text-teal-600' : 'text-slate-400'}`}>
                        <User className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Account</span>
                    </Link>
                </div>
            </nav>

            {/* Spacer for Fixed Header */}
            <div className="h-0 lg:h-16" />
        </>
    );
};

export default Navbar;
