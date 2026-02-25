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
    { label: 'Inventory Status', value: data?.totalMedicines || 0, icon: Database, color: 'text-soft-cyan' },
    { label: 'Network Participants', value: data?.totalUsers || 0, icon: Globe, color: 'text-primary' },
    { label: 'System Revenue', value: `₹${data?.totalRevenue?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-emerald-green' },
    { label: 'KYC Queue', value: data?.verificationsPending || 0, icon: Activity, color: 'text-primary' }
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
      <div className="mb-12">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-8">
          <ChevronLeft className="w-3.5 h-3.5" />
          Admin Terminal / Analytics Node
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <BarChart3 size={12} />
              Analytics Infrastructure
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              System <span className="text-primary">Efficacy Ledger</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium max-w-2xl">
              Granular operational data and cross-network clinical audit trails for institutional monitoring.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-3 bg-muted/30 border border-border rounded-2xl flex items-center gap-3">
              <Activity size={14} className="text-emerald-green animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Diagnostic State</span>
                <span className="text-xs font-bold text-emerald-green tabular-nums">OPTIMIZED_NODE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card rounded-[2.5rem] p-10 border border-border shadow-md group hover:border-primary/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-[0.02] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
            <div className={`w-14 h-14 bg-muted/50 ${m.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 shadow-sm border border-border/50 transition-all`}>
              <m.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{m.label}</p>
            <div className="text-4xl font-serif font-black text-foreground mb-3">{m.value}</div>
            <div className="inline-flex items-center gap-2 text-[9px] font-black text-emerald-green bg-emerald-green/10 px-2 py-1 rounded-lg uppercase tracking-widest">
              <ArrowUpRight size={10} />
              Audit Verified
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
