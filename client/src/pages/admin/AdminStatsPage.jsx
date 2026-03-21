import { getAdminStats } from "../../api/adminApi";
import { useApiQuery } from "../../hooks/useApiQuery";
import { Link } from "react-router-dom";


const AdminStatsPage = () => {
  const { data, loading } = useApiQuery(getAdminStats, true);

  const metrics = [
    { label: 'Inventory Status', value: data?.totalMedicines || 0, color: 'text-soft-cyan', code: 'INV' },
    { label: 'Network Participants', value: data?.totalUsers || 0, color: 'text-primary', code: 'USR' },
    { label: 'System Revenue', value: `₹${data?.totalRevenue?.toLocaleString() || 0}`, color: 'text-emerald-green', code: 'REV' },
    { label: 'KYC Queue', value: data?.verificationsPending || 0, color: 'text-primary', code: 'KYC' }
  ];

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-32 bg-card rounded-xl mb-6" />
        <div className="h-64 bg-card rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          <span className="tracking-widest">BACK TO</span> Admin Terminal / Analytics Node
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Analytics Infrastructure
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              System <span className="text-primary">Efficacy Ledger</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Granular operational data and cross-network clinical audit trails for institutional monitoring.
            </p>
          </div>
          <div className="flex items-center self-start md:self-auto gap-3 font-sans">
            <div className="px-4 py-2 bg-muted/30 border border-border rounded-xl flex items-center gap-3">
              <div className="text-[8px] font-bold text-emerald-green uppercase tracking-widest opacity-80">ACTIVE</div>
              <div className="flex flex-col">
                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest leading-none opacity-50">Diagnostic State</span>
                <span className="text-[9px] font-bold text-emerald-green tabular-nums mt-0.5">OPTIMIZED_NODE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border shadow-sm group hover:border-primary/20 transition-all relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-[0.02] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
            <div className={`w-10 h-10 bg-muted/30 ${m.color} rounded-xl flex items-center justify-center mb-6 border border-border/50 transition-all font-bold uppercase text-sm`}>
              {m.code}
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-50">{m.label}</p>
            <div className="text-2xl font-serif font-bold text-foreground mb-3">{m.value}</div>
            <div className="inline-flex items-center gap-1.5 text-[7px] font-bold text-emerald-green bg-emerald-green/5 border border-emerald-green/10 px-2 py-0.5 rounded-md uppercase tracking-widest">
              VERIFIED
            </div>
          </div>
        ))}
      </div>

      {/* Data Dump (Prettified for Admin) */}
      <div className="bg-clinical-navy rounded-xl overflow-hidden shadow-xl border border-white/5">
        <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-soft-cyan text-[9px] font-bold uppercase tracking-widest">
            <span className="opacity-40">&gt;</span>
            <span className="text-white opacity-80">Protocol Buffer Raw Output</span>
          </div>
          <span className="text-[8px] font-bold text-emerald-green bg-emerald-green/15 px-2 py-1 rounded">HEALTHY_NODE</span>
        </div>
        <div className="p-8 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 bg-black/20">
          <pre className="text-[11px] font-mono text-soft-cyan/90 leading-relaxed">
            {JSON.stringify(data, null, 4)}
          </pre>
        </div>
      </div>
    </div>
  );
};
;

export default AdminStatsPage;
