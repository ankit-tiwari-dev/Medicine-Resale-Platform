import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
    FiUpload,
    FiCheckCircle,
    FiDollarSign,
    FiShoppingCart,
    FiArrowRight,
    FiShield,
    FiZap,
    FiUsers,
    FiActivity,
    FiGlobe,
    FiLock
} from 'react-icons/fi';

const Home = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    const stats = [
        { label: 'Medicines Saved', value: '1.2M+', icon: <FiActivity /> },
        { label: 'Verified Residents', value: '50K+', icon: <FiUsers /> },
        { label: 'Global Coverage', value: '120+', icon: <FiGlobe /> },
        { label: 'Funds Secured', value: '₹15Cr+', icon: <FiLock /> }
    ];

    return (
        <div className="relative">
            {/* Hero Section */}
            <section ref={targetRef} className="relative min-h-screen flex items-center pt-32 pb-48">
                <motion.div
                    style={{ opacity, scale, y }}
                    className="container mx-auto px-6 relative z-10"
                >
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-white/20 text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-12 shadow-2xl"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            Supreme Pharmaceutical Intelligence Ledger
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[clamp(3.5rem,10vw,9.5rem)] font-black mb-12 leading-[0.85] tracking-[-0.06em] uppercase italic"
                        >
                            Universal <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-primary animate-gradient bg-[length:200%_auto]">
                                Market Value.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="text-lg lg:text-3xl text-foreground/40 mb-20 max-w-4xl mx-auto font-bold leading-tight tracking-tight"
                        >
                            The global decentralized protocol for high-fidelity medical asset verification and redistribution.
                            Secure. AI-driven. Institutional grade.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
                        >
                            <Link to="/register" className="btn-premium py-7 px-16 text-2xl shadow-[0_30px_60px_-15px_rgba(var(--primary),0.5)]">
                                Initialize Enrollment <FiArrowRight className="group-hover:translate-x-3 transition-transform" />
                            </Link>
                            <Link to="/medicines" className="px-16 py-7 rounded-2xl font-black text-2xl glass border-white/20 hover:bg-white/10 transition-all shadow-2xl uppercase tracking-tighter">
                                Browse Assets
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Ambient Depth Elements */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0],
                            x: [0, 30, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[-10%] top-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[180px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, -10, 0],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute left-[-15%] bottom-[10%] w-[70%] h-[70%] bg-secondary/5 rounded-full blur-[200px]"
                    />
                </div>
            </section>

            {/* Supreme Metrics Grid */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="premium-card p-10 group"
                            >
                                <div className="text-5xl text-primary/10 group-hover:text-primary transition-all duration-500 mb-8 transform group-hover:scale-110 group-hover:rotate-6 origin-left">
                                    {stat.icon}
                                </div>
                                <h3 className="text-5xl font-black text-foreground mb-2 tracking-[-0.05em] uppercase">{stat.value}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 group-hover:text-primary transition-colors">/ {stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento 2.0 Process Section */}
            <section className="py-48 relative">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mb-32">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="inline-block text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-6"
                        >
                            Node Verification Protocol
                        </motion.span>
                        <h2 className="text-6xl lg:text-[7rem] font-black leading-[0.9] tracking-[-0.06em] uppercase">
                            Operational <br />
                            <span className="text-foreground/10 italic">Intelligence.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-[350px]">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="lg:col-span-8 premium-card p-0 flex flex-col md:flex-row overflow-hidden group shadow-3d"
                        >
                            <div className="md:w-1/2 h-full bg-foreground relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent z-10" />
                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] scale-150" />
                                <div className="absolute inset-0 flex items-center justify-center p-20">
                                    <FiZap size={160} className="text-white opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                                </div>
                            </div>
                            <div className="md:w-1/2 p-16 flex flex-col justify-end bg-background relative">
                                <span className="text-[8rem] font-black absolute -top-10 -right-5 text-foreground/[0.03] pointer-events-none italic">01</span>
                                <div className="relative z-10">
                                    <h4 className="text-4xl font-black mb-6 uppercase tracking-tighter">Neural Scan</h4>
                                    <p className="text-lg text-foreground/40 font-bold leading-tight">AI-driven computer vision extracting biometric and batch data with sub-millisecond precision.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="lg:col-span-4 glass-focal p-16 flex flex-col justify-between group"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white shadow-3xl shadow-primary/30 group-hover:rotate-12 transition-transform">
                                <FiShield size={36} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter">Secured Node</h4>
                                <p className="text-foreground/40 font-bold leading-tight">End-to-end encryption for every medical asset transaction across the global network.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="lg:col-span-4 premium-card p-16 flex flex-col justify-between group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/20 group-hover:text-primary transition-colors">
                                <FiGlobe size={32} />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter">Global Hub</h4>
                                <p className="text-foreground/40 font-bold leading-tight">Decentralized logistics nodes operating in 140+ countries/regions.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="lg:col-span-8 premium-card p-0 bg-primary group overflow-hidden"
                        >
                            <div className="w-full h-full p-16 flex flex-col lg:flex-row gap-12 items-center text-white relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                                <div className="lg:w-1/3 relative z-10">
                                    <div className="text-[12rem] font-black opacity-10 leading-none">99%</div>
                                </div>
                                <div className="lg:w-2/3 relative z-10">
                                    <h4 className="text-4xl font-black mb-6 uppercase tracking-tighter">Accuracy Protocol</h4>
                                    <p className="text-xl text-white/50 font-bold leading-tight">Our verification system maintains a near-perfect success rate for asset clearance and settlement.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Institutional Darkness Section */}
            <section className="py-52 bg-foreground text-background relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
                    <span className="text-[30vw] font-black tracking-[-0.1em] uppercase">INTEGRITY</span>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-32 items-center">
                        <div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-8 block"
                            >
                                Core Philosophy
                            </motion.span>
                            <h2 className="text-7xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.85] uppercase mb-16 italic">
                                Pure <br /> <span className="text-background/10">Circularity.</span>
                            </h2>
                            <div className="space-y-16">
                                {[
                                    { title: "Ethics First", desc: "Life-saving assets prioritized over fractional profits. Institutional grade transparency." },
                                    { title: "Global Radius", desc: "Eliminating medical waste by connecting verified nodes across continents." },
                                    { title: "Smart Settlement", desc: "Instant wallet credits upon asset verification. Pure efficiency." }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 20 }}
                                        className="border-l-4 border-primary/20 hover:border-primary pl-8 transition-all"
                                    >
                                        <h4 className="text-3xl font-black mb-3 uppercase tracking-tighter italic">{item.title}</h4>
                                        <p className="text-background/30 font-bold text-xl leading-snug">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary/40 animate-gradient bg-[length:200%_auto] p-0.5 shadow-3d hover:scale-[1.02] transition-transform duration-1000">
                                <div className="w-full h-full bg-foreground rounded-[3.9rem] flex flex-col items-center justify-center p-16 text-center border border-white/5">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="relative mb-16"
                                    >
                                        <div className="absolute inset-0 bg-primary blur-[60px] opacity-20" />
                                        <FiActivity size={120} className="text-primary relative z-10" />
                                    </motion.div>
                                    <h3 className="text-5xl font-black mb-8 uppercase tracking-tighter">Global Protocol</h3>
                                    <p className="text-background/30 text-xl font-bold leading-snug">The only medicinal resale platform insured for global compliance and institutional redistribution.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Supreme Final CTA */}
            <section className="py-72 relative">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-5xl mx-auto"
                    >
                        <h2 className="text-[clamp(4rem,12vw,12rem)] font-black mb-16 tracking-[-0.08em] leading-[0.75] uppercase italic">
                            Enter the <br /> <span className="text-primary italic">Future.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
                            <Link to="/register" className="btn-premium py-8 px-20 text-3xl shadow-[0_40px_80px_-20px_rgba(var(--primary),0.6)]">
                                Finalize Access
                            </Link>
                            <Link to="/about" className="text-2xl font-black hover:text-primary transition-all flex items-center gap-4 uppercase tracking-tighter group">
                                Network Whitepaper <FiArrowRight className="group-hover:translate-x-4 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
