import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import {
    FiUpload,
    FiDollarSign,
    FiPackage,
    FiTrendingUp,
    FiClock,
    FiPlus,
    FiImage,
    FiX,
    FiCheckCircle,
    FiArrowRight,
    FiActivity,
    FiLayers,
    FiGrid,
    FiZap
} from 'react-icons/fi';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMedicines();
            const interval = setInterval(fetchMedicines, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get('/medicines');
            const userMedicines = data.data.filter(m =>
                (m.sellerId?._id || m.sellerId).toString() === user._id.toString()
            );
            setMedicines(userMedicines);
        } catch (error) {
            console.error('Failed to fetch medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedFiles.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one image');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });
        const descriptionValue = e.target.description.value;
        formData.append('description', descriptionValue);

        try {
            await api.post('/medicines/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Asset synchronized with protocol ✨');
            e.target.reset();
            setSelectedFiles([]);
            setPreviews([]);
            fetchMedicines();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Synchronization failed');
        } finally {
            setUploading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'verified': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
            case 'collected': return 'bg-primary/10 text-primary border-primary/30';
            default: return 'bg-foreground/5 text-foreground/50 border-white/5';
        }
    };

    return (
        <div className="min-h-screen pb-32 pt-24 px-6 relative">
            <div className="container mx-auto max-w-[1400px]">
                {/* Dynamic Header */}
                <header className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl"
                        >
                            <FiActivity className="animate-spin-slow" /> Node Synchronized
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl lg:text-[6rem] font-black text-foreground tracking-[-0.06em] leading-[0.85] uppercase italic"
                        >
                            Investor <br />
                            <span className="text-foreground/10">Control Center.</span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-8"
                    >
                        <Link to="/wallet" className="premium-card p-10 flex items-center gap-10 group bg-primary/5 hover:bg-primary/10 border-primary/20 transition-all duration-700">
                            <div className="w-16 h-16 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-3xl shadow-primary/40 group-hover:rotate-12 transition-transform duration-700">
                                <FiDollarSign size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em] mb-2">Liquid Balance</p>
                                <p className="text-5xl font-black tracking-[-0.05em] leading-none text-primary">₹{user.walletBalance || 0}</p>
                            </div>
                            <FiArrowRight size={24} className="text-primary/30 group-hover:text-primary transition-all group-hover:translate-x-3" />
                        </Link>
                    </motion.div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Performance Bento */}
                    <aside className="lg:col-span-4 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="premium-card p-12 bg-foreground text-background relative overflow-hidden group shadow-3d"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -translate-y-24 translate-x-24 group-hover:scale-150 transition-transform duration-1000" />
                            <FiTrendingUp size={48} className="text-primary mb-12 transform group-hover:rotate-12 transition-transform" />
                            <h3 className="text-background/20 font-black uppercase tracking-[0.4em] text-[10px] mb-3">Portfolio Valuation</h3>
                            <p className="text-6xl font-black tracking-[-0.06em] leading-none mb-6">₹{medicines.reduce((acc, curr) => acc + (curr.price || 0), 0)}</p>
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                                <FiCheckCircle /> 0.0s Deployment Latency
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -5 }}
                            className="premium-card p-12 group hover:border-secondary/50 transition-all duration-700"
                        >
                            <FiLayers size={48} className="text-secondary mb-12 opacity-30 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-foreground/20 font-black uppercase tracking-[0.4em] text-[10px] mb-3">Active Units</h3>
                            <p className="text-6xl font-black tracking-[-0.06em] leading-none mb-6 italic">{medicines.length}</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">/ Distributed Ledger Protocol</p>
                        </motion.div>

                        <div className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
                            <div className="flex items-center gap-6 mb-8 text-foreground/20 italic font-black uppercase tracking-[0.3em] text-[10px]">
                                <FiZap className="text-primary" /> Active Nodes
                            </div>
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center group/node">
                                        <div className="w-2 h-2 rounded-full bg-primary/20 group-hover/node:bg-primary transition-colors" />
                                        <div className="flex-1 mx-4 h-px bg-foreground/[0.03]" />
                                        <span className="text-[10px] font-black text-foreground/10 group-hover/node:text-foreground/40 transition-colors uppercase tabular-nums tracking-widest">NODE_001.X</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Operations Matrix */}
                    <main className="lg:col-span-8 space-y-12">
                        {/* Deployment Terminal */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="premium-card p-16 relative overflow-hidden shadow-3d"
                        >
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[2rem] bg-foreground/5 flex items-center justify-center text-primary shadow-inner">
                                        <FiPlus size={32} />
                                    </div>
                                    <h2 className="text-5xl font-black tracking-[-0.04em] uppercase italic">Deploy</h2>
                                </div>
                                <div className="text-[10px] font-black text-foreground/10 uppercase tracking-[1em]">SYSTEM_INGEST</div>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-12 group/form">
                                <div className="relative group cursor-pointer h-80 rounded-[3.5rem] overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="absolute inset-0 bg-foreground/[0.02] border-2 border-dashed border-border rounded-[3.5rem] flex flex-col items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/40 transition-all duration-700">
                                        <div className="w-28 h-28 rounded-[2.5rem] bg-background shadow-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                            <FiImage size={48} className="text-foreground/5 group-hover:text-primary transition-colors duration-700" />
                                        </div>
                                        <p className="text-2xl font-black tracking-tighter uppercase italic mb-2">Visual Core Ingest</p>
                                        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">Protocol 2.0 / Imagery Handover</p>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {previews.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="grid grid-cols-5 gap-6"
                                        >
                                            {previews.map((preview, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group/img shadow-2xl border border-white/10 glass">
                                                    <img src={preview} alt="preview" className="w-full h-full object-cover group-hover/img:scale-125 transition-transform duration-1000" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(idx)}
                                                        className="absolute inset-0 bg-rose-500/90 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all duration-500 backdrop-blur-sm"
                                                    >
                                                        <FiX size={32} />
                                                    </button>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="relative">
                                    <div className="absolute -top-3 left-10 px-4 glass text-[10px] italic font-black text-primary uppercase tracking-[0.5em] z-10">Meta Buffer</div>
                                    <textarea
                                        name="description"
                                        placeholder="INPUT PHARMACEUTICAL ENTROPY DATA..."
                                        className="w-full px-12 py-10 rounded-[3.5rem] glass border-white/10 focus:border-primary/40 focus:ring-[20px] focus:ring-primary/5 transition-all outline-none font-bold text-2xl leading-tight min-h-[220px] shadow-inner uppercase tracking-tighter placeholder:text-foreground/5"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading || selectedFiles.length === 0}
                                    className="btn-premium w-full py-8 text-3xl disabled:opacity-10 disabled:grayscale transition-all duration-1000"
                                >
                                    {uploading ? (
                                        <span className="flex items-center gap-6">
                                            <FiActivity className="animate-spin" /> Node Syncing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-6">
                                            Initialize Protocol <FiArrowRight className="group-hover/form:translate-x-4 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Portfolio Ledger */}
                        <div className="space-y-12">
                            <div className="flex items-center justify-between px-6">
                                <h2 className="text-5xl font-black tracking-[-0.04em] uppercase italic">
                                    Ledger <br />
                                    <span className="text-foreground/10">Historical.</span>
                                </h2>
                                <div className="text-right">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 mb-4">
                                        <FiLayers /> Total Nodes: {medicines.length}
                                    </div>
                                    <div className="w-48 h-1 bg-foreground/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (medicines.length / 20) * 100)}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-24 text-center font-black uppercase tracking-[0.8em] text-foreground/5 animate-pulse">Syncing Pulse...</div>
                            ) : medicines.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-48 premium-card border-dashed flex flex-col items-center justify-center text-center opacity-30">
                                    <FiPackage size={100} className="mb-8" />
                                    <h3 className="text-3xl font-black uppercase tracking-[0.4em]">Vault Empty</h3>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {medicines.map((m, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ y: -12 }}
                                            className="premium-card p-0 overflow-hidden group/card shadow-2xl relative"
                                        >
                                            <div className="aspect-[16/10] overflow-hidden relative">
                                                {m.images?.[0] ? (
                                                    <img src={m.images[0]} alt="medicine" className="w-full h-full object-cover group-hover/card:scale-125 transition-transform duration-1000" />
                                                ) : (
                                                    <div className="w-full h-full bg-foreground/5 flex items-center justify-center text-foreground/5">
                                                        <FiPackage size={80} />
                                                    </div>
                                                )}
                                                <div className="absolute top-8 right-8 z-10">
                                                    <span className={`text-[10px] font-black uppercase px-6 py-3 rounded-2xl backdrop-blur-2xl border-2 italic tracking-widest shadow-2xl ${getStatusStyle(m.adminVerified)}`}>
                                                        {m.adminVerified}
                                                    </span>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                                            </div>
                                            <div className="p-12">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-4 opacity-30">AUTH_KEY_#{m._id.slice(-6).toUpperCase()}</p>
                                                <h4 className="text-3xl font-black mb-8 truncate uppercase tracking-tighter italic group-hover/card:text-primary transition-colors">
                                                    {m.extractedData?.name || 'Protocol Analysis...'}
                                                </h4>
                                                <div className="flex items-center justify-between border-t border-foreground/[0.03] pt-10">
                                                    <div>
                                                        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">Node Value</p>
                                                        <p className="text-4xl font-black tracking-[-0.04em] text-primary">₹{m.price || 0}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">Timestamp</p>
                                                        <p className="text-xl font-black opacity-20 italic">
                                                            {new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {medicines.length > 0 && (
                                <Link to="/orders" className="w-full mt-20 py-12 rounded-[4rem] flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[1em] text-foreground/10 hover:text-primary hover:bg-primary/5 transition-all duration-700 border-2 border-dashed border-white/5 group">
                                    <FiActivity className="group-hover:animate-spin" /> Sync Full History Ledger <FiArrowRight className="group-hover:translate-x-4 transition-transform" />
                                </Link>
                            )}
                        </div>
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

export default Dashboard;
