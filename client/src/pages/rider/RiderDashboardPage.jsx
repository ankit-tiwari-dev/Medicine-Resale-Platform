import { getRiderStats } from "../../api/riderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  Truck,
  CheckCircle,
  Clock,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronRight,
  MapPin,
  AlertCircle
} from "lucide-react";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RiderDashboardPage = () => {
  const { data, loading, error } = useApiQuery(getRiderStats, true);
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Total Handovers', value: data?.totalCollected ?? 0, icon: CheckCircle, color: 'text-emerald-green', bg: 'bg-emerald-green/10' },
    { label: 'Active Task Batches', value: data?.pendingPickups ?? 0, icon: Truck, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Fleet Rating', value: '4.9', icon: BarChart3, color: 'text-soft-cyan', bg: 'bg-soft-cyan/10' },
    { label: 'Compliance Level', value: 'Gold', icon: ShieldCheck, color: 'text-muted-amber', bg: 'bg-muted-amber/10' }
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <MapPin size={12} />
              Logistics Node: Bengaluru_South
            </div>
            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-foreground">
              Fleet <span className="text-primary">Command</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Authenticated logistics portal for certified medical distribution partners.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card rounded-[1.5rem] p-6 border border-border shadow-sm group hover:border-primary/20 transition-all">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-foreground font-sans">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Active Tasks Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                  <Truck size={18} className="text-primary" />
                  Priority Logistics
                </h2>
                <Link to="/rider/tasks" className="text-[10px] font-bold text-primary uppercase hover:underline">View All Task Bundles</Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}
                </div>
              ) : data?.pendingPickups === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                    <Truck size={24} />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium italic">No active collection signals detected in vicinity.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="group p-5 bg-muted/20 border border-border rounded-2xl hover:bg-muted/40 transition-colors flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-card rounded-xl border border-border flex items-center justify-center text-primary shadow-sm">
                          <Package size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm">Medical Unit Retrieval</h4>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Assigned Lot: #LOT-B41</p>
                        </div>
                      </div>
                      <Button variant="primary" size="sm" className="h-10 px-4 rounded-xl font-bold">
                        Initialize
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-clinical-navy rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-clinical-navy/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-green opacity-[0.05] rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <h3 className="text-lg font-bold mb-6 font-serif flex items-center gap-3">
                <ShieldCheck className="text-emerald-green" size={24} />
                Compliance Protocol v2.4
              </h3>
              <ul className="space-y-3">
                {[
                  "Packaging integrity audit mandatory at collection.",
                  "Cold-chain maintenance required for insulin/vaccines.",
                  "Real-time GPS sync must remain active.",
                  "Zero-contact handover authorized for residential drops."
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3 text-xs text-slate-400 font-medium">
                    <div className="w-1 h-1 rounded-full bg-emerald-green mt-1.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Rider Profile/KYC */}
          <div className="space-y-6">
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-primary/20">
                  {user?.name?.charAt(0) || "R"}
                </div>
                <h3 className="text-xl font-bold text-foreground font-serif mb-1">{user?.name || "Premium Rider"}</h3>
                <div className="px-3 py-1 bg-emerald-green/10 border border-emerald-green/20 rounded-lg text-[10px] font-bold text-emerald-green uppercase tracking-[0.2em] mb-6">
                  Certified Logistics Partner
                </div>
                <div className="w-full space-y-3">
                  <Link to="/rider/kyc/verify-docs" className="block">
                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold flex items-center justify-between px-6 border-2">
                      Manage Certification <ChevronRight size={14} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl font-bold flex items-center justify-between px-6 border-2 text-destructive hover:bg-destructive/5 hover:border-destructive/20"
                    onClick={logout}
                  >
                    Logistics Exit <LogOut size={14} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-muted-amber rounded-[2rem] p-8 text-amber-950 shadow-lg shadow-muted-amber/10 flex gap-4">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Weekly Payout Signal</h4>
                <p className="text-xs font-medium opacity-80 leading-relaxed">
                  Your earnings for current cycle will be distributed on Friday, 14:00 IST.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

// Internal icon for specific task list if needed, or use existing Lucide ones
const Package = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

export default RiderDashboardPage;
