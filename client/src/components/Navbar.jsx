import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiActivity, FiBriefcase, FiGrid, FiChevronDown, FiCpu, FiGlobe } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6">
            <div className="container mx-auto max-w-[1400px]">
                <div className="glass-focal border-white/20 dark:border-white/5 rounded-[2.5rem] px-10 py-4 flex items-center justify-between shadow-3d backdrop-blur-[40px] relative overflow-hidden group">
                    {/* Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                    {/* Brand Entity */}
                    <div className="flex items-center gap-16 relative z-10">
                        <Link to="/" className="group flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-background shadow-2xl group-hover:rotate-[30deg] transition-all duration-700">
                                <FiCpu size={24} className="group-hover:animate-pulse" />
                            </div>
                            <span className="text-3xl font-black tracking-[-0.06em] leading-none uppercase italic group-hover:text-primary transition-colors duration-500">
                                MediRes <br />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] block mt-1 text-foreground/20">System_Node</span>
                            </span>
                        </Link>

                        {/* Network Links */}
                        <div className="hidden xl:flex items-center gap-12">
                            <Link to="/medicines" className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 hover:text-primary transition-all relative group/link italic">
                                / Marketplace
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-500" />
                            </Link>
                            <Link to="/about" className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 hover:text-primary transition-all relative group/link italic">
                                / Protocols
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-500" />
                            </Link>
                        </div>
                    </div>

                    {/* Operational Node Controls */}
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-4 px-6 py-3 rounded-[1.5rem] glass border-white/10 hover:border-primary/40 transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-xl"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                                        <FiUser size={18} />
                                    </div>
                                    <span className="hidden sm:inline italic">Node::{user.name.split(' ')[0]}</span>
                                    <FiChevronDown className={`transition-transform duration-700 ${isMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                                            className="absolute right-0 mt-6 w-72 glass-focal border-white/20 rounded-[2.5rem] p-6 shadow-3d overflow-hidden"
                                        >
                                            <div className="flex flex-col gap-2 relative z-10">
                                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic group/item">
                                                    <span className="flex items-center gap-4"><FiGrid /> Control Center</span>
                                                    <FiArrowRight className="opacity-0 group-hover/item:opacity-100 transition-all" />
                                                </Link>

                                                {user.role === 'rider' && (
                                                    <Link to="/rider" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic group/item">
                                                        <span className="flex items-center gap-4"><FiBriefcase /> Logistics Hub</span>
                                                        <FiArrowRight className="opacity-0 group-hover/item:opacity-100 transition-all" />
                                                    </Link>
                                                )}

                                                {user.role === 'admin' && (
                                                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic group/item">
                                                        <span className="flex items-center gap-4"><FiActivity /> Command Center</span>
                                                        <FiArrowRight className="opacity-0 group-hover/item:opacity-100 transition-all" />
                                                    </Link>
                                                )}

                                                <div className="h-px bg-foreground/5 my-4" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic text-rose-500 group/item"
                                                >
                                                    <span className="flex items-center gap-4"><FiLogOut /> Sign_Out</span>
                                                    <FiArrowRight className="opacity-0 group-hover/item:opacity-100 transition-all" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-8">
                                <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 hover:text-primary transition-all italic underline underline-offset-8 decoration-foreground/10 hover:decoration-primary">
                                    Sign_In
                                </Link>
                                <Link to="/register" className="btn-premium py-4 px-10 text-[10px] font-black uppercase tracking-[0.4em] italic shadow-2xl">
                                    Join_Node
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
