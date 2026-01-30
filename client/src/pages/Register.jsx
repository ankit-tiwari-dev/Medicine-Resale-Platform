import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiActivity, FiShield, FiGlobe, FiCpu } from 'react-icons/fi';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.email, formData.password, formData.name);
            toast.success('Credentials registered successfully!', {
                icon: '🚀',
                duration: 4000
            });
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Enrollment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden py-32">
            {/* Supreme Ambient Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-40 h-screen w-screen overflow-hidden">
                <div className="absolute top-[15%] right-[-15%] w-[65%] h-[65%] bg-primary/10 rounded-full blur-[240px] animate-pulse" />
                <div className="absolute bottom-[-15%] left-[-15%] w-[55%] h-[55%] bg-secondary/10 rounded-full blur-[210px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full max-w-2xl"
            >
                <div className="premium-card p-16 lg:p-24 relative overflow-hidden shadow-3d bg-background/40 backdrop-blur-[40px]">
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] scale-150" />

                    {/* Decorative Header Hub */}
                    <div className="text-center mb-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl italic"
                        >
                            <FiGlobe className="animate-spin-slow" /> Global_Enrollment_Node
                        </motion.div>

                        <h2 className="text-6xl lg:text-[6.5rem] font-black text-foreground tracking-[-0.07em] leading-[0.85] uppercase italic mb-8">
                            Personnel <br />
                            <span className="text-foreground/10">Enroll.</span>
                        </h2>
                        <p className="text-xl text-foreground/30 font-bold tracking-tighter uppercase italic">Register Credentials to Join Network.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                        <div className="relative group">
                            <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.6em] mb-6 block ml-4 italic">Legal_Identity</label>
                            <div className="relative">
                                <FiUser className="absolute left-10 top-1/2 -translate-y-1/2 text-primary opacity-20 group-focus-within:opacity-100 transition-opacity" size={32} />
                                <input
                                    type="text"
                                    className="w-full pl-28 pr-10 py-8 rounded-[2.5rem] glass border-white/5 focus:border-primary/50 focus:ring-[20px] focus:ring-primary/5 transition-all outline-none font-black text-2xl uppercase tracking-tighter shadow-inner bg-foreground/[0.02]"
                                    placeholder="FULL_NAME_REQ"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.6em] mb-6 block ml-4 italic">Node_Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-10 top-1/2 -translate-y-1/2 text-primary opacity-20 group-focus-within:opacity-100 transition-opacity" size={32} />
                                <input
                                    type="email"
                                    className="w-full pl-28 pr-10 py-8 rounded-[2.5rem] glass border-white/5 focus:border-primary/50 focus:ring-[20px] focus:ring-primary/5 transition-all outline-none font-black text-2xl uppercase tracking-tighter shadow-inner bg-foreground/[0.02]"
                                    placeholder="OPERATOR_CORE"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.6em] mb-6 block ml-4 italic">Access_Key</label>
                            <div className="relative">
                                <FiLock className="absolute left-10 top-1/2 -translate-y-1/2 text-primary opacity-20 group-focus-within:opacity-100 transition-opacity" size={32} />
                                <input
                                    type="password"
                                    className="w-full pl-28 pr-10 py-8 rounded-[2.5rem] glass border-white/5 focus:border-primary/50 focus:ring-[20px] focus:ring-primary/5 transition-all outline-none font-black text-2xl tracking-widest shadow-inner bg-foreground/[0.02]"
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <p className="text-[9px] font-black text-foreground/10 text-center px-12 leading-relaxed uppercase tracking-[0.4em] mt-10 italic">
                            BY ENROLLING, YOU ADHERE TO THE <span className="text-primary hover:text-secondary cursor-pointer transition-colors border-b border-primary/20">CENTRAL_PROTOCOL</span> AND <span className="text-primary hover:text-secondary cursor-pointer transition-colors border-b border-primary/20">SECURITY_MANIFESTO</span>.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium w-full !py-10 !text-3xl mt-8 shadow-3d group italic tracking-tighter"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-6">
                                    <FiActivity className="animate-spin" /> ENROLLING_NODE...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-6 group-hover:gap-10 transition-all">
                                    FINALIZE ENROLLMENT <FiArrowRight className="group-hover:translate-x-4 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-20 text-center relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
                            Already Enrolled? {' '}
                            <Link to="/login" className="text-primary hover:text-secondary transition-colors italic border-b-2 border-primary/20 hover:border-primary pb-1">
                                Sign_In_To_Terminal
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Meta Exit */}
                <div className="mt-16 text-center">
                    <Link to="/" className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground/10 hover:text-primary transition-all inline-flex items-center gap-6 group italic">
                        <div className="w-12 h-px bg-foreground/5 group-hover:bg-primary/40 transition-colors" /> EXIT_ENROLLMENT
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
