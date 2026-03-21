import { useAuth } from "../../hooks/useAuth";
import Container from "../../components/layout/Container";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { useState, useEffect } from "react";
import { getMyOrders } from "../../api/orderApi";
import { getMyMedicines } from "../../api/medicineApi";
import { getWalletBalance } from "../../api/walletApi";
import { getDashboardActivity } from "../../api/dashboardApi";
import { 
  Package, 
  ShoppingCart, 
  Wallet, 
  TrendingUp, 
  Search, 
  UploadCloud, 
  FileText, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  User,
  Clock,
  HelpCircle,
  AlertCircle
} from "lucide-react";

const DashboardHomePage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSpend: "0",
    totalMedicines: 0,
    walletBalance: "0",
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [activities, setActivities] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, medicinesRes, walletRes] = await Promise.all([
          getMyOrders().catch(() => ({ data: { data: [] } })),
          getMyMedicines().catch(() => ({ data: { data: [] } })),
          getWalletBalance().catch(() => ({ data: { data: { balance: 0 } } }))
        ]);
        
        const orders = ordersRes?.data?.data || [];
        const medicines = medicinesRes?.data?.data || [];
        const wallet = walletRes?.data?.data || { balance: 0 };
        
        const spend = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        setStats({
          totalOrders: orders.length,
          activeSpend: spend.toLocaleString('en-IN'),
          totalMedicines: medicines.length,
          walletBalance: (wallet.balance || 0).toLocaleString('en-IN')
        });
      } catch (err) {
        console.error("Failed to fetch user dashboard stats", err);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await getDashboardActivity();
        setActivities(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard activity", err);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchStats();
    fetchActivity();
  }, []);

  const quickActions = [
    { title: "Browse Catalog", description: "Search verified medicines", icon: null, link: "/browse" },
    { title: "Upload Medicine", description: "List for AI verification", icon: null, link: "/dashboard/upload-medicine" },
    { title: "Active Orders", description: "Track delivery status", icon: null, link: "/dashboard/orders" },
    { title: "Account Safety", description: "Security & KYC audit", icon: null, link: "/dashboard/profile" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60 font-sans">
              Clinical Health
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Welcome, <span className="text-primary">{user?.name || "User"}</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
              Your Clinical Command Center is active and secure.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card p-2 rounded-xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
              <User size={24} />
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-foreground uppercase tracking-tight">
                {user?.name || "Verified User"}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={10} className="text-emerald-green" />
                {user?.role || "Standard"} Account
              </p>
            </div>
          </div>
        </div>

        {/* Data Segments */}
        <div className="space-y-12 mb-12">
          {/* Procurement Module (Buyer) */}
          <div className="bg-primary/[0.02] border border-primary/10 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                <ShoppingCart size={120} className="text-primary" />
            </div>
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2 relative z-10">
              <ShoppingCart size={14} />
              Buyer Procurement Panel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {[
                { label: "Active Procurements", value: loadingStats ? "..." : stats.totalOrders, sub: "Total Protocols Initiated", color: "text-foreground", icon: ShoppingCart },
                { label: "Clinical Spend", value: loadingStats ? "..." : `₹${stats.activeSpend}`, sub: "Total Procurement Valuation", color: "text-primary", icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:border-primary/20 transition-all group font-sans relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <stat.icon size={48} />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <stat.icon size={14} className={`${stat.color} opacity-60`} />
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors opacity-70">{stat.label}</p>
                  </div>
                  <h3 className={`text-xl font-bold tracking-tight mb-1 ${loadingStats ? 'animate-pulse text-muted' : stat.color}`}>{stat.value}</h3>
                  <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest opacity-40">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resale Module (Seller) */}
          <div className="bg-emerald-green/[0.02] border border-emerald-green/10 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                <Package size={120} className="text-emerald-green" />
            </div>
            <h3 className="text-[10px] font-black text-emerald-green uppercase tracking-[0.3em] mb-6 flex items-center gap-2 relative z-10">
              <Package size={14} />
              Seller Resale Panel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {[
                { label: "Asset Inventory", value: loadingStats ? "..." : stats.totalMedicines, sub: "Verified Assets Listed", color: "text-emerald-green", icon: Package },
                { label: "Escrow Credit", value: loadingStats ? "..." : `₹${stats.walletBalance}`, sub: "Liquid Balance in Escrow", color: "text-soft-cyan", icon: Wallet }
              ].map((stat, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:border-emerald-green/20 transition-all group font-sans relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <stat.icon size={48} />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <stat.icon size={14} className={`${stat.color} opacity-60`} />
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-emerald-green transition-colors opacity-70">{stat.label}</p>
                  </div>
                  <h3 className={`text-xl font-bold tracking-tight mb-1 ${loadingStats ? 'animate-pulse text-muted' : stat.color}`}>{stat.value}</h3>
                  <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest opacity-40">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Role-Specific Quick Handover Actions */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              Operational Handover (Executive Actions)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Buyer Actions */}
              <div>
                <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4 opacity-50">Buyer Operations</h4>
                <div className="space-y-3">
                  {[
                    { label: "Procure Medicine", sub: "Clinical Catalog", path: "/browse", bg: "bg-primary/5", text: "text-primary", icon: Search },
                    { label: "Orders Signal", sub: "In-Transit Protocol", path: "/dashboard/orders", bg: "bg-emerald-green/5", text: "text-emerald-green", icon: Truck }
                  ].map((action, i) => (
                    <Link key={i} to={action.path} className={`${action.bg} p-5 rounded-xl border border-border/50 hover:border-primary/30 transition-all group flex items-center gap-4 relative overflow-hidden`}>
                      <action.icon size={18} className={`${action.text} opacity-60 group-hover:scale-110 transition-transform`} />
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${action.text}`}>{action.label}</p>
                        <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">{action.sub}</p>
                      </div>
                      <ArrowRight size={12} className={`ml-auto ${action.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Seller Actions */}
              <div>
                <h4 className="text-[9px] font-black text-emerald-green uppercase tracking-[0.2em] mb-4 opacity-50">Seller Operations</h4>
                <div className="space-y-3">
                  {[
                    { label: "Initialize Listing", sub: "Resale Protocol", path: "/dashboard/upload-medicine", bg: "bg-emerald-green/5", text: "text-emerald-green", icon: UploadCloud },
                    { label: "Ledger Audit", sub: "Financial Logs", path: "/dashboard/wallet", bg: "bg-soft-cyan/5", text: "text-soft-cyan", icon: FileText },
                  ].map((action, i) => (
                    <Link key={i} to={action.path} className={`${action.bg} p-5 rounded-xl border border-border/50 hover:border-emerald-green/30 transition-all group flex items-center gap-4 relative overflow-hidden`}>
                      <action.icon size={18} className={`${action.text} opacity-60 group-hover:scale-110 transition-transform`} />
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${action.text}`}>{action.label}</p>
                        <p className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">{action.sub}</p>
                      </div>
                      <ArrowRight size={12} className={`ml-auto ${action.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

            {/* Clinical Insights */}
          <div className="bg-foreground rounded-xl p-10 text-background shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-background/80">Protocol Insight</h3>
              <div className="space-y-6">
                <div className="p-5 bg-background/5 border border-background/10 rounded-xl">
                  <p className="text-xs font-bold uppercase tracking-tight mb-2">Active Escrow Protection</p>
                  <p className="text-[10px] opacity-60 leading-relaxed font-medium uppercase tracking-widest">Your clinical transactions are secured by multi-signature validation and 2-phase release protocols.</p>
                </div>
                <div className="p-5 bg-background/5 border border-background/10 rounded-xl">
                  <p className="text-xs font-bold uppercase tracking-tight mb-2">Compliance Status</p>
                  <p className="text-[10px] text-emerald-green leading-relaxed font-bold uppercase tracking-widest">All verified assets 100% compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main Actions Grid (Original content, now moved and modified) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-8">Execution Gateways</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Re-using the quickActions data for this section, but with updated styling */}
                {[
                  { title: "Browse Catalog", description: "Search verified medicines", icon: null, link: "/browse" },
                  { title: "Upload Medicine", description: "List for Groq verification", icon: null, link: "/dashboard/upload-medicine" },
                  { title: "Active Orders", description: "Track delivery status", icon: null, link: "/dashboard/orders" },
                  { title: "Account Safety", description: "Security & KYC audit", icon: null, link: "/dashboard/profile" },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.link}
                    className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col group hover:bg-primary hover:border-primary transition-all active:scale-[0.98]"
                  >
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary-foreground transition-colors uppercase tracking-tight mb-1">{action.title}</h3>
                    <p className="text-[10px] text-muted-foreground group-hover:text-primary-foreground/70 transition-colors uppercase font-bold tracking-widest">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden font-sans">
              <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-primary opacity-80" />
                  <h2 className="text-[9px] font-bold text-foreground uppercase tracking-[0.2em] opacity-80">
                    Recent Protocol Activity
                  </h2>
                </div>
                <button className="text-[8px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                  Full Log <ArrowRight size={10} />
                </button>
              </div>
              <div className="p-2 min-h-[300px]">
                {loadingActivity ? (
                  <div className="p-16 text-center animate-pulse flex flex-col items-center">
                    <Clock size={24} className="text-muted-foreground/30 mb-4 animate-spin" />
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Synchronizing Protocol Logs...</p>
                  </div>
                ) : activities.length > 0 ? (
                  <div className="divide-y divide-border/40">
                    {activities.map((activity, i) => (
                      <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center`}>
                            {activity.type === 'listing' ? <Package size={16} className="text-primary" /> :
                             activity.type === 'order' ? <ShoppingCart size={16} className="text-emerald-green" /> :
                             <Wallet size={16} className="text-soft-cyan" />}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{activity.title}</p>
                            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight opacity-70 mt-0.5">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1.5 justify-end mt-1">
                            <div className={`w-1 h-1 rounded-full ${
                              ['listed', 'completed', 'success'].includes(activity.status?.toLowerCase()) ? 'bg-emerald-green' : 
                              ['pending', 'processing'].includes(activity.status?.toLowerCase()) ? 'bg-amber-500' : 'bg-muted'
                            }`} />
                            <span className="text-[7px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{activity.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mb-4 border border-border/50">
                      <AlertCircle size={20} className="text-muted-foreground opacity-30" />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.1em] opacity-40 max-w-[200px] leading-relaxed">
                      No recent clinical activity detected. <br /> Your protocol log is clean.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Secondary Sidebar */}
          <div className="space-y-6">
            {/* Trusted Status Sidebar */}
            <div className="bg-primary rounded-xl p-8 text-primary-foreground relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-16 -mt-16"></div>
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <ShieldCheck size={20} className="text-white" />
                <h3 className="text-lg font-bold uppercase tracking-tight">
                  Trusted Status
                </h3>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed relative z-10 opacity-80 mb-6 font-sans">
                Your account is currently in good standing. All listed medicines undergo a mandatory 12-point Groq forensic scan.
              </p>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="w-full bg-background/20 border-background/20 hover:bg-background/20 text-background font-black h-11 rounded-xl uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                  <ShieldCheck size={14} />
                  Audit Compliance
                </Button>
              </Link>
            </div>

            {/* Support Card */}
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm font-sans flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-4 opacity-50">
                <HelpCircle size={12} className="text-muted-foreground" />
                <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Clinical Support</h3>
              </div>
              <p className="text-sm font-bold text-foreground uppercase tracking-tight mb-6 leading-tight">Need help with a verification or order?</p>
              <Button variant="outline" className="w-full h-11 text-[9px] font-bold uppercase tracking-widest rounded-xl border border-border hover:bg-muted/30 transition-all flex items-center justify-center gap-2">
                <Activity size={12} />
                Open Support Ticket
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DashboardHomePage;
