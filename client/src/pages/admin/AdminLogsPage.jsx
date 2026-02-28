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
      <div className="mb-12">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-8">
          <span className="tracking-widest">BACK TO</span> Admin Terminal / System Node
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
              LOG TRL
              Immutable Audit Trail

            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Operational <span className="text-primary">Logs</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium max-w-2xl">
              Chronological ledger of system-wide administrative interventions and core protocol shifts.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group text-[10px] font-black uppercase text-muted-foreground">

              <input
                type="text"
                placeholder="Search Action/Target..."
                className="h-14 pl-12 pr-6 rounded-2xl bg-card border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-xs font-bold uppercase tracking-widest w-72 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-card rounded-2xl animate-pulse border border-border" />)}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="Quiet operational cycle"
          message="No recent administrative actions recorded in the persistent ledger."
        />
      ) : (
        <div className="bg-card rounded-[2.5rem] border border-border shadow-md overflow-hidden">
          <div className="bg-muted/30 grid grid-cols-12 p-6 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <div className="col-span-1">Origin</div>
            <div className="col-span-4 pl-4">Institutional Action</div>
            <div className="col-span-3">Target Node</div>
            <div className="col-span-3 text-right">Synchronization Time</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div key={log._id} className="grid grid-cols-12 p-6 items-center gap-4 hover:bg-muted/10 transition-colors group">
                <div className="col-span-1">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all font-black text-[10px] uppercase">
                    SYS

                  </div>
                </div>
                <div className="col-span-4 pl-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>

                    {log.action || 'INTERVENTION'}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-muted/50 rounded-md border border-border flex items-center justify-center text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                      DB

                    </div>
                    <span className="text-xs font-bold text-foreground truncate">{log.targetType || 'SYSTEM_CORE'}</span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-foreground italic flex items-center gap-1">
                      <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-black">TIME:</span>

                      {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : '--:--'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">{log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Unknown'}</span>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button className="p-2 hover:bg-muted rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
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
