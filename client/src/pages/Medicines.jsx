import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
    FiShoppingCart,
    FiSearch,
    FiFilter,
    FiCalendar,
    FiInfo,
    FiPackage,
    FiArrowRight,
    FiShield,
    FiZap,
    FiGlobe,
    FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMedicines();
        const interval = setInterval(fetchMedicines, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get('/medicines');
            setMedicines(data.data.filter(m => m.adminVerified === 'verified' && m.status === 'listed'));
        } catch (error) {
            toast.error('Failed to fetch protocol inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (medicineId) => {
        const address = prompt("Deployment Destination (Shipping Address):");
        if (!address) return;

        try {
            await api.post('/orders', { medicineId, shippingAddress: address });
            toast.success('Asset allocation successful!', {
                icon: '🚀',
                duration: 4000
            });
            fetchMedicines();
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Protocol allocation failed');
        }
    };

    const filteredMedicines = medicines.filter(m =>
        m.extractedData?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-32 pt-24 px-6 relative">
            {/* Supreme Header */}
            <section className="container mx-auto max-w-[1400px] mb-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl"
                        >
                            <FiShield className="animate-pulse" /> Verified Protocol Chain
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl lg:text-[7rem] font-black text-foreground tracking-[-0.06em] leading-[0.85] uppercase italic"
                        >
                            Universal <br />
                            <span className="text-foreground/10">Marketplace.</span>
                        </motion.h1>
                    </div>

                    {/* Infinite Search Node */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full lg:w-[500px] p-1.5 rounded-[3.5rem] glass-focal border-white/10 group relative shadow-3d"
                    >
                        <div className="relative">
                            <FiSearch className="absolute left-10 top-1/2 -translate-y-1/2 text-primary opacity-30 group-hover:opacity-100 transition-all duration-700" size={32} />
                            <input
                                type="text"
                                placeholder="INDEX_SEARCH..."
                                className="w-full pl-24 pr-10 py-10 rounded-[3.2rem] bg-foreground/5 outline-none font-black text-2xl tracking-tighter uppercase placeholder:text-foreground/5 focus:bg-foreground/10 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Matrix Layout */}
            <div className="container mx-auto max-w-[1400px]">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Filter Sidebar */}
                    <aside className="lg:w-96 shrink-0 space-y-12">
                        <div className="premium-card p-12 bg-foreground text-background shadow-3d">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-background/20 mb-12 flex items-center gap-4 italic font-black">
                                <FiFilter /> Catalog Protocol
                            </h3>

                            <div className="space-y-6">
                                {['All', 'Essential', 'Critical', 'Emergency', 'Maintenance'].map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`
                                            w-full flex items-center justify-between px-10 py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700
                                            ${activeCategory === cat
                                                ? 'bg-primary text-white shadow-xl shadow-primary/30 border-primary'
                                                : 'bg-background/5 text-background/30 border-white/5 hover:border-primary/40'}
                                        `}
                                    >
                                        {cat} {activeCategory === cat && <FiChevronRight className="animate-bounce-x" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="premium-card p-12 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative z-10">
                                <FiZap className="text-4xl mb-10 text-primary group-hover:text-white transition-colors" />
                                <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-4 group-hover:text-white">Real-time Settlement</h4>
                                <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed group-hover:text-white/60">
                                    Instant liquidity transfer protocol for all verified assets.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Asset Matrix */}
                    <main className="flex-grow space-y-12">
                        <div className="flex items-center justify-between px-6 mb-16">
                            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground/10 italic">
                                <span className="text-primary">{filteredMedicines.length}</span> ACTIVE_NODES_IN_SYSTEM
                            </p>
                            <div className="w-1/3 h-px bg-foreground/[0.03]" />
                        </div>

                        {loading ? (
                            <div className="grid sm:grid-cols-2 gap-10">
                                {[1, 2, 4, 6].map(i => (
                                    <div key={i} className="h-[600px] rounded-[4rem] glass border-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : filteredMedicines.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-48 premium-card border-dashed flex flex-col items-center justify-center text-center opacity-30">
                                <FiPackage size={120} className="mb-10" />
                                <h3 className="text-4xl font-black uppercase tracking-[0.5em]">Inventory Null</h3>
                            </motion.div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-12">
                                <AnimatePresence mode="popLayout">
                                    {filteredMedicines.map((medicine) => (
                                        <motion.div
                                            key={medicine._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -12 }}
                                            className="premium-card p-0 overflow-hidden group/asset shadow-3d relative"
                                        >
                                            <div className="relative aspect-[16/11] overflow-hidden">
                                                <img
                                                    src={medicine.images?.[0]}
                                                    alt={medicine.extractedData?.name}
                                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover/asset:scale-125"
                                                />
                                                <div className="absolute top-10 left-10 px-6 py-2.5 rounded-2xl glass border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-3xl italic">
                                                    / VERIFIED_ASSET
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover/asset:opacity-100 transition-opacity duration-1000" />
                                            </div>

                                            <div className="p-12 pt-4">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-4 opacity-30 italic">INDEX_ID: #{medicine._id.slice(-10).toUpperCase()}</p>
                                                <div className="flex justify-between items-start mb-10">
                                                    <div className="max-w-[65%]">
                                                        <h3 className="text-4xl font-black italic tracking-tighter uppercase group-hover/asset:text-primary transition-colors duration-500 leading-tight">
                                                            {medicine.extractedData?.name}
                                                        </h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-foreground/10 transition-colors line-through tracking-[0.2em] mb-2 uppercase">L_MRP: ₹{medicine.extractedData?.mrp}</p>
                                                        <p className="text-5xl font-black tracking-[-0.06em] text-primary">₹{medicine.price}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-8 mb-12">
                                                    <div className="glass p-6 rounded-3xl border-white/5 group-hover/asset:bg-foreground/[0.02] transition-colors duration-700">
                                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/10 mb-2">
                                                            <FiCalendar className="text-primary" /> Expiry
                                                        </div>
                                                        <p className="text-xl font-black tracking-tighter uppercase italic">{new Date(medicine.extractedData?.expiryDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                    <div className="glass p-6 rounded-3xl border-white/5 group-hover/asset:bg-foreground/[0.02] transition-colors duration-700">
                                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/10 mb-2">
                                                            <FiGlobe className="text-secondary" /> Batch
                                                        </div>
                                                        <p className="text-xl font-black tracking-tighter uppercase italic truncate">{medicine.extractedData?.batchNumber}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleBuy(medicine._id)}
                                                    className="btn-premium w-full !rounded-[2.5rem] py-8 !text-2xl italic tracking-tighter group/btn shadow-[0_30px_60px_-15px_rgba(var(--primary),0.5)]"
                                                >
                                                    Acquire Node <FiArrowRight className="group-hover/btn:translate-x-4 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Supreme Ambient Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 h-screen w-screen overflow-hidden">
                <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[200px]" />
                <div className="absolute bottom-[20%] right-[-15%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[220px]" />
            </div>
        </div>
    );
};

export default Medicines;
