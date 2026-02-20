import { useAuth } from "../../hooks/useAuth";
import Container from "../../components/layout/Container";
import {
  Package,
  Wallet,
  PlusCircle,
  Search,
  Shield,
  ChevronRight,
  Clock,
  CheckCircle,
  ShoppingBag,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const DashboardHomePage = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Active Orders", value: "0", icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { label: "Wallet Balance", value: "₹0.00", icon: Wallet, color: "text-emerald-green", bg: "bg-emerald-green/10" },
    { label: "Verified Listings", value: "0", icon: Shield, color: "text-soft-cyan", bg: "bg-soft-cyan/10" },
  ];

  const quickActions = [
    { title: "Browse Catalog", description: "Search verified medicines", icon: Search, link: "/browse" },
    { title: "Upload Medicine", description: "List for AI verification", icon: PlusCircle, link: "/dashboard/upload-medicine" },
    { title: "Active Orders", description: "Track delivery status", icon: ShoppingBag, link: "/dashboard/orders" },
    { title: "Account Safety", description: "Security & KYC audit", icon: Shield, link: "/dashboard/profile" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <LayoutDashboard size={12} />
              Platform Overview
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Welcome, <span className="text-primary">{user?.name?.split(' ')[0] || "User"}</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Your Clinical Command Center is active and secure.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-foreground uppercase tracking-tight">
                {user?.name || "Verified User"}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                {user?.role || "Standard"} Account
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card rounded-2xl p-6 border border-border shadow-sm group hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Audit</div>
              </div>
              <div className="text-3xl font-bold text-foreground font-sans mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-6">Execution Gateways</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.link}
                    className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-start gap-5 group hover:bg-primary hover:border-primary transition-all active:scale-[0.98]"
                  >
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <action.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-white transition-colors">{action.title}</h3>
                      <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors mt-0.5">{action.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-white transition-colors self-center" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-[0.15em] flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Recent Protocol Activity
                </h2>
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tight">View Full Log</button>
              </div>
              <div className="p-12 text-center">
                <p className="text-sm text-muted-foreground font-medium italic">No recent clinical activity detected. Your log is currently clean.</p>
              </div>
            </div>
          </div>

          {/* Secondary Sidebar */}
          <div className="space-y-6">
            {/* Escrow Status Sidebar */}
            <div className="bg-primary rounded-2xl p-8 text-primary-foreground relative overflow-hidden group shadow-xl shadow-primary/10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-[60px] group-hover:opacity-10 transition-opacity"></div>
              <h3 className="text-xl font-bold mb-4 font-serif relative z-10 flex items-center gap-3">
                <CheckCircle className="text-soft-cyan" />
                Trusted Status
              </h3>
              <p className="text-xs text-primary-foreground/70 mb-6 leading-relaxed relative z-10 font-medium">
                Your account is currently in good standing. All listed medicines undergo a mandatory 12-point AI forensic scan before publication.
              </p>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-bold h-12 rounded-xl">
                  Audit Compliance
                </Button>
              </Link>
            </div>

            {/* Support Card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Clinical Support</h3>
              <p className="text-sm text-foreground font-bold mb-4">Need help with a verification or order?</p>
              <Button variant="outline" className="w-full h-11 text-xs font-bold uppercase tracking-widest">Open Support Ticket</Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DashboardHomePage;
