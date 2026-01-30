import { Link } from 'react-router-dom';
import {
    FiGithub,
    FiTwitter,
    FiLinkedin,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCpu,
    FiActivity
} from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-foreground text-background pt-32 pb-16 relative overflow-hidden border-t border-background/10">
            {/* Supreme Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] scale-150 pointer-events-none" />

            <div className="container mx-auto px-8 relative z-10 max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Entity Section */}
                    <div className="lg:col-span-4 space-y-12">
                        <Link to="/" className="group flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl group-hover:rotate-[30deg] transition-all duration-700">
                                <FiCpu size={24} />
                            </div>
                            <span className="text-4xl font-black tracking-[-0.06em] leading-none uppercase italic text-background">
                                MediRes <br />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] block mt-1 text-background/20 italic">Global_Node</span>
                            </span>
                        </Link>
                        <p className="text-background/40 font-black text-lg uppercase italic leading-tight tracking-tighter max-w-sm">
                            THE WORLD'S MOST ADVANCED PROTOCOL FOR SYSTEMATIC MEDICINE REDISTRIBUTION AND REDEMPTION.
                        </p>
                        <div className="flex gap-6">
                            {[FiGithub, FiTwitter, FiLinkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-14 h-14 rounded-2xl bg-background/5 border border-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-3d group">
                                    <Icon size={24} className="group-hover:scale-110" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Operational Links */}
                    <div className="lg:col-span-2 space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">/ PLATFORM</h4>
                        <ul className="space-y-6">
                            {['Browse_Nodes', 'Protocol_Flow', 'Liquidity_Center', 'Rider_Units'].map((link, idx) => (
                                <li key={idx}>
                                    <Link to="#" className="text-background/30 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] italic">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Infrastructure */}
                    <div className="lg:col-span-2 space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic">/ RESOURCES</h4>
                        <ul className="space-y-6">
                            {['Safety_Matrix', 'System_FAQ', 'Privacy_Vault', 'Terms_of_Init'].map((link, idx) => (
                                <li key={idx}>
                                    <Link to="#" className="text-background/30 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] italic">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Telemetry Contact */}
                    <div className="lg:col-span-4 space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 italic">/ TELEMETRY</h4>
                        <ul className="space-y-8 text-background/40 font-black text-xs uppercase tracking-widest italic leading-relaxed">
                            <li className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-background/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><FiMail size={18} /></div>
                                SUPPORT@MEDIRES_NODE.IO
                            </li>
                            <li className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-background/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><FiPhone size={18} /></div>
                                +00 [234] 567-PROTO
                            </li>
                            <li className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-background/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><FiMapPin size={18} /></div>
                                SECTOR_62, HUB_CORE_G
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Secure Footer Base */}
                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-background/20 text-[10px] font-black uppercase tracking-[0.4em] italic">
                            © 2026 MEDIRES_SYSTEM_ARCH. ALL NODES SECURED.
                        </p>
                    </div>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-background/10">
                        <a href="#" className="hover:text-primary transition-colors">STATUS: ACTIVE</a>
                        <a href="#" className="hover:text-primary transition-colors">API: V4_SUPREME</a>
                        <a href="#" className="hover:text-primary transition-colors">SEC: LEVEL_05</a>
                    </div>
                </div>
            </div>

            {/* Ambient Pulse Decoration */}
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
        </footer>
    );
};

export default Footer;
