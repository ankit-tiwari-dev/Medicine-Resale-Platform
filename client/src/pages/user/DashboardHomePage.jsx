import { useAuth } from "../../hooks/useAuth";
import Container from "../../components/layout/Container";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

const DashboardHomePage = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Active Orders", value: "0" },
    { label: "Wallet Balance", value: "₹0.00" },
    { label: "Verified Listings", value: "0" },
  ];

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
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
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
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-lg">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="pr-4">
              <p className="text-xs font-black text-foreground uppercase tracking-tight">
                {user?.name || "Verified User"}
              </p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                {user?.role || "Standard"} Account
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card rounded-[1.5rem] p-8 border border-border shadow-sm flex flex-col justify-center group hover:border-foreground/30 transition-all">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8">Execution Gateways</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.link}
                    className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm flex flex-col group hover:bg-foreground hover:border-foreground transition-all active:scale-[0.98]"
                  >
                    <h3 className="text-xl font-black text-foreground group-hover:text-background transition-colors uppercase tracking-tight mb-2 tracking-tighter">{action.title}</h3>
                    <p className="text-xs text-muted-foreground group-hover:text-background/70 transition-colors uppercase font-bold tracking-widest">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-border bg-muted/20 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
                  Recent Protocol Activity
                </h2>
                <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View Full Log</button>
              </div>
              <div className="p-16 text-center">
                <p className="text-sm text-muted-foreground font-medium italic opacity-60">No recent clinical activity detected. Your log is currently clean.</p>
              </div>
            </div>
          </div>

          {/* Secondary Sidebar */}
          <div className="space-y-6">
            {/* Trusted Status Sidebar */}
            <div className="bg-foreground rounded-[2.5rem] p-10 text-background relative overflow-hidden group shadow-2xl border border-border">
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter relative z-10">
                Trusted Status
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed relative z-10 opacity-70 mb-8">
                Your account is currently in good standing. All listed medicines undergo a mandatory 12-point AI forensic scan before publication.
              </p>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="w-full bg-background/10 border-background/20 hover:bg-background/20 text-background font-black h-14 rounded-2xl uppercase tracking-widest text-[10px]">
                  Audit Compliance
                </Button>
              </Link>
            </div>

            {/* Support Card */}
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Clinical Support</h3>
              <p className="text-md font-black text-foreground uppercase tracking-tight mb-6">Need help with a verification or order?</p>
              <Button variant="outline" className="w-full h-14 text-[10px] font-black uppercase tracking-widest rounded-2xl border-2">Open Support Ticket</Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DashboardHomePage;
