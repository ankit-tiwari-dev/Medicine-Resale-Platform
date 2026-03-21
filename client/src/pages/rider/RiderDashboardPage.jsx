import { getRiderStats, updateRiderDutyStatus } from "../../api/riderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";

import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

const Badge = ({ children, variant, className = "" }) => {
  const variants = {
    active: "bg-emerald-green/10 text-emerald-green border-emerald-green/20",
    offline: "bg-muted-amber/10 text-muted-amber border-muted-amber/20",
    certified: "bg-primary/10 text-primary border-primary/20"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${variants[variant] || 'bg-muted text-muted-foreground'} ${className}`}>
      {children}
    </span>
  );
};

const RiderDashboardPage = () => {
  const { data, loading, query } = useApiQuery(getRiderStats, true);
  const { user, logout } = useAuth();

  const toggleStatus = async () => {
    try {
      const newStatus = !data?.isActive;
      await updateRiderDutyStatus(newStatus);
      toast.success(newStatus ? "Logistics Node: ACTIVE" : "Logistics Node: OFFLINE");
      query.execute();
    } catch (err) {
      toast.error("Failed to update operational status.");
    }
  };

  const stats = [
    { label: 'Settled Earnings', value: `₹${data?.earnings || 0}`, type: 'FINANCE' },
    { label: 'Active Tasks', value: data?.pendingPickups ?? 0, type: 'LOGISTICS' },
    { label: 'Integrity Rating', value: `${data?.trustScore || 98}%`, type: 'AUDIT' },
    { label: 'Audit Status', value: data?.verificationStatus === 'verified' ? 'PASSED' : 'PENDING', type: 'STATUS' }
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Container className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">

        {/* Header */}
        <div className="mb-10 font-sans">
          <div className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-6 border-b border-primary/10 pb-1 opacity-60">
            Logistics Command
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Certified Logistics Node: {user?.city || "BENGALURU_SOUTH"}
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight leading-tight">
                Fleet <span className="text-primary">Terminal</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-xl opacity-70">
                Real-time synchronization of asset retrieval, last-mile coordination, and earnings oversight.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Operational Status</div>
                <div className="flex items-center justify-end gap-2">
                  <Badge variant={data?.isActive ? "active" : "offline"}>
                    {data?.isActive ? "Active Duty" : "System Offline"}
                  </Badge>
                </div>
              </div>
              <button
                onClick={toggleStatus}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md ${data?.isActive
                  ? 'bg-emerald-green text-white shadow-emerald-green/10'
                  : 'bg-muted text-muted-foreground shadow-muted/5 border border-border'
                  }`}
                title={data?.isActive ? "Go Offline" : "Go Active"}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">{data?.isActive ? "OFF" : "ON"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:border-primary/20 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center font-bold text-[10px] tracking-tight">
                  {stat.type}
                </div>
              </div>
              <div className="text-xl font-bold text-foreground mb-1 font-sans tracking-tight">{stat.value}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content: Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-border font-sans">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                <h2 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-2 border-l-2 border-primary/30 opacity-60">Priority Logistics Stream</h2>
                <Link to="/rider/tasks" className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Full Task Registry</Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse border border-border/50" />
                  ))}
                </div>
              ) : data?.pendingPickups === 0 ? (
                <div className="py-16 text-center bg-muted/5 rounded-xl border border-dashed border-border/50">
                  <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-[8px] text-muted-foreground opacity-30 uppercase tracking-widest">
                    NULL
                  </div>
                  <h3 className="text-[13px] font-bold text-foreground mb-2">Registry Silent</h3>
                  <p className="text-[9px] text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed uppercase tracking-widest opacity-40">
                    No active collection signals detected in current logistics node.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-8 text-center bg-primary/5 rounded-xl border border-primary/10">
                    <h3 className="text-xl font-bold text-foreground mb-1.5 font-serif tracking-tight">{data?.pendingPickups} Tasks Pending</h3>
                    <p className="text-[11px] text-muted-foreground mb-6 font-medium font-sans opacity-70">Coordinate retrieval for pending pharmacological assets.</p>
                    <Link to="/rider/tasks">
                      <Button variant="primary" className="h-11 px-8 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg shadow-primary/5">
                        Initialize Registry Audit
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Protocol Card */}
            <div className="bg-clinical-navy rounded-xl p-8 lg:p-10 text-white relative overflow-hidden shadow-xl shadow-clinical-navy/5 font-sans">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary opacity-[0.05] rounded-full blur-[100px] -mr-40 -mt-40"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md font-bold text-[9px] text-primary">
                    SECURE
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif tracking-tight">Compliance Protocol</h3>
                    <div className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1 text-primary/80">Safety & Integrity Standard v4.1</div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { title: "Asset Integrity", desc: "Rigorous packaging audit required at collection point." },
                    { title: "Chain of Custody", desc: "Real-time telemetry sync mandatory for all movements." },
                    { title: "Biological Storage", desc: "Thermal maintenance required for thermal-sensitive assets." },
                    { title: "Handover Protocol", desc: "Zero-contact verification via cryptographic proof." }
                  ].map((rule, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-300">{rule.title}</div>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed opacity-70">{rule.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Health */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border font-sans">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-primary/10 ring-4 ring-primary/5">
                  {user?.name?.charAt(0) || "R"}
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-1.5">{user?.name}</h3>
                <Badge variant="certified" className="mb-8 text-[8px]">ID: #RD-{user?._id?.slice(-6).toUpperCase()}</Badge>

                <div className="w-full space-y-3 pb-6 border-b border-border/50 mb-6">
                  <Link to="/rider/kyc/verify-docs" className="block">
                    <Button variant="outline" className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[9px] group border border-border hover:border-primary/30">
                      Manage Certification
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[9px] text-destructive border border-border hover:bg-destructive/5 hover:border-destructive/20"
                    onClick={logout}
                  >
                    Platform Exit
                  </Button>
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4 opacity-40">
                    Platform Metadata
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-tight opacity-70">App Version</span>
                      <span className="text-[9px] font-bold text-foreground opacity-50">v4.82-L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-tight opacity-70">Uptime Rank</span>
                      <span className="text-[9px] font-bold text-emerald-green">Top 5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Notification */}
            <div className="bg-foreground rounded-xl p-8 text-background shadow-lg shadow-black/5 relative overflow-hidden group font-sans">
              <div className="relative z-10 flex gap-5">
                <div className="w-10 h-10 bg-background text-foreground rounded-xl flex items-center justify-center font-bold text-[9px]">
                  PAY
                </div>
                <div>
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1 opacity-50">Payout Sync</h4>
                  <p className="text-[11px] font-medium leading-relaxed opacity-80">
                    Cycle completes Friday, 14:00. Verify bank metadata in settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderDashboardPage;
