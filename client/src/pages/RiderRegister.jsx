import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import symbol from '../assets/symbol.png';
import bgImage from '../assets/pexels-antonella-traversaro-445347-1138746.jpg';

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
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Side: Branding */}
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
                        Become a <br />
                        <span className="text-teal-400">MedAImart Rider</span>
                    </h2>

                    <div className="space-y-6 text-teal-50/80">
                        <div className="flex items-center gap-4">
                            <Truck className="w-6 h-6 text-teal-400" />
                            <span className="text-lg font-medium">Deliver health, earn trust and profit</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-6 h-6 text-teal-400" />
                            <span className="text-lg font-medium">Flexible hours & weekly payouts</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <CheckCircle className="w-6 h-6 text-teal-400" />
                            <span className="text-lg font-medium">Be part of the Re-Pharmacy revolution</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Drive with Us</h1>
                        <p className="text-gray-500 font-medium">Enter your details to register as a rider.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, vehicleType: 'bike' })}
                                className={`py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${formData.vehicleType === 'bike' ? 'border-[#32aeb1] bg-[#32aeb1]/5 text-[#32aeb1]' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                            >
                                <Truck className="w-4 h-4" /> Bike
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, vehicleType: 'car' })}
                                className={`py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${formData.vehicleType === 'car' ? 'border-[#32aeb1] bg-[#32aeb1]/5 text-[#32aeb1]' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                            >
                                <Truck className="w-4 h-4" /> Car
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#32aeb1]/20 outline-none transition-all font-semibold"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#32aeb1]/20 outline-none transition-all font-semibold"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#32aeb1]/20 outline-none transition-all font-semibold"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">License #</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#32aeb1]/20 outline-none transition-all font-semibold"
                                        placeholder="License"
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#32aeb1]/20 outline-none transition-all font-semibold"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-13 bg-[#32aeb1] hover:bg-[#2a9396] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-70 mt-6"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register as Rider'}
                            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-8 font-medium">
                        Looking for the customer site?{' '}
                        <Link to="/register" className="text-[#32aeb1] font-bold hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RiderRegister;
