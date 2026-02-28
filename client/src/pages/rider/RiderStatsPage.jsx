import { getRiderStats } from "../../api/riderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";

import { Link } from "react-router-dom";

const RiderStatsPage = () => {
  const { data, loading, error } = useApiQuery(getRiderStats, true);

  const metrics = [
    { label: 'Weekly Earnings', value: '₹4,850', sub: '+12% from last cycle', type: 'WALLET' },
    { label: 'Successful Handovers', value: data?.totalCollected ?? 0, sub: '99.8% Success Rate', type: 'SUCCESS' },
    { label: 'Avg. Turnaround', value: '72m', sub: 'Industry Rank: top 5%', type: 'TIME' },
    { label: 'Trust Coefficient', value: '98/100', sub: 'Verified across 42 lots', type: 'TRUST' }
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
          <Link to="/rider" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            BACK TO COMMAND
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
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
            <div key={i} className="bg-surface rounded-[2rem] p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
              <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center mb-6 font-black text-[9px]">
                {m.type}
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{m.label}</p>
              <div className="text-3xl font-black text-foreground mb-1">{m.value}</div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
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
          <div className="bg-foreground rounded-[2.5rem] p-10 text-background shadow-2xl relative overflow-hidden group">
            <h3 className="text-xl font-black mb-8 font-serif uppercase tracking-tight">
              Cycle Audit
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Revenues', value: '₹12,400', color: 'text-inherit opacity-90' },
                { label: 'Deductions', value: '₹0.00', color: 'text-inherit opacity-60' },
                { label: 'Net Disbursal', value: '₹12,400', color: 'text-inherit font-black' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{row.label}</span>
                  <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 h-14 bg-background border border-border rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-muted transition-all">
              Download Tax Ledger
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderStatsPage;
