import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    FiArrowUpRight,
    FiArrowDownLeft,
    FiClock,
    FiShield,
    FiActivity,
    FiCreditCard,
    FiArrowRight,
    FiZap,
    FiTrendingUp
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const Wallet = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(user?.walletBalance || 0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWalletData();
        const interval = setInterval(fetchWalletData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchWalletData = async () => {
        try {
            const [balanceRes, transRes] = await Promise.all([
                api.get('/wallet/balance'),
                api.get('/wallet/transactions')
            ]);
            setBalance(balanceRes.data.data.balance);
            setTransactions(transRes.data.data);
        } catch (error) {
            console.error('Wallet fetch error:', error);
            toast.error('Failed to fetch protocol ledger');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amount = prompt("Enter capital amount for extraction:");
        if (!amount || isNaN(amount) || amount <= 0) return;

        try {
            await api.post('/wallet/withdraw', {
                amount: Number(amount),
                bankDetails: "Integrated Settlement Account"
            });
            toast.success('Capital extraction initiated! 🏦');
            fetchWalletData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Extraction failed');
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
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl"
                        >
                            <FiActivity className="animate-spin-slow" /> Liquidity Pulse Live
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl lg:text-[7rem] font-black text-foreground tracking-[-0.06em] leading-[0.85] uppercase italic"
                        >
                            Liquid <br />
                            <span className="text-foreground/10">Capital.</span>
                        </motion.h1>
                    </div>

                    <div className="flex bg-foreground/5 p-2 rounded-[2.5rem] glass border-white/5 backdrop-blur-3xl shadow-3d">
                        <div className="px-10 py-6 flex flex-col items-center">
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">Network Rank</span>
                            <span className="text-2xl font-black italic text-primary uppercase">Institutional</span>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10 mb-20">
                    {/* Main Balance Terminal */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8 premium-card p-16 bg-foreground text-background shadow-3d relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-[70%] h-full bg-gradient-to-l from-primary/10 to-transparent skew-x-12 translate-x-32 group-hover:translate-x-12 transition-transform duration-1000" />
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] scale-150" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-background/30 mb-8 italic">Available Systematic Liquidity</p>
                                <h2 className="text-[clamp(4rem,10vw,10rem)] font-black mb-20 tracking-[-0.08em] leading-none uppercase italic">₹{balance?.toLocaleString()}</h2>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8">
                                <button
                                    onClick={handleWithdraw}
                                    className="flex-1 btn-premium py-8 !text-2xl italic tracking-tighter shadow-3d group/btn"
                                >
                                    Extract Capital <FiArrowUpRight className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform" />
                                </button>
                                <button className="flex-1 px-12 py-8 rounded-[2.5rem] font-black text-2xl glass border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-4 italic tracking-tighter uppercase">
                                    Inject Funds <FiArrowDownLeft />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Integrated Protection Node */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-4 premium-card p-12 flex flex-col justify-between group shadow-3d relative overflow-hidden"
                    >
                        <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />
                        <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                            <FiShield size={48} />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-emerald-500/10 shadow-lg">
                                <FiZap className="animate-pulse" /> Active Protection
                            </div>
                            <h3 className="text-4xl font-black mb-6 tracking-[-0.04em] uppercase italic leading-none">Insured Hub</h3>
                            <p className="text-foreground/30 font-bold text-lg leading-snug">
                                All capital assets are protected by our global pharmaceutical redistribution indemnity protocol.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Secure Transaction Matrix */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="premium-card p-16 shadow-3d"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-20 px-4">
                        <div>
                            <h3 className="text-5xl font-black tracking-[-0.04em] uppercase italic">
                                Ledger <br />
                                <span className="text-foreground/10">Synchronized.</span>
                            </h3>
                            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] mt-4">TX_HASH_MONITOR: ACTIVE</p>
                        </div>
                        <div className="flex items-center gap-6 p-6 rounded-[2.5rem] glass border-white/10">
                            <FiTrendingUp className="text-primary" size={32} />
                            <div className="text-right">
                                <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-1">Growth Index</p>
                                <p className="text-2xl font-black tracking-tighter italic">+12.4%</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {loading ? (
                            <div className="py-24 text-center font-black uppercase tracking-[0.8em] text-foreground/5 animate-pulse">Syncing Cryptographic Hash...</div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-48 glass rounded-[4rem] border-dashed border-white/5">
                                <FiClock size={100} className="mx-auto mb-10 text-foreground/5" />
                                <h3 className="text-3xl font-black text-foreground/5 uppercase tracking-[0.5em]">Null Transaction History</h3>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {transactions.map((tx, idx) => (
                                    <motion.div
                                        key={tx._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.01, x: 10 }}
                                        className="flex items-center justify-between p-10 group glass border-white/5 hover:border-primary/20 transition-all rounded-[3rem] shadow-xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex gap-12 items-center relative z-10">
                                            <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center shadow-3xl transition-all duration-700 ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'}`}>
                                                {tx.type === 'credit' ? <FiArrowDownLeft size={36} /> : <FiArrowUpRight size={36} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h4 className="font-black text-3xl tracking-tighter uppercase italic group-hover:text-primary transition-colors">{tx.description || tx.type}</h4>
                                                    <span className="text-[8px] font-black uppercase px-3 py-1 rounded-lg bg-foreground/5 text-foreground/20 tracking-[0.3em]">#{tx._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                                <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">{new Date(tx.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
                                            </div>
                                        </div>
                                        <div className="text-right relative z-10">
                                            <p className={`text-5xl font-black tracking-[-0.06em] mb-4 italic ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount?.toLocaleString()}
                                            </p>
                                            <span className={`text-[10px] font-black uppercase px-6 py-2 rounded-xl italic tracking-[0.3em] ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{tx.status}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-24 py-12 rounded-[4rem] text-[10px] font-black uppercase tracking-[1em] text-foreground/10 hover:text-primary hover:bg-primary/5 transition-all duration-700 border-2 border-dashed border-white/5 flex items-center justify-center gap-6 group">
                        <FiActivity className="group-hover:animate-spin" /> Download Protocol Statement Ledger <FiArrowRight className="group-hover:translate-x-6 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Supreme Ambient Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 h-screen w-screen overflow-hidden">
                <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[200px]" />
                <div className="absolute bottom-[20%] right-[-15%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[220px]" />
            </div>
        </div>
    );
};

export default Wallet;
