import { getAdminLogs } from "../../api/adminApi";
import { useApiQuery } from "../../hooks/useApiQuery";
import { Link } from "react-router-dom";

import EmptyState from "../../components/common/EmptyState";

const AdminLogsPage = () => {
  const { data, loading } = useApiQuery(getAdminLogs, true);
  const logs = data || [];

  const getActionColor = (action) => {
    if (action?.toLowerCase()?.includes('delete')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (action?.toLowerCase()?.includes('update')) return 'text-primary bg-primary/10 border-primary/20';
    if (action?.toLowerCase()?.includes('create')) return 'text-emerald-green bg-emerald-green/10 border-emerald-green/20';
    return 'text-muted-foreground bg-muted/50 border-border';
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          <span className="tracking-widest">BACK TO</span> Admin Terminal / System Node
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Immutable Audit Trail
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Operational <span className="text-primary">Logs</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Chronological ledger of system-wide administrative interventions and core protocol shifts.
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search Action/Target..."
                className="h-10 pl-4 pr-4 rounded-xl bg-card border border-border outline-none focus:border-primary/30 transition-all text-[11px] font-bold tracking-tight w-64 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="Quiet operational cycle"
          message="No recent administrative actions recorded in the persistent ledger."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-muted/30 grid grid-cols-12 p-4 border-b border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-sans">
            <div className="col-span-1">Origin</div>
            <div className="col-span-4 pl-4">Institutional Action</div>
            <div className="col-span-3">Target Node</div>
            <div className="col-span-3 text-right">Synchronization Time</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div key={log._id} className="grid grid-cols-12 p-4 items-center gap-4 hover:bg-muted/5 transition-colors group font-sans">
                <div className="col-span-1">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all font-bold text-[9px] uppercase">
                    SYS
                  </div>
                </div>
                <div className="col-span-4 pl-4">
                  <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-md border text-[8px] font-bold uppercase tracking-widest ${getActionColor(log.action)} opacity-80`}>
                    {log.action || 'INTERVENTION'}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-muted/50 rounded-md border border-border flex items-center justify-center text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
                      DB
                    </div>
                    <span className="text-[11px] font-bold text-foreground truncate opacity-70">{log.targetType || 'SYSTEM_CORE'}</span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold text-foreground flex items-center gap-1 opacity-80">
                      <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold opacity-60">TIME:</span>
                      {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase mt-0.5 opacity-40">
                      {log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button className="h-7 px-3 hover:bg-muted/50 rounded-lg text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all opacity-50">
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogsPage;
