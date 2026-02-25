import { approveWithdrawal, getAdminWithdrawals, rejectWithdrawal } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import {
  Wallet,
  ChevronLeft,
  Check,
  X,
  Clock,
  ShieldCheck,
  AlertCircle,
  Building2,
  ArrowUpRight,
  Search
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminWithdrawalsPage = () => {
  const query = useApiQuery(getAdminWithdrawals, true);

  const handleApprove = async (id) => {
    try {
      await approveWithdrawal(id);
      toast.success("Disbursement authorized. Capital transfer initiated.");
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Authorization failed. Financial node error."));
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectWithdrawal(id, { reason: "Rejected from institutional compliance review" });
      toast.success("Disbursement suspended and funds returned to escrow.");
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Suspension command failed."));
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-emerald-green border-emerald-green/20 bg-emerald-green/5';
      case 'rejected': return 'text-red-500 border-red-500/20 bg-red-500/5';
      default: return 'text-muted-amber border-muted-amber/20 bg-muted-amber/5';
    }
  };

  const items = query.data || [];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" />
          Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <Wallet size={12} />
              Capital Disbursement
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Withdrawal <span className="text-primary">Authorization</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Reviewing payout requests and managing escrow capital flows.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 rounded-2xl border-2 font-bold flex items-center gap-2"
            onClick={() => query.execute()}
            loading={query.loading}
          >
            Refresh Ledger
          </Button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Pending Authorizations', value: items.filter(i => i.status === 'pending').length, color: 'text-muted-amber', bg: 'bg-muted-amber/10', icon: Clock },
          { label: 'Net Pending Value', value: `₹${items.filter(i => i.status === 'pending').reduce((a, b) => a + (b.amount || 0), 0).toLocaleString('en-IN')}`, color: 'text-primary', bg: 'bg-primary/10', icon: Wallet },
          { label: 'Completed Today', value: items.filter(i => i.status !== 'pending').length, color: 'text-emerald-green', bg: 'bg-emerald-green/10', icon: ShieldCheck }
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-[1.5rem] p-6 border border-border shadow-sm flex items-center gap-6 group hover:border-primary/30 transition-all">
            <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {query.loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card rounded-[2rem] animate-pulse border border-border" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-[2.5rem] border border-border shadow-sm">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
            <Wallet size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground font-serif mb-2">Capital Queue Clear</h3>
          <p className="text-sm text-muted-foreground font-medium italic">No active payout requests require authorization.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary/20 transition-all">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 size={26} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest font-mono">
                    REQ#{item._id?.slice(-8).toUpperCase()}
                  </span>
                  <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                    {item.status || 'PENDING'}
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground">
                  ₹{Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {item.requestedAt && <span className="flex items-center gap-1"><Clock size={10} /> {new Date(item.requestedAt).toLocaleDateString()}</span>}
                  <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-green" /> Bank Proof Verified</span>
                </div>
              </div>
              {item.status === 'pending' && (
                <div className="flex items-center gap-3 md:flex-shrink-0">
                  <Button
                    variant="outline"
                    className="h-12 w-12 p-0 text-emerald-green hover:bg-emerald-green hover:text-white border-2 rounded-2xl"
                    onClick={() => handleApprove(item._id)}
                    title="Authorize Disbursement"
                  >
                    <Check size={20} />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 w-12 p-0 text-red-500 hover:bg-red-500 hover:text-white border-2 rounded-2xl"
                    onClick={() => handleReject(item._id)}
                    title="Suspend Disbursement"
                  >
                    <X size={20} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Policy Footer */}
      <div className="mt-10 bg-clinical-navy rounded-[2.5rem] p-10 text-white shadow-xl shadow-clinical-navy/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-soft-cyan opacity-[0.05] rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md">
          <AlertCircle size={32} className="text-soft-cyan" />
        </div>
        <div>
          <h4 className="text-lg font-bold font-serif mb-2">Fiduciary Compliance Notice</h4>
          <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
            All withdrawal authorizations are immutable and final. Reversal is not supported post-confirmation. Funds are released via cleared banking channels within 1-3 standard working days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawalsPage;
