import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import symbol from '../assets/symbol.png';
import bgImage from '../assets/pexels-n-voitkevich-7615463.jpg';

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
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Side: Illustration / Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#003232]">
                <div className="absolute inset-0 z-0">
                    <img
                        src={bgImage}
                        alt="MedAImart"
                        className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#003232] via-[#003232]/95 to-[#32aeb1]/20" />
                </div>

                <div className="relative z-10 w-full min-h-full flex flex-col justify-start pt-24 px-20">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                            <img src={symbol} alt="Logo" className="w-full h-full object-contain p-2" />
                        </div>
                        <span className="text-4xl font-extrabold text-white tracking-tight">
                            Med<span className="text-teal-400">AI</span>mart
                        </span>
                    </div>

                    <h2 className="text-5xl font-bold text-white leading-tight mb-8">
                        Join the <br />
                        <span className="text-teal-400">Re-Pharmacy</span> revolution
                    </h2>

                    <div className="space-y-6 text-teal-50/80">
                        <div className="flex items-center gap-4">
                            <CheckCircle className="w-6 h-6 text-teal-400" />
                            <p className="text-lg font-medium">Buy verified medicines at affordable rates</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckCircle className="w-6 h-6 text-teal-400" />
                            <p className="text-lg font-medium">Sell your surplus medicines safely</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckCircle className="w-6 h-6 text-teal-400" />
                            <p className="text-lg font-medium">Expert verification of every listing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 pt-7 pb-12 lg:px-24 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="mb-8 lg:hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={symbol} alt="Logo" className="w-8 h-8" />
                            <span className="text-xl font-bold text-[#32aeb1]">MedAImart</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500 font-medium font-medium">Sign up to start buying or selling.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#32aeb1] focus:ring-4 focus:ring-[#32aeb1]/10 outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#32aeb1] focus:ring-4 focus:ring-[#32aeb1]/10 outline-none transition-all"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#32aeb1] focus:ring-4 focus:ring-[#32aeb1]/10 outline-none transition-all"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#32aeb1] focus:ring-4 focus:ring-[#32aeb1]/10 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-[#32aeb1] hover:bg-[#2a9396] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-70 mt-4"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.location.href = 'http://localhost:5000/api/v1/auth/google'}
                        className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm mb-4"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.13a7.11 7.11 0 010-4.26V7.03H2.18a11.99 11.99 0 000 9.93l3.66-2.83z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-gray-500 mt-8 font-medium text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#32aeb1] font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
