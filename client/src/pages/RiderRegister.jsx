import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Truck, CreditCard } from 'lucide-react';
import symbol from '../assets/symbol.png';

const RiderRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        vehicleType: 'bike',
        licenseNumber: '',
        role: 'rider'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await register(formData);
        if (success) {
            navigate('/dashboard');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-slate-800">
            {/* Left Side: Branding (40% width) */}
            <div className="hidden lg:flex lg:w-[40%] relative bg-[#022c22] overflow-hidden flex-col justify-between p-16 text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900/40 via-[#022c22] to-[#022c22] opacity-70" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider mb-8">
                        Earn with Us
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-6xl font-bold tracking-tight leading-[1.1] mb-6 font-serif">
                        Deliver <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">Trust</span>
                    </h1>
                    <p className="text-lg text-teal-100/60 font-light max-w-sm leading-relaxed">
                        Become a logistics partner. Flexible hours, weekly payouts, and a mission that matters.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-teal-50">
                            Weekly Payouts
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-teal-50">
                            Zero Joining Fee
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form (60% width) */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-6 lg:p-12 bg-white">
                <div className="w-full max-w-[420px]">

                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2">
                                <img src={symbol} alt="Logo" className="w-8 h-8 object-contain" />
                                <span className="text-xl font-bold text-slate-900 tracking-tight">MedAImart</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Drive with MedAImart</h2>
                        <p className="text-slate-500 text-sm">Sign up as a rider today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, vehicleType: 'bike' })}
                                className={`py-3 rounded-lg border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${formData.vehicleType === 'bike' ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Truck className="w-4 h-4" /> Bike
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, vehicleType: 'car' })}
                                className={`py-3 rounded-lg border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${formData.vehicleType === 'car' ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Truck className="w-4 h-4" /> Car
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                placeholder="Full Name"
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
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">License #</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                                    placeholder="License"
                                    value={formData.licenseNumber}
                                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                />
                            </div>
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
                            className="w-full h-12 bg-[#32aeb1] hover:bg-[#2a9396] text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 mt-4"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register Rider'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500">
                            Want to buy medicine?{' '}
                            <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
                                Buyer Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderRegister;
