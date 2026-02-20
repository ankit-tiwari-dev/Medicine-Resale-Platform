import { getRiderStats } from "../../api/riderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  BarChart3,
  ChevronLeft,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Wallet,
  ArrowUpRight,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";

const RiderStatsPage = () => {
  const { data, loading, error } = useApiQuery(getRiderStats, true);

  const metrics = [
    { label: 'Weekly Earnings', value: '₹4,850', sub: '+12% from last cycle', icon: Wallet, color: 'text-emerald-green' },
    { label: 'Successful Handovers', value: data?.totalCollected ?? 0, sub: '99.8% Success Rate', icon: CheckCircle, color: 'text-primary' },
    { label: 'Avg. Turnaround', value: '72m', sub: 'Industry Rank: top 5%', icon: Clock, color: 'text-soft-cyan' },
    { label: 'Trust Coefficient', value: '98/100', sub: 'Verified across 42 lots', icon: Award, color: 'text-muted-amber' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 animate-pulse">
        <Container className="py-12">
          <div className="h-40 bg-card rounded-[2.5rem] mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-card rounded-[2rem]" />
            <div className="h-64 bg-card rounded-[2rem]" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link to="/rider" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Command
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                <BarChart3 size={12} />
                Performance Ledger
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Logistics <span className="text-primary">Efficacy</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Audit your collection performance and financial distributions.
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
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1">
                <TrendingUp size={10} className="text-emerald-green" />
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Chart Placeholder */}
          <div className="lg:col-span-2 bg-card rounded-[2.5rem] p-10 border border-border shadow-md">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em]">Distribution Cycle</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-muted rounded-lg text-[10px] font-bold text-muted-foreground">L_Wk</span>
                <span className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-bold shadow-lg shadow-primary/10">T_Wk</span>
              </div>
            </div>

            {/* Simulated Bars */}
            <div className="flex items-end justify-between h-48 gap-4 px-4">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-primary/10 rounded-t-xl group-hover:bg-primary transition-all relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-card text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {h} Handovers
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Audit */}
          <div className="bg-clinical-navy rounded-[2.5rem] p-10 text-white shadow-xl shadow-clinical-navy/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-soft-cyan opacity-[0.05] rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <h3 className="text-xl font-bold mb-8 font-serif flex items-center gap-3">
              <Search className="text-soft-cyan" size={24} />
              Cycle Audit
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Revenues', value: '₹12,400', color: 'text-white' },
                { label: 'Deductions', value: '₹0.00', color: 'text-emerald-green' },
                { label: 'Net Disbursal', value: '₹12,400', color: 'text-soft-cyan font-black' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{row.label}</span>
                  <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
              Download Tax Ledger <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderStatsPage;
