import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import symbol from '../assets/symbol.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'buyer'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await register(formData);
        if (success) {
            navigate('/marketplace');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-slate-800">
            {/* Left Side: Branding (40% width) */}
            <div className="hidden lg:flex lg:w-[40%] relative bg-[#022c22] overflow-hidden flex-col justify-between p-16 text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-teal-500/20 to-transparent opacity-40 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-8">
                        Join the Revolution
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-6xl font-bold tracking-tight leading-[1.1] mb-6 font-serif">
                        A Better <br />
                        Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">Heal</span>
                    </h1>
                    <p className="text-lg text-teal-100/60 font-light max-w-sm leading-relaxed">
                        Buy and sell verified medicines with AI-powered confidence. Simple, safe, and secure.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-sm text-teal-200/50 font-medium">
                        <CheckCircle size={16} /> Trusted by 10,000+ users
                    </div>
                </div>
            </div>

            {/* Right Side: Form (60% width) */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-6 lg:p-12 bg-white">
                <div className="w-full max-w-[420px]">

                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2">
                                <img src={symbol} alt="Logo" className="w-8 h-8 object-contain" />
                                <span className="text-xl font-bold text-slate-900 tracking-tight">MedAImart</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
                        <p className="text-slate-500 text-sm">Get started with MedAImart today</p>
                    </div>

                    {/* Google Auth - TOP */}
                    <button
                        type="button"
                        onClick={() => window.location.href = 'http://localhost:5000/api/v1/auth/google'}
                        className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99] mb-8"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.13a7.11 7.11 0 010-4.26V7.03H2.18a11.99 11.99 0 000 9.93l3.66-2.83z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="relative flex items-center gap-4 mb-8">
                        <div className="flex-1 border-t border-slate-200"></div>
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 border-t border-slate-200"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Phone</label>
                            <input
                                type="tel"
                                required
                                className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                placeholder="+1 234 567 890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-[#32aeb1] hover:bg-[#2a9396] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 mt-2"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500 mb-4">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
                                Log in
                            </Link>
                        </p>
                        <Link to="/register-rider" className="text-xs font-semibold text-slate-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-1">
                            Want to earn? Join as a Delivery Partner <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
