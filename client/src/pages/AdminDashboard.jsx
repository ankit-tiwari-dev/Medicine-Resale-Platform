import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import {
    FiCheck,
    FiX,
    FiUser,
    FiGrid,
    FiActivity,
    FiShield,
    FiUsers,
    FiPackage,
    FiDollarSign,
    FiExternalLink,
    FiChevronRight,
    FiArrowRight,
    FiCpu,
    FiTruck,
    FiCamera,
    FiInfo,
    FiGlobe,
    FiZap
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [riders, setRiders] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('VERIFICATION'); // VERIFICATION, ASSIGNMENT, COLLECTION
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMedicines: 0,
        pendingVerifications: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [user, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let statusQuery = 'uploaded';
            if (activeTab === 'ASSIGNMENT') statusQuery = 'verified';
            if (activeTab === 'COLLECTION') statusQuery = 'collected';

            const [medRes, riderRes, logRes, statRes] = await Promise.all([
                api.get(`/admin/medicines?status=${statusQuery}`),
                activeTab === 'ASSIGNMENT' ? api.get('/admin/riders') : Promise.resolve({ data: { data: [] } }),
                api.get('/admin/logs'),
                api.get('/admin/stats')
            ]);

            setMedicines(medRes.data.data);
            setRiders(riderRes.data.data);
            setLogs(logRes.data.data);

            setStats({
                ...statRes.data.data,
                pendingVerifications: activeTab === 'VERIFICATION' ? medRes.data.data.length : stats.pendingVerifications
            });
        } catch (error) {
            toast.error('Protocol synchronization failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, action) => {
        try {
            await api.post(`/admin/medicines/${id}/verify`, { action });
            toast.success(`Protocol ${action === 'approve' ? 'Clearance Issued' : 'Rejection Finalized'} ✨`);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification logic error');
        }
    };

    const handleAssignRider = async (riderId) => {
        if (!selectedMedicine) return;
        setProcessing(true);
        try {
            await api.post('/admin/assign-rider', {
                medicineId: selectedMedicine._id,
                riderId
            });
            toast.success('Rider assigned to protocol run! 🚀');
            setShowAssignmentModal(false);
            fetchData();
        } catch (error) {
            toast.error('Assignment protocol error');
        } finally {
            setProcessing(false);
        }
    };

    const handleApproveCollection = async () => {
        if (!selectedMedicine) return;
        setProcessing(true);
        try {
            await api.post('/admin/approve-collection', {
                medicineId: selectedMedicine._id
            });
            toast.success('Asset collection finalized. Listing live! ✨');
            setShowProofModal(false);
            fetchData();
        } catch (error) {
            toast.error('Collection approval error');
        } finally {
            setProcessing(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    const tabs = [
        { id: 'VERIFICATION', label: 'Clearance', icon: <FiShield />, color: 'primary' },
        { id: 'ASSIGNMENT', label: 'Dispatch', icon: <FiTruck />, color: 'secondary' },
        { id: 'COLLECTION', label: 'Settlement', icon: <FiCheck />, color: 'emerald-500' }
    ];

    return (
        <div className="min-h-screen pb-32 pt-24 px-6 relative">
            <div className="container mx-auto max-w-[1400px]">
                {/* Header */}
                <header className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl"
                        >
                            <FiCpu className="animate-spin-slow" /> Supreme Command Node
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl lg:text-[6rem] font-black text-foreground tracking-[-0.06em] leading-[0.85] uppercase italic"
                        >
                            Global <br />
                            <span className="text-foreground/10">Command Center.</span>
                        </motion.h1>
                    </div>

                    <div className="flex bg-foreground/5 p-2 rounded-[2.5rem] glass border-white/5 backdrop-blur-3xl">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-8 py-4 rounded-[2rem] flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
                                    ${activeTab === tab.id
                                        ? `bg-foreground text-background shadow-3xl`
                                        : 'text-foreground/30 hover:text-foreground/60'}
                                `}
                            >
                                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Main Operations Matrix */}
                    <main className="lg:col-span-8 space-y-12">
                        <div className="flex items-center justify-between px-6">
                            <h2 className="text-5xl font-black tracking-[-0.04em] uppercase italic">
                                {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} <br />
                                <span className="text-foreground/10">Operational Queue.</span>
                            </h2>
                            <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.5em]">L_QUEUE_TERMINAL</div>
                        </div>

                        {loading ? (
                            <div className="py-24 text-center font-black uppercase tracking-[0.8em] text-foreground/5 animate-pulse">Syncing Operational Matrix...</div>
                        ) : medicines.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-48 premium-card border-dashed bg-foreground/[0.01]">
                                <FiCheck size={100} className="mx-auto mb-8 text-emerald-500/10" />
                                <h3 className="text-3xl font-black text-foreground/10 uppercase tracking-[0.4em]">Protocol Clear</h3>
                            </motion.div>
                        ) : (
                            <div className="grid gap-10">
                                <AnimatePresence mode="popLayout">
                                    {medicines.map((medicine, idx) => (
                                        <motion.div
                                            key={medicine._id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -8 }}
                                            className="premium-card p-0 overflow-hidden group/item shadow-3d relative"
                                        >
                                            <div className="flex flex-col lg:flex-row h-full">
                                                <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative group/img">
                                                    <img src={medicine.images[0]} alt="Subject" className="w-full h-full object-cover group-hover/img:scale-125 transition-transform duration-[2s]" />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-0 lg:opacity-100" />
                                                </div>

                                                <div className="flex-grow p-12 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div>
                                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-3 opacity-30">TX_AUTH: #{medicine._id.slice(-8).toUpperCase()}</p>
                                                                <h3 className="text-4xl font-black tracking-[-0.04em] uppercase italic group-hover/item:text-primary transition-colors duration-500">
                                                                    {medicine.extractedData?.name || 'Manual Resolution Needed'}
                                                                </h3>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-4xl font-black text-primary tracking-[-0.05em]">₹{medicine.price}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-6 mb-12">
                                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                                                <FiUser className="text-primary" /> {medicine.sellerId?.name}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                                                <FiGlobe className="text-secondary" /> {medicine.sellerId?.address?.city || 'Sector Core'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-6">
                                                        {activeTab === 'VERIFICATION' && (
                                                            <>
                                                                <button onClick={() => handleVerify(medicine._id, 'approve')} className="flex-[3] btn-premium py-6 !text-2xl shadow-emerald-500/30 bg-emerald-500">Approve Node</button>
                                                                <button onClick={() => handleVerify(medicine._id, 'reject')} className="flex-1 rounded-[2rem] glass text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"><FiX size={24} /></button>
                                                            </>
                                                        )}
                                                        {activeTab === 'ASSIGNMENT' && (
                                                            <button
                                                                onClick={() => { setSelectedMedicine(medicine); setShowAssignmentModal(true); }}
                                                                className="flex-1 btn-premium py-6 !text-2xl shadow-secondary/30 bg-secondary"
                                                            >
                                                                Assign Dispatch Node
                                                            </button>
                                                        )}
                                                        {activeTab === 'COLLECTION' && (
                                                            <button
                                                                onClick={() => { setSelectedMedicine(medicine); setShowProofModal(true); }}
                                                                className="flex-1 btn-premium py-6 !text-2xl shadow-emerald-500/30 bg-emerald-500"
                                                            >
                                                                Verify & Finalize Settlement
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </main>

                    {/* Meta Intelligence Sidebar */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* System Performance */}
                        <div className="premium-card p-12 bg-foreground text-background shadow-3d">
                            <h3 className="text-2xl font-black mb-12 tracking-[-0.04em] uppercase italic">System Metrics</h3>
                            <div className="space-y-10">
                                <div className="p-8 rounded-[2.5rem] bg-background/5 border border-white/5 group hover:border-primary/40 transition-all">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-background/20 mb-3">Network Liquidity</p>
                                    <p className="text-5xl font-black tracking-[-0.06em]">₹{stats.totalRevenue}</p>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-background/5 border border-white/5 group hover:border-secondary/40 transition-all">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-background/20 mb-3">Clearence Rate</p>
                                    <p className="text-5xl font-black tracking-[-0.06em]">98.4%</p>
                                </div>
                            </div>
                        </div>

                        {/* Telemetry Feed */}
                        <div className="premium-card p-12 relative overflow-hidden bg-background">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black tracking-[-0.04em] uppercase italic">Telemetry</h3>
                                <FiActivity className="text-primary animate-pulse" />
                            </div>
                            <div className="space-y-10 max-h-[450px] overflow-y-auto pr-4 scrollbar-hide">
                                {logs.map((log, i) => (
                                    <div key={log._id} className="flex gap-8 items-start group relative">
                                        <div className="w-14 h-14 rounded-2xl bg-foreground/[0.03] flex items-center justify-center text-primary shrink-0 shadow-lg group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                                            <FiZap size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black leading-none tracking-tight uppercase group-hover:text-primary transition-colors mb-2">
                                                {log.action.replace('_', ' ')}
                                            </p>
                                            <p className="text-[10px] text-foreground/20 font-black uppercase tracking-[0.3em] italic">
                                                {new Date(log.createdAt).toLocaleTimeString()} / {log.adminId.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {logs.length === 0 && (
                                    <p className="text-center text-[10px] font-black uppercase text-foreground/10 py-16 tracking-[1em]">NO_DATA</p>
                                )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Rider Assignment Matrix */}
            <AnimatePresence>
                {showAssignmentModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-[40px] bg-background/40"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
                            className="w-full max-w-5xl premium-card p-0 relative overflow-hidden shadow-[0_0_120px_rgba(var(--primary),0.2)]"
                        >
                            <div className="p-16 border-b border-white/5 flex items-center justify-between bg-foreground/5">
                                <div>
                                    <h2 className="text-5xl font-black tracking-[-0.05em] uppercase italic mb-4">Dispatcher <br /><span className="text-foreground/20">Protocol.</span></h2>
                                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.5em]">Assign Node #{selectedMedicine?._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <button onClick={() => setShowAssignmentModal(false)} className="w-16 h-16 rounded-3xl glass flex items-center justify-center text-foreground/20 hover:text-rose-500 hover:rotate-90 transition-all duration-700"><FiX size={32} /></button>
                            </div>

                            <div className="p-16 grid md:grid-cols-2 gap-10 max-h-[60vh] overflow-y-auto scrollbar-hide">
                                {riders.map(rider => (
                                    <button
                                        key={rider._id}
                                        onClick={() => handleAssignRider(rider.userId._id)}
                                        disabled={processing}
                                        className="p-10 rounded-[3rem] glass border-white/5 text-left hover:border-primary/50 transition-all duration-700 group flex items-center justify-between relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10">
                                            <h4 className="text-2xl font-black tracking-tighter uppercase italic">{rider.userId.name}</h4>
                                            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mt-3">/ {rider.userId.email}</p>
                                            <div className="flex items-center gap-4 mt-8 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Authorized Unit
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-700 relative z-10 shadow-xl">
                                            <FiArrowRight size={32} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Proof Ledger Verification Modal */}
            <AnimatePresence>
                {showProofModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-[40px] bg-background/40"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
                            className="w-full max-w-4xl premium-card p-16 relative overflow-hidden shadow-[0_0_120px_rgba(var(--primary),0.2)]"
                        >
                            <button onClick={() => setShowProofModal(false)} className="absolute top-16 right-16 w-16 h-16 rounded-3xl glass flex items-center justify-center text-foreground/20 hover:text-rose-500 hover:rotate-90 transition-all duration-700"><FiX size={32} /></button>

                            <h2 className="text-6xl font-black tracking-[-0.06em] uppercase italic mb-12">Asset Recovery <br /><span className="text-foreground/20">Evidence File.</span></h2>

                            <div className="rounded-[4rem] overflow-hidden border-2 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] h-[450px] relative group/evidence">
                                <img src={selectedMedicine?.pickupProof} alt="Recovery Proof" className="w-full h-full object-cover group-hover/evidence:scale-110 transition-transform duration-[3s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-bottom p-12">
                                    <div className="mt-auto">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">Subject Node</p>
                                        <p className="text-2xl font-black text-white uppercase italic">#{selectedMedicine?._id.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 flex gap-10">
                                <button
                                    onClick={handleApproveCollection}
                                    disabled={processing}
                                    className="flex-[2] btn-premium py-10 !text-3xl shadow-emerald-500/40 bg-emerald-500"
                                >
                                    {processing ? 'Clearing Ledger...' : 'Finalize Settlement ✨'}
                                </button>
                                <button className="flex-1 rounded-[2.5rem] glass text-rose-500 font-black uppercase tracking-[0.4em] text-[10px] border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Reject Protocol Evidence</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ambient Pulse Decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-40 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[200px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[180px]" />
            </div>
        </div>
    );
};

export default AdminDashboard;
