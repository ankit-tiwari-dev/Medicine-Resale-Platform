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
          <div className="h-40 bg-card rounded-xl mb-8 border border-border" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-card rounded-xl border border-border" />
            <div className="h-64 bg-card rounded-xl border border-border" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 font-sans">
          <Link to="/rider" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            <span className="tracking-widest opacity-60">BACK TO</span> COMMAND
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Performance Ledger
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                Logistics <span className="text-primary">Efficacy</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
                Audit your collection performance and financial distributions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-sans">
          {metrics.map((m, i) => (
            <div key={i} className="bg-card rounded-xl p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
              <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center mb-6 font-bold text-[9px]">
                {m.type}
              </div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">{m.label}</p>
              <div className="text-2xl font-bold text-foreground mb-1 tracking-tight">{m.value}</div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Chart Placeholder */}
          <div className="lg:col-span-2 bg-card rounded-xl p-8 lg:p-10 border border-border shadow-sm font-sans">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[9px] font-bold text-foreground uppercase tracking-[0.2em] opacity-80">Distribution Cycle</h3>
              <div className="flex gap-2 font-sans">
                <span className="px-3 py-1 bg-muted rounded-lg text-[8px] font-bold text-muted-foreground uppercase">L_Wk</span>
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-[8px] font-bold shadow-lg shadow-primary/5 uppercase">T_Wk</span>
              </div>
            </div>

            {/* Simulated Bars */}
            <div className="flex items-end justify-between h-48 gap-4 px-4">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-primary/10 rounded-t-lg group-hover:bg-primary transition-all relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-card text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {h} Handovers
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-4 opacity-40">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Audit */}
          <div className="bg-foreground rounded-xl p-8 lg:p-10 text-background shadow-lg shadow-black/5 relative overflow-hidden group font-sans">
            <h3 className="text-base font-bold mb-8 font-serif uppercase tracking-tight">
              Cycle Audit
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Revenues', value: '₹12,400', color: 'text-inherit opacity-80' },
                { label: 'Deductions', value: '₹0.00', color: 'text-inherit opacity-50' },
                { label: 'Net Disbursal', value: '₹12,400', color: 'text-inherit font-bold' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 opacity-80">{row.label}</span>
                  <span className={`text-[10px] font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 h-11 bg-background border border-border rounded-xl flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-widest hover:bg-muted transition-all">
              Download Tax Ledger
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderStatsPage;
