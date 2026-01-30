import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, Search, ShoppingCart, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import symbol from '../assets/symbol.png';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const BRAND_COLOR = "bg-[#32aeb1]";
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/register-rider';

    if (isAuthPage) return null;

    return (
        <>
            {/* Desktop Header */}
            <header className="hidden lg:block fixed top-0 w-full z-50">
                {/* Main Navbar */}
                <div className={`${BRAND_COLOR} h-16 px-4 lg:px-12 flex items-center justify-between shadow-md`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 h-full group">
                        <div className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-md">
                            <img
                                src={symbol}
                                alt="MedAImart"
                                className="h-full w-full object-contain p-1.5"
                            />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight flex items-center">
                            <span className="text-white">Med</span>
                            <span className="text-[#003232]">AI</span>
                            <span className="text-white">mart</span>
                        </span>
                    </Link>

                    {/* Search Bar - Prominent */}
                    <div className="flex-1 max-w-2xl mx-12 relative animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search for medicines..."
                                className="w-full h-11 pl-4 pr-12 rounded-l-md bg-white text-gray-700 outline-none focus:ring-0 placeholder:text-gray-400 font-medium"
                            />
                            <button className="bg-gray-800 hover:bg-black text-white px-6 rounded-r-md transition-colors flex items-center justify-center">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-10 text-[#003232]">
                        <Link to="/cart" className="relative flex items-center gap-2 group">
                            <div className="relative">
                                <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" fill="currentColor" strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ef4281] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#32aeb1]">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden xl:inline text-[15px] font-bold">Cart</span>
                        </Link>

                        {/* Profile / Login */}
                        <div className="relative">
                            {user ? (
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                    <div className="w-9 h-9 rounded-full bg-[#003232]/10 flex items-center justify-center font-bold text-sm border-2 border-[#003232]/20">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden xl:block text-[15px] font-bold truncate max-w-[100px]">{user.name}</span>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 group">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                        <User className="w-7 h-7" fill="currentColor" strokeWidth={1} />
                                    </div>
                                    <span className="text-[15px] font-bold">Sign In</span>
                                </Link>
                            )}

                            {/* Dropdown */}
                            {isProfileOpen && user && (
                                <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-700 border border-gray-100 animate-in fade-in slide-in-from-top-2 z-50">
                                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-50 font-medium" onClick={() => setIsProfileOpen(false)}>Dashboard</Link>
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 font-medium" onClick={() => setIsProfileOpen(false)}>My Profile</Link>
                                    <div className="h-px bg-gray-100 my-1" />
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Navbar (Categories) */}
                <div className="bg-white border-b border-gray-200 h-10 flex items-center justify-center gap-8 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <a href="#" className="hover:text-[#32aeb1] transition-colors">Medicines</a>
                    <a href="#" className="hover:text-[#32aeb1] transition-colors">Wellness</a>
                    <a href="#" className="hover:text-[#32aeb1] transition-colors">Lab Tests</a>
                    <a href="#" className="hover:text-[#32aeb1] transition-colors">Beauty</a>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 z-50 lg:hidden pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16">
                    <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/' ? 'text-[#32aeb1]' : 'text-gray-400'}`}>
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    <Link to="/sell" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/sell' ? 'text-[#32aeb1]' : 'text-gray-400'}`}>
                        <PlusCircle className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Sell</span>
                    </Link>
                    <Link to="/cart" className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/cart' ? 'text-[#32aeb1]' : 'text-gray-400'}`}>
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ef4281] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
                        </div>
                        <span className="text-[10px] font-medium">Cart</span>
                    </Link>
                    <Link to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/dashboard' ? 'text-[#32aeb1]' : 'text-gray-400'}`}>
                        <User className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Account</span>
                    </Link>
                </div>
            </nav>

            {/* Spacer for Fixed Header */}
            <div className="h-0 lg:h-28" />
        </>
    );
};

export default Navbar;
