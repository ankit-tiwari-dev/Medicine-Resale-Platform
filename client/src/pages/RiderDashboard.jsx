import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
    FiPackage,
    FiMapPin,
    FiCamera,
    FiCheckCircle,
    FiClock,
    FiTrendingUp,
    FiNavigation,
    FiUser,
    FiActivity,
    FiArrowRight,
    FiGlobe,
    FiLayers,
    FiZap
} from 'react-icons/fi';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const RiderDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ totalCollected: 0, pendingPickups: 0 });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'rider') {
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [taskRes, statRes] = await Promise.all([
                api.get('/rider/tasks'),
                api.get('/rider/stats')
            ]);
            setTasks(taskRes.data.data);
            setStats(statRes.data.data);
        } catch (error) {
            toast.error('Logistics protocol synchronization error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCollection = async (medicineId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('medicineId', medicineId);
        formData.append('proof', file);

        try {
            await api.post('/rider/confirm-collection', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Asset collection verified and uploaded! 🚀');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Collection verification failed');
        } finally {
            setUploading(false);
        }
    };

    if (!user || user.role !== 'rider') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen pb-32 pt-24 px-6 relative">
            <div className="container mx-auto max-w-[1400px]">
                {/* Header */}
                <header className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl"
                        >
                            <FiGlobe className="animate-spin-slow" /> Global Logistics Node
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl lg:text-[6rem] font-black text-foreground tracking-[-0.06em] leading-[0.85] uppercase italic"
                        >
                            Logistics <br />
                            <span className="text-foreground/10">Control Hub.</span>
                        </motion.h1>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="premium-card px-10 py-6 border-emerald-500/20 bg-emerald-500/5 group shadow-3d flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white shadow-3xl shadow-emerald-500/30 group-hover:rotate-12 transition-transform duration-700">
                                <FiZap size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.4em] mb-2 text-primary">Authorization</p>
                                <p className="text-3xl font-black text-emerald-500 tracking-[-0.04em] uppercase italic">Active Node</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Map & Metrics Sidebar */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* Map-Lite Visualization */}
                        <div className="premium-card p-0 relative h-[450px] overflow-hidden group shadow-3d">
                            <div className="absolute inset-0 bg-[#050810] z-0">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent" />
                            </div>
                            <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                                {/* Stylized Vector Grid */}
                                <div className="grid grid-cols-8 grid-rows-8 gap-3 w-full h-64 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                                    {Array.from({ length: 64 }).map((_, i) => (
                                        <div key={i} className="border border-white/5 rounded-md flex items-center justify-center">
                                            <div className={`w-1 h-1 rounded-full ${Math.random() > 0.9 ? 'bg-primary animate-ping' : 'bg-white/5'}`} />
                                        </div>
                                    ))}
                                </div>

                                {/* Active Nodes Overlay */}
                                <div className="absolute top-20 left-0 right-0 h-64 flex items-center justify-center pointer-events-none">
                                    {tasks.slice(0, 3).map((task, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: i * 0.2 }}
                                            className="absolute p-4 rounded-3xl bg-primary/20 border border-primary/40 backdrop-blur-xl flex items-center gap-3 shadow-[0_0_40px_rgba(var(--primary),0.3)]"
                                            style={{
                                                top: `${10 + i * 30}%`,
                                                left: `${20 + i * 25}%`
                                            }}
                                        >
                                            <FiMapPin className="text-primary" size={16} />
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest italic">Node #{task._id.slice(-4).toUpperCase()}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="glass p-8 rounded-[2.5rem] border-white/10 flex items-center justify-between shadow-2xl">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 mb-2">Operational Sector</p>
                                        <p className="text-2xl font-black tracking-[-0.04em] uppercase italic">NCR_UNIT_X.1</p>
                                    </div>
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-[#050810] bg-primary flex items-center justify-center text-[10px] font-black text-white">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Matrix */}
                        <div className="grid grid-cols-2 gap-8">
                            <motion.div whileHover={{ y: -5 }} className="premium-card p-10 group bg-foreground text-background">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                    <FiCheckCircle size={32} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-background/20 mb-3">Completed</p>
                                <h3 className="text-5xl font-black tracking-[-0.06em] italic">{stats.totalCollected.toString().padStart(2, '0')}</h3>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} className="premium-card p-10 group">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 text-amber-500 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                    <FiClock size={32} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/10 mb-3">Pending</p>
                                <h3 className="text-5xl font-black tracking-[-0.06em] italic">{stats.pendingPickups.toString().padStart(2, '0')}</h3>
                            </motion.div>
                        </div>
                    </aside>

                    {/* Main Operations Terminal */}
                    <main className="lg:col-span-8 space-y-12">
                        <div className="flex items-center justify-between px-6">
                            <h2 className="text-5xl font-black tracking-[-0.04em] uppercase italic">
                                Dispatch <br />
                                <span className="text-foreground/10">Active Matrix.</span>
                            </h2>
                            <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.6em]">L1_TRACK_NODES</div>
                        </div>

                        {loading ? (
                            <div className="py-24 text-center font-black uppercase tracking-[0.8em] text-foreground/5 animate-pulse">Syncing Telemetry...</div>
                        ) : tasks.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-48 premium-card border-dashed bg-foreground/[0.01]">
                                <FiCheckCircle size={100} className="mx-auto mb-8 text-emerald-500/10" />
                                <h3 className="text-4xl font-black text-foreground/5 uppercase tracking-[0.5em]">Fleet Operational</h3>
                            </motion.div>
                        ) : (
                            <div className="grid gap-10">
                                <AnimatePresence mode="popLayout">
                                    {tasks.map((task, idx) => (
                                        <motion.div
                                            key={task._id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -10 }}
                                            className="premium-card p-12 group/task relative overflow-hidden transition-all duration-700 shadow-3d"
                                        >
                                            <div className="flex flex-col lg:flex-row gap-16 items-center">
                                                {/* Node Contextual Map */}
                                                <div className="w-48 h-48 rounded-[3rem] bg-foreground/[0.02] border border-white/5 flex items-center justify-center text-foreground/5 group-hover/task:text-primary backdrop-blur-3xl transition-all duration-1000 shadow-inner shrink-0 overflow-hidden relative">
                                                    <FiPackage size={72} className="relative z-10 transform group-hover/task:rotate-12 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/task:opacity-100 transition-opacity duration-1000" />
                                                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
                                                </div>

                                                <div className="flex-grow w-full">
                                                    <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-10 mb-12">
                                                        <div>
                                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4 opacity-30 italic">SUBJECT_ID: #{task._id.slice(-10).toUpperCase()}</p>
                                                            <h3 className="text-5xl font-black tracking-[-0.04em] uppercase italic group-hover/task:text-primary transition-colors duration-500 mb-8">{task.extractedData?.name || 'Manual Identification Req.'}</h3>

                                                            <div className="flex flex-wrap gap-10">
                                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                                                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><FiUser size={18} /></div> {task.sellerId.name}
                                                                </div>
                                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                                                                    <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary"><FiMapPin size={18} /></div> {task.sellerId.address?.city || 'Central Terminal'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="xl:text-right">
                                                            <p className="text-[10px] font-black text-foreground/10 uppercase tracking-[0.5em] mb-3">Asset Value</p>
                                                            <p className="text-5xl font-black text-primary tracking-[-0.06em]">₹{task.price}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-8">
                                                        <div className="flex-1 glass p-6 rounded-[2rem] border-white/5 flex items-center justify-between">
                                                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/10">
                                                                <FiClock className="text-primary" /> TTL Threshold
                                                            </div>
                                                            <span className="text-2xl font-black tracking-tighter italic tabular-nums">1.4h</span>
                                                        </div>

                                                        <label className="flex-[2] relative cursor-pointer group/upload">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                onChange={(e) => handleConfirmCollection(task._id, e)}
                                                                disabled={uploading}
                                                            />
                                                            <button
                                                                disabled={uploading}
                                                                className={`
                                                                btn-premium w-full !py-6 !text-2xl shadow-[0_30px_60px_-15px_rgba(var(--primary),0.5)] flex items-center justify-center gap-6 transition-all duration-700
                                                                ${uploading ? 'opacity-10 grayscale' : ''}
                                                            `}>
                                                                {uploading ? (
                                                                    <>Verifying Node... <FiActivity className="animate-spin" /></>
                                                                ) : (
                                                                    <>Confirm Recovery <FiCamera size={32} /></>
                                                                )}
                                                            </button>
                                                        </label>
                                                    </div>
                                                </div>
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
                <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[200px]" />
                <div className="absolute bottom-[20%] right-[-15%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[220px]" />
            </div>
        </div>
    );
};

export default RiderDashboard;
