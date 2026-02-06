import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { getMedicines } from '../services/api';
import MedicineCard from '../components/MedicineCard';
import toast from 'react-hot-toast';

const Marketplace = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async (search = '') => {
        setLoading(true);
        try {
            const response = await getMedicines(search ? { search } : {});
            setMedicines(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load medicines.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMedicines(query);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

            {/* Hero Section - Dark & Premium */}
            <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-[#022c22]">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-teal-500/10 to-transparent rounded-full blur-3xl opacity-50" />
                    <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Left: Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-teal-300 text-sm font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                                    The New Standard
                                </div>
                                <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
                                    Turn Unused <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                                        Medicine
                                    </span> into Value.
                                </h1>
                                <p className="text-lg text-teal-100/70 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Join the premier AI-verified marketplace for pharmaceutical exchange.
                                    Secure, compliant, and designed for the future of healthcare.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <button className="h-14 px-8 rounded-full bg-white text-emerald-950 font-bold text-lg hover:bg-teal-50 transition-all flex items-center gap-2 group">
                                        Start Selling <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="h-14 px-8 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
                                        How it Works
                                    </button>
                                </div>

                                <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start text-sm text-teal-200/50 font-medium">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-teal-400" /> AI Verified
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-teal-400" /> Secure Payments
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-teal-400" /> 24/7 Support
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Visual */}
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-emerald-900/50">
                                    <img
                                        src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000"
                                        alt="Modern Pharmacy"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/80 to-transparent mix-blend-multiply" />


                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Search Bar - Bridging the gap */}
            <div className="sticky top-0 z-40 -mt-8 px-6 mb-12 pointer-events-none">
                <div className="max-w-2xl mx-auto pointer-events-auto">
                    <motion.form
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        onSubmit={handleSearch}
                        className="relative group"
                    >
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="text-slate-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search verified medicine (e.g., Aspirin, Antibiotics)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full py-5 pl-14 pr-6 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 text-slate-800 placeholder:text-slate-400 text-lg transition-all"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-xl hover:bg-slate-800 transition-colors">
                            <ArrowRight size={20} />
                        </button>
                    </motion.form>
                </div>
            </div>

            {/* Medicine Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-2">Fresh Arrivals</h2>
                        <p className="text-slate-500">Explore the latest verified listings added today.</p>
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer hover:bg-slate-50 transition-colors">
                            <option>Newest First</option>
                            <option>Price: Low to High</option>
                            <option>Expiry Date</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-teal-600">
                        <Loader2 size={48} className="animate-spin mb-4" />
                        <p className="font-sans font-medium animate-pulse text-slate-400">Fetching Listings...</p>
                    </div>
                ) : medicines.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-500 text-lg mb-4">No medicines found matching your criteria.</p>
                        <button onClick={() => { setQuery(''); fetchMedicines('') }} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-colors">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {medicines.map((med) => (
                            <MedicineCard key={med._id} medicine={med} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Marketplace;
