import React from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAdminLogs } from "../../api/adminApi";
import { useApiQuery } from "../../hooks/useApiQuery";

// Using simple inline Badge component to avoid path errors
const Badge = ({ children, variant, className = "" }) => {
  const variants = {
    pending: "bg-muted-amber/10 text-muted-amber border-muted-amber/20",
    expiring: "bg-danger/10 text-danger border-danger/20",
    certified: "bg-emerald-green/10 text-emerald-green border-emerald-green/20"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${variants[variant] || 'bg-muted text-muted-foreground'} ${className}`}>
      {children}
    </span>
  );
};

export default function AdminDashboardPage() {
  const { data: statsData } = useApiQuery(getAdminStats, true);
  const { data: logsData } = useApiQuery(getAdminLogs, true);

  const stats = {
    totalUsers: statsData?.totalUsers ?? 0,
    activeMedicines: statsData?.totalMedicines ?? 0,
    totalRevenue: statsData?.totalRevenue ?? 0,
    verificationsPending: statsData?.verificationsPending ?? 0,
    totalOrders: statsData?.totalOrders ?? 0,
    pendingWithdrawals: statsData?.pendingWithdrawals ?? 0,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-widest mb-6 border-b-2 border-primary/20 pb-1">
          Admin Terminal
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Infrastructure Node Active
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Command <span className="text-primary">Center</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Real-time synchronization of medical assets, network participants, and logistics orchestration.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - All cards are clickable */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Link to="/admin/users" className="bg-card rounded-[1.5rem] p-8 shadow-sm border border-border hover:border-foreground/30 hover:shadow-lg transition-all group overflow-hidden relative">
          <div className="text-3xl font-black text-foreground mb-2 tracking-tighter">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Identity Registry</div>
        </Link>

        <Link to="/admin/medicines-review" className="bg-card rounded-[1.5rem] p-8 shadow-sm border border-border hover:border-foreground/30 hover:shadow-lg transition-all group overflow-hidden relative">
          <div className="text-3xl font-black text-foreground mb-2 tracking-tighter">{stats.activeMedicines.toLocaleString()}</div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Pharma Assets</div>
        </Link>

        <Link to="/admin/stats" className="bg-card rounded-[1.5rem] p-8 shadow-sm border border-border hover:border-foreground/30 hover:shadow-lg transition-all group overflow-hidden relative">
          <div className="text-3xl font-black text-foreground mb-2 tracking-tighter">₹{(stats.totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Capital Flow</div>
        </Link>

        <Link to="/admin/riders-kyc" className="bg-card rounded-[1.5rem] p-8 shadow-sm border border-border hover:border-foreground/30 hover:shadow-lg transition-all group overflow-hidden relative">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-black text-foreground tracking-tighter">Pending</div>
            <Badge variant="expiring">{stats.verificationsPending}</Badge>
          </div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Audit Backlog</div>
        </Link>

        <Link to="/admin/orders" className="bg-card rounded-[1.5rem] p-8 shadow-sm border border-border hover:border-foreground/30 hover:shadow-lg transition-all group overflow-hidden relative">
          <div className="text-3xl font-black text-foreground mb-2 tracking-tighter">{stats.totalOrders.toLocaleString()}</div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Order Traffic</div>
        </Link>

        <Link to="/admin/withdrawals" className="bg-card rounded-[1.5rem] p-8 shadow-sm border border-border hover:border-foreground/30 hover:shadow-lg transition-all group overflow-hidden relative">
          <div className="text-3xl font-black text-foreground mb-2 tracking-tighter">{stats.pendingWithdrawals.toLocaleString()}</div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Payout Queue</div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-[2rem] p-8 shadow-md border border-border">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 pl-2 border-l-2 border-primary/30">Strategic Controls</h2>
            <div className="space-y-3">
              <Link
                to="/admin/riders-kyc"
                className="flex items-center gap-4 p-5 rounded-2xl hover:bg-muted transition-all group border border-transparent hover:border-border shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-black text-foreground text-[10px] uppercase tracking-widest">Rider KYC</div>
                  <div className="text-[11px] text-muted-foreground font-medium truncate">Authorized Identity Audit</div>
                </div>
                <Badge variant={stats.verificationsPending > 0 ? "pending" : "certified"}>{stats.verificationsPending}</Badge>
              </Link>

              <Link
                to="/admin/medicines-review"
                className="flex items-center gap-4 p-5 rounded-2xl hover:bg-muted transition-all group border border-transparent hover:border-border shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-black text-foreground text-[10px] uppercase tracking-widest">Asset Review</div>
                  <div className="text-[11px] text-muted-foreground font-medium truncate">Pharmaceutical Verification</div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center gap-4 p-5 rounded-2xl hover:bg-muted transition-all group border border-transparent hover:border-border shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-black text-foreground text-[10px] uppercase tracking-widest">User Registry</div>
                  <div className="text-[11px] text-muted-foreground font-medium truncate">Network Participant Control</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-foreground text-background rounded-[2rem] p-8 shadow-xl border border-border">
            <div className="mb-6">
              <div className="text-[10px] opacity-70 font-black uppercase tracking-widest mb-1">Grid Status</div>
              <div className="text-3xl font-black tracking-tighter uppercase">Excellent</div>
            </div>
            <div className="space-y-4 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center justify-between border-b border-background/10 pb-2">
                <span className="opacity-70">Uptime</span>
                <span>99.98%</span>
              </div>
              <div className="flex items-center justify-between border-b border-background/10 pb-2">
                <span className="opacity-70">AI Accuracy</span>
                <span>98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-70">Avg Response</span>
                <span>120ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart + Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Overview Chart */}
          <div className="bg-card rounded-[2rem] p-8 shadow-md border border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Financial Intelligence</h2>
              <div className="text-[10px] font-black text-foreground uppercase tracking-widest">
                ₹{stats.totalRevenue.toLocaleString()} volume (12M)
              </div>
            </div>
            {(() => {
              const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const monthly = statsData?.monthlyRevenue || Array(12).fill(0);
              const maxVal = Math.max(...monthly, 1); // avoid div-by-0
              return (
                <>
                  {/* Bar row — fixed height so height:% works */}
                  <div className="h-40 flex items-end gap-1">
                    {monthly.map((val, i) => {
                      const pct = Math.round((val / maxVal) * 100);
                      const minPct = val > 0 ? Math.max(pct, 4) : 0; // show 4% min if any revenue
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-primary to-soft-cyan/60 rounded-t hover:opacity-75 transition-opacity cursor-default"
                          style={{ height: `${minPct}%` }}
                          title={`${MONTHS[i]}: ₹${val.toLocaleString()}`}
                        />
                      );
                    })}
                  </div>
                  {/* Label row */}
                  <div className="flex gap-1 mt-2">
                    {MONTHS.map(m => (
                      <div key={m} className="flex-1 text-center text-[9px] font-bold text-muted-foreground uppercase">{m}</div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-[2rem] p-8 shadow-md border border-border">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 pl-2 border-l-2 border-primary/30 text-foreground">Audit Synchronization</h2>
            <div className="space-y-4">
              {(logsData || []).slice(0, 5).map((log, idx) => (
                <div key={log._id || idx} className="flex items-center gap-6 p-4 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-foreground text-xs uppercase tracking-widest">{log.adminId?.name || 'System Admin'}</div>
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5 opacity-80">{log.action}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-foreground font-black uppercase tracking-widest">{log.targetType}</div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">{new Date(log.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              {(!logsData || logsData.length === 0) && (
                <div className="p-4 text-center text-sm text-muted-foreground italic">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
