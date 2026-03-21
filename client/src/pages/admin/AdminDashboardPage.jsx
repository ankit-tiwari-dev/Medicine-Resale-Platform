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
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 border-b border-primary/20 pb-1">
          Admin Terminal
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Infrastructure Node Active
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Command <span className="text-primary">Center</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Real-time synchronization of medical assets, network participants, and logistics orchestration.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - All cards are clickable */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { to: "/admin/users", value: stats.totalUsers, label: "Identity Registry" },
          { to: "/admin/medicines-review", value: stats.activeMedicines, label: "Pharma Assets" },
          { to: "/admin/stats", value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`, label: "Capital Flow" },
          { to: "/admin/riders-kyc", value: "Pending", label: "Audit Backlog", badge: stats.verificationsPending },
          { to: "/admin/orders", value: stats.totalOrders, label: "Order Traffic" },
          { to: "/admin/withdrawals", value: stats.pendingWithdrawals, label: "Payout Queue" },
        ].map((item, i) => (
          <Link 
            key={i}
            to={item.to} 
            className="bg-card rounded-xl p-5 border border-border hover:border-primary/20 hover:shadow-sm transition-all group relative"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-lg font-bold text-foreground tracking-tight font-sans">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </div>
              {item.badge !== undefined && (
                <Badge variant="expiring" className="h-4 min-w-[1rem] flex items-center justify-center">{item.badge}</Badge>
              )}
            </div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 font-sans">
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-5 pl-3 border-l-2 border-primary/30 font-sans">Strategic Controls</h2>
            <div className="space-y-1">
              {[
                { to: "/admin/riders-kyc", title: "Rider KYC", desc: "Authorized Identity Audit", badge: stats.verificationsPending, variant: stats.verificationsPending > 0 ? "pending" : "certified" },
                { to: "/admin/medicines-review", title: "Asset Review", desc: "Pharmaceutical Verification" },
                { to: "/admin/users", title: "User Registry", desc: "Network Participant Control" },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-all group border border-transparent hover:border-border font-sans"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground text-[10px] uppercase tracking-widest group-hover:text-primary transition-colors">{action.title}</div>
                    <div className="text-[9px] text-muted-foreground font-medium truncate opacity-60">{action.desc}</div>
                  </div>
                  {action.badge !== undefined && (
                    <Badge variant={action.variant} className="h-4">{action.badge}</Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-foreground text-background rounded-xl p-6 shadow-md border border-border">
            <div className="mb-5 font-sans">
              <div className="text-[9px] opacity-60 font-bold uppercase tracking-widest mb-0.5">Grid Status</div>
              <div className="text-xl font-bold tracking-tight uppercase">Excellent</div>
            </div>
            <div className="space-y-3 text-[9px] font-bold uppercase tracking-widest font-sans opacity-80">
              <div className="flex items-center justify-between border-b border-background/5 pb-2">
                <span className="opacity-50">Uptime</span>
                <span>99.98%</span>
              </div>
              <div className="flex items-center justify-between border-b border-background/5 pb-2">
                <span className="opacity-50">AI Accuracy</span>
                <span>98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-50">Avg Response</span>
                <span>120ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart + Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Overview Chart */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Financial Intelligence</h2>
              <div className="text-[9px] font-bold text-foreground uppercase tracking-widest opacity-70">
                ₹{stats.totalRevenue.toLocaleString()} volume (12M)
              </div>
            </div>
            {(() => {
              const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const monthly = statsData?.monthlyRevenue || Array(12).fill(0);
              const maxVal = Math.max(...monthly, 1);
              return (
                <>
                  <div className="h-32 flex items-end gap-1.5">
                    {monthly.map((val, i) => {
                      const pct = Math.round((val / maxVal) * 100);
                      const minPct = val > 0 ? Math.max(pct, 4) : 0;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-primary/80 to-primary/40 rounded-sm hover:opacity-80 transition-opacity cursor-default"
                          style={{ height: `${minPct}%` }}
                          title={`${MONTHS[i]}: ₹${val.toLocaleString()}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {MONTHS.map(m => (
                      <div key={m} className="flex-1 text-center text-[8px] font-bold text-muted-foreground uppercase opacity-50">{m}</div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-5 pl-3 border-l-2 border-primary/30">Audit Synchronization</h2>
            <div className="space-y-1">
              {(logsData || []).slice(0, 5).map((log, idx) => (
                <div key={log._id || idx} className="flex items-center gap-6 p-3.5 rounded-lg hover:bg-muted/30 border border-transparent hover:border-border transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground text-[11px] uppercase tracking-wider">{log.adminId?.name || 'System Admin'}</div>
                    <div className="text-[9px] font-semibold text-primary uppercase tracking-widest mt-0.5 opacity-70">{log.action}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-foreground font-bold uppercase tracking-widest">{log.targetType}</div>
                    <div className="text-[8px] text-muted-foreground font-medium uppercase mt-0.5 opacity-60">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              {(!logsData || logsData.length === 0) && (
                <div className="p-4 text-center text-[11px] text-muted-foreground font-medium italic">
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
