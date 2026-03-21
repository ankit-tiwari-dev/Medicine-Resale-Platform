import { useState } from "react";
import { getAdminLogs } from "../../api/adminApi";
import { useApiQuery } from "../../hooks/useApiQuery";
import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import { Search } from "lucide-react";

const AdminLogsPage = () => {
  const { data, loading } = useApiQuery(getAdminLogs, true);
  const [search, setSearch] = useState("");

  const logs = (data || []).filter(log => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(q) ||
      log.targetType?.toLowerCase().includes(q)
    );
  });

  const getActionColor = (action) => {
    if (action?.toLowerCase()?.includes('delete')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (action?.toLowerCase()?.includes('update')) return 'text-primary bg-primary/10 border-primary/20';
    if (action?.toLowerCase()?.includes('create') || action?.toLowerCase()?.includes('approve')) return 'text-emerald-green bg-emerald-green/10 border-emerald-green/20';
    return 'text-muted-foreground bg-muted/50 border-border';
  };

  const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
  const formatDate = (ts) => ts ? new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '---';

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          Back to Admin Terminal / System Node
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Immutable Audit Trail
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Operational <span className="text-primary">Logs</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Chronological ledger of system-wide administrative interventions and core protocol shifts.
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans flex-shrink-0">
            <div className="relative w-full sm:w-64">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" />
              <input
                type="text"
                placeholder="Search action/target..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10 pl-9 pr-4 rounded-xl bg-card border border-border outline-none focus:border-primary/30 transition-all text-[11px] font-bold tracking-tight w-full shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="Quiet operational cycle"
          message="No recent administrative actions recorded in the persistent ledger."
        />
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Desktop table header — hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-12 p-4 border-b border-border bg-muted/30 text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-sans">
            <div className="col-span-1">Origin</div>
            <div className="col-span-4 pl-4">Action</div>
            <div className="col-span-3">Target</div>
            <div className="col-span-3 text-right">Time</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div key={log._id} className="group font-sans hover:bg-muted/5 transition-colors">
                {/* ── Mobile card view ── */}
                <div className="flex md:hidden items-start gap-3 px-4 py-4">
                  <div className="w-8 h-8 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all font-bold text-[8px] uppercase">
                    SYS
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-bold uppercase tracking-widest mb-1.5 max-w-full truncate ${getActionColor(log.action)} opacity-90`}>
                      {log.action || 'INTERVENTION'}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold text-foreground/70 uppercase tracking-wide">
                        {log.targetType || 'SYSTEM_CORE'}
                      </span>
                      <span className="text-[8px] text-muted-foreground opacity-50">·</span>
                      <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                        {formatTime(log.createdAt)} · {formatDate(log.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Desktop row view ── */}
                <div className="hidden md:grid md:grid-cols-12 p-4 items-center gap-4">
                  <div className="col-span-1">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all font-bold text-[9px] uppercase">
                      SYS
                    </div>
                  </div>
                  <div className="col-span-4 pl-4">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-bold uppercase tracking-widest max-w-full truncate ${getActionColor(log.action)} opacity-80`}>
                      {log.action || 'INTERVENTION'}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted/50 rounded-md border border-border flex items-center justify-center text-[7px] font-bold uppercase tracking-widest text-muted-foreground flex-shrink-0">
                        DB
                      </div>
                      <span className="text-[11px] font-bold text-foreground opacity-70 truncate">
                        {log.targetType || 'SYSTEM_CORE'}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold text-foreground opacity-80">
                        {formatTime(log.createdAt)}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-bold uppercase opacity-40 mt-0.5">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className="h-7 px-3 hover:bg-muted/50 rounded-lg text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all opacity-50">
                      VIEW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 bg-muted/30 border-t border-border flex justify-between items-center gap-4">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 font-mono">
              Ledger_Entries: {logs.length}
            </div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
              Immutable · Read-Only
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogsPage;
