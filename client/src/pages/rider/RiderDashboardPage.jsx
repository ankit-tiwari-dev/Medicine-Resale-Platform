import { getRiderStats, updateRiderDutyStatus } from "../../api/riderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  Truck,
  CheckCircle,
  Clock,
  ShieldCheck,
  BarChart3,
  LogOut,
  ChevronRight,
  MapPin,
  AlertCircle,
  Activity,
  DollarSign,
  Terminal,
  Power
} from "lucide-react";
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
    { label: 'Settled Earnings', value: `₹${data?.earnings || 0}`, icon: DollarSign, color: 'text- emerald-green', bg: 'bg-emerald-green/10' },
    { label: 'Active Tasks', value: data?.pendingPickups ?? 0, icon: Truck, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Integrity Rating', value: `${data?.trustScore || 98}%`, icon: ShieldCheck, color: 'text-soft-cyan', bg: 'bg-soft-cyan/10' },
    { label: 'Audit Status', value: data?.verificationStatus === 'verified' ? 'PASSED' : 'PENDING', icon: BarChart3, color: 'text-muted-amber', bg: 'bg-muted-amber/10' }
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Container className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-widest mb-6 border-b-2 border-primary/20 pb-1">
            Logistics Command
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                <Terminal size={12} />
                Certified Logistics Node: {user?.city || "BENGALURU_SOUTH"}
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Fleet <span className="text-primary">Terminal</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium max-w-xl">
                Real-time synchronization of asset retrieval, last-mile coordination, and earnings oversight.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Operational Status</div>
                <div className="flex items-center justify-end gap-2">
                  <Badge variant={data?.isActive ? "active" : "offline"}>
                    {data?.isActive ? "Active Duty" : "System Offline"}
                  </Badge>
                </div>
              </div>
              <button
                onClick={toggleStatus}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${data?.isActive
                    ? 'bg-emerald-green text-white shadow-emerald-green/20'
                    : 'bg-muted text-muted-foreground shadow-muted/20 border border-border'
                  }`}
                title={data?.isActive ? "Go Offline" : "Go Active"}
              >
                <Power size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card rounded-[1.5rem] p-6 shadow-sm border border-border hover:border-primary/20 hover:shadow-lg transition-all group scale-100 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div className="text-2xl font-black text-foreground mb-1 font-sans">{stat.value}</div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content: Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-[2rem] p-8 shadow-md border border-border">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-2 border-l-2 border-primary/30">Priority Logistics Stream</h2>
                <Link to="/rider/tasks" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Full Task Registry</Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-muted/30 rounded-2xl animate-pulse border border-border/50" />
                  ))}
                </div>
              ) : data?.pendingPickups === 0 ? (
                <div className="py-20 text-center bg-muted/5 rounded-[2rem] border-2 border-dashed border-border/50">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck size={24} className="opacity-30" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2">Registry Silent</h3>
                  <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                    No active collection signals detected in current logistics node. Status is being monitored in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Since we don't have task data in the stats call, we'd typically fetch it separately. 
                      For now, we'll show a prompt to check the registry if pickups > 0 */}
                  <div className="p-12 text-center bg-primary/5 rounded-[2rem] border border-primary/10">
                    <Activity className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-bold text-foreground mb-2 font-serif">{data?.pendingPickups} Tasks Pending</h3>
                    <p className="text-sm text-muted-foreground mb-6 font-medium">Coordinate retrieval for pending pharmacological assets.</p>
                    <Link to="/rider/tasks">
                      <Button variant="primary" className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
                        Initialize Registry Audit
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Protocol Card */}
            <div className="bg-clinical-navy rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-clinical-navy/20">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary opacity-[0.08] rounded-full blur-[100px] -mr-40 -mt-40"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif tracking-tight">Compliance Protocol</h3>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1 text-primary/80">Safety & Integrity Standard v4.1</div>
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
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">{rule.title}</div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{rule.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile & Health */}
          <div className="space-y-6">
            <div className="bg-card rounded-[2rem] p-8 shadow-md border border-border">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-primary/30 ring-4 ring-primary/10">
                  {user?.name?.charAt(0) || "R"}
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{user?.name}</h3>
                <Badge variant="certified" className="mb-8">Logistics ID: #RD-{user?._id?.slice(-6).toUpperCase()}</Badge>

                <div className="w-full space-y-3 pb-6 border-b border-border/50 mb-6">
                  <Link to="/rider/kyc/verify-docs" className="block">
                    <Button variant="outline" className="w-full h-14 rounded-xl font-black uppercase tracking-widest text-[10px] group border-2">
                      Manage Certification <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-xl font-black uppercase tracking-widest text-[10px] text-destructive border-2 hover:bg-destructive/5 hover:border-destructive/20"
                    onClick={logout}
                  >
                    Platform Exit <LogOut size={14} />
                  </Button>
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                    Platform Metadata
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">App Version</span>
                      <span className="text-xs font-bold text-foreground">v4.82-L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Uptime Rank</span>
                      <span className="text-xs font-bold text-emerald-green">Top 5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Notification */}
            <div className="bg-gradient-to-br from-muted-amber to-[#f59e0b] rounded-[2rem] p-8 text-white shadow-xl shadow-muted-amber/20 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex gap-5">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-90">Payout Synchronization</h4>
                  <p className="text-xs font-bold leading-relaxed">
                    Account settlement cycle completes Friday, 14:00. Verify bank metadata in settings.
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
