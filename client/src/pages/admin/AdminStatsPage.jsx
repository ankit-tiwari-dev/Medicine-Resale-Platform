import { getAdminStats } from "../../api/adminApi";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  BarChart3,
  ChevronLeft,
  TrendingUp,
  Activity,
  Database,
  Terminal,
  ArrowUpRight,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminStatsPage = () => {
  const { data, loading } = useApiQuery(getAdminStats, true);

  const metrics = [
    { label: 'Institutional Growth', value: '+14.2%', icon: TrendingUp, color: 'text-emerald-green' },
    { label: 'Verification Velocity', value: '4.2h', icon: Activity, color: 'text-primary' },
    { label: 'Escrow Liquidity', value: '₹2.4M', icon: Database, color: 'text-soft-cyan' },
    { label: 'Network Uptime', value: '99.98%', icon: Globe, color: 'text-primary' }
  ];

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-40 bg-card rounded-[2.5rem] mb-8" />
        <div className="h-96 bg-card rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" />
          Admin Terminal
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <BarChart3 size={12} />
              Analytics Infrastructure
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              System <span className="text-primary">Efficacy Ledger</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Granular operational data and cross-network clinical audit trails.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card rounded-[2rem] p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
            <div className={`w-12 h-12 bg-muted/50 ${m.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <m.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{m.label}</p>
            <div className="text-3xl font-black text-foreground mb-1">{m.value}</div>
            <div className="text-[10px] font-bold text-emerald-green uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight size={10} />
              AUDITED_OK
            </div>
          </div>
        ))}
      </div>

      {/* Data Dump (Prettified for Admin) */}
      <div className="bg-clinical-navy rounded-[2.5rem] overflow-hidden shadow-2xl shadow-clinical-navy/20">
        <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-soft-cyan" />
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Protocol Buffer Raw Output</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-green bg-emerald-green/10 px-2 py-1 rounded">HEALTHY_NODE</span>
        </div>
        <div className="p-8 lg:p-12 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
          <pre className="text-xs font-mono text-soft-cyan leading-relaxed">
            {JSON.stringify(data, null, 4)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;
