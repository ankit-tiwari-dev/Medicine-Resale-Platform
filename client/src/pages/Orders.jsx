import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import {
    FiShoppingBag,
    FiPackage,
    FiTruck,
    FiCheckCircle,
    FiMapPin,
    FiInfo,
    FiSearch,
    FiArrowRight,
    FiActivity,
    FiTrendingUp,
    FiGlobe,
    FiLayers
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/my-orders');
            setOrders(data.data);
        } catch (error) {
            toast.error('Failed to fetch protocol fulfillment ledger');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/20';
            case 'shipped': return 'bg-primary/10 text-primary border-primary/20 shadow-primary/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/20';
            default: return 'bg-foreground/5 text-foreground/40 border-border';
        }
    };

    return (
        <div className="min-h-screen pb-32 pt-24 px-6 relative">
            <div className="container mx-auto max-w-[1400px]">
                {/* Header */}
                <header className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl"
                        >
                            <FiActivity className="animate-spin-slow" /> Fulfillment System Online
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl lg:text-[7.5rem] font-black text-foreground tracking-[-0.07em] leading-[0.8] uppercase italic"
                        >
                            Acquisition <br />
                            <span className="text-foreground/10">Ledger.</span>
                        </motion.h1>
                    </div>

                    <div className="flex bg-foreground/5 p-2 rounded-[2.5rem] glass border-white/5 backdrop-blur-3xl shadow-3d">
                        <div className="px-10 py-6 flex flex-col items-center">
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">Fleet Synchronization</span>
                            <span className="text-2xl font-black italic text-secondary uppercase">Layer_01_Live</span>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Active Fulfillment Matrix */}
                    <main className="lg:col-span-8 space-y-12">
                        <div className="flex items-center justify-between px-6">
                            <h2 className="text-5xl font-black tracking-[-0.04em] uppercase italic">
                                Active <br />
                                <span className="text-foreground/10">Protocol Queue.</span>
                            </h2>
                            <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.6em]">PROCUREMENT_SYNC</div>
                        </div>

                        {loading ? (
                            <div className="py-24 text-center font-black uppercase tracking-[0.8em] text-foreground/5 animate-pulse">Syncing Fulfillment Ledger...</div>
                        ) : orders.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-48 premium-card border-dashed flex flex-col items-center justify-center text-center opacity-30">
                                <FiShoppingBag size={120} className="mb-10" />
                                <h3 className="text-4xl font-black uppercase tracking-[0.5em]">Ledger Null</h3>
                            </motion.div>
                        ) : (
                            <div className="grid gap-10">
                                <AnimatePresence mode="popLayout">
                                    {orders.map((order, idx) => (
                                        <motion.div
                                            key={order._id}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ y: -8 }}
                                            className="premium-card p-0 overflow-hidden group/order shadow-3d relative"
                                        >
                                            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary/[0.03] to-transparent pointer-events-none" />

                                            <div className="flex flex-col xl:flex-row">
                                                {/* Asset Preview Node */}
                                                <div className="xl:w-48 h-48 xl:h-auto overflow-hidden relative group/img shrink-0 border-r border-white/5">
                                                    {order.medicineId?.images?.[0] ? (
                                                        <img src={order.medicineId.images[0]} alt="asset" className="w-full h-full object-cover group-hover/order:scale-125 transition-transform duration-[2s]" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-foreground/[0.02] text-foreground/10"><FiPackage size={48} /></div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
                                                </div>

                                                <div className="flex-grow p-12">
                                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-8 mb-12">
                                                        <div>
                                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4 opacity-30 italic">TX_NODE: #{order._id.slice(-10).toUpperCase()}</p>
                                                            <h3 className="text-4xl font-black italic tracking-tighter uppercase group-hover/order:text-primary transition-colors duration-500 leading-tight">
                                                                {order.medicineId?.extractedData?.name || 'In-Fulfillment Asset'}
                                                            </h3>
                                                        </div>
                                                        <div className={`px-8 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 backdrop-blur-3xl italic ${getStatusStyle(order.status)}`}>
                                                            <div className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-primary'}`} />
                                                            {order.status}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                                                        <div className="glass p-6 rounded-3xl border-white/5 group-hover/order:bg-foreground/[0.02] transition-colors">
                                                            <p className="text-[10px] font-black uppercase text-foreground/10 mb-2 tracking-[0.2em] italic">Origin</p>
                                                            <p className="text-sm font-black uppercase italic tracking-tighter truncate">{order.sellerId?.name || 'Protocol Node'}</p>
                                                        </div>
                                                        <div className="glass p-6 rounded-3xl border-white/5 group-hover/order:bg-foreground/[0.02] transition-colors">
                                                            <p className="text-[10px] font-black uppercase text-foreground/10 mb-2 tracking-[0.2em] italic">Dest</p>
                                                            <p className="text-sm font-black uppercase italic tracking-tighter truncate">{order.shippingAddress || 'Encrypted'}</p>
                                                        </div>
                                                        <div className="glass p-6 rounded-3xl border-white/5 group-hover/order:bg-foreground/[0.02] transition-colors">
                                                            <p className="text-[10px] font-black uppercase text-foreground/10 mb-2 tracking-[0.2em] italic">TX_Date</p>
                                                            <p className="text-sm font-black uppercase italic tracking-tighter">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pt-10 border-t border-white/5">
                                                        <div>
                                                            <p className="text-[10px] font-black text-foreground/10 uppercase tracking-[0.5em] mb-3 italic">Contract Value</p>
                                                            <p className="text-5xl font-black tracking-[-0.06em] text-primary">₹{order.amount?.toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex gap-6">
                                                            <button className="flex-1 px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] glass border-white/10 hover:bg-white/5 text-foreground/30 hover:text-foreground transition-all italic">Track Telemetry</button>
                                                            <button className="flex-1 px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/20 italic">Manifest Protocol</button>
                                                        </div>
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
                        {/* Fulfillment Metrics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-card p-12 bg-foreground text-background shadow-3d relative overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] scale-150" />

                            <h3 className="text-2xl font-black mb-12 tracking-[-0.04em] uppercase italic">Acquisition Stats</h3>
                            <div className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end mb-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-background/20 italic">Success Rate</p>
                                        <p className="text-3xl font-black text-primary tracking-tighter">100%</p>
                                    </div>
                                    <div className="h-2 w-full bg-background/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-8 rounded-[2.5rem] bg-background/5 border border-white/5 group hover:border-primary/40 transition-all duration-700">
                                        <p className="text-[10px] font-black uppercase text-background/20 mb-3 tracking-[0.1em] italic">Active_TX</p>
                                        <p className="text-5xl font-black tracking-[-0.06em] group-hover:text-primary transition-colors italic">{orders.length.toString().padStart(2, '0')}</p>
                                    </div>
                                    <div className="p-8 rounded-[2.5rem] bg-background/5 border border-white/5 group hover:border-secondary/40 transition-all duration-700">
                                        <p className="text-[10px] font-black uppercase text-background/20 mb-3 tracking-[0.1em] italic">Allocated</p>
                                        <p className="text-4xl font-black tracking-[-0.06em] group-hover:text-secondary transition-colors italic">₹{(orders.reduce((acc, curr) => acc + curr.amount, 0) / 1000).toFixed(1)}K</p>
                                    </div>
                                </div>

                                <div className="p-10 rounded-[3rem] bg-primary/10 border border-primary/20 flex items-center gap-8 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-white shadow-3xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-700">
                                        <FiTrendingUp size={36} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em] mb-2 italic">Yield Index</p>
                                        <p className="text-xl font-black tracking-tight text-white/90 uppercase italic">+24.8% NET_GAIN</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Telemetry Card */}
                        <div className="premium-card p-12 text-center relative overflow-hidden group shadow-3d">
                            <div className="absolute top-[-20%] left-[-20%] w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
                            <FiActivity className="text-primary text-6xl mx-auto mb-10 animate-pulse" />
                            <h4 className="text-3xl font-black mb-6 uppercase italic tracking-tighter">Real-time Telemetry</h4>
                            <p className="text-foreground/30 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed mb-10">
                                Monitoring global cold-chain and micro-logistics status for all active procurement contracts.
                            </p>
                            <button className="w-full py-6 rounded-[2rem] glass border-white/10 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-primary hover:text-white transition-all duration-700 italic">Sync_Telemetry_Node</button>
                        </div>
                    </aside>
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

export default Orders;
