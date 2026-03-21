import { approveWithdrawal, getAdminWithdrawals, rejectWithdrawal } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
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
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          <span className="tracking-widest">BACK TO</span> Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Capital Disbursement
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Withdrawal <span className="text-primary">Authorization</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Reviewing payout requests and managing escrow capital flows.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 px-6 rounded-xl border border-border font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-muted/30 transition-all font-sans"
            onClick={() => query.execute()}
            loading={query.loading}
          >
            Refresh Ledger
          </Button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending Authorizations', value: items.filter(i => i.status === 'pending').length },
          { label: 'Net Pending Value', value: `₹${items.filter(i => i.status === 'pending').reduce((a, b) => a + (b.amount || 0), 0).toLocaleString('en-IN')}` },
          { label: 'Completed Today', value: items.filter(i => i.status !== 'pending').length }
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col justify-center group hover:border-primary/20 transition-all font-sans">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 opacity-50">{s.label}</p>
            <p className="text-xl font-bold text-foreground tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {query.loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-xl border border-border shadow-sm">
          <h3 className="text-xl font-bold text-foreground font-serif mb-2">Capital Queue Clear</h3>
          <p className="text-xs text-muted-foreground font-medium italic">No active payout requests require authorization.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col md:flex-row md:items-center gap-6 transition-all hover:border-primary/10 font-sans">
              <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-inner">
                {item?.userId?.name?.charAt(0) || "M"}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] font-mono opacity-40">
                    TXN_ID_{item._id?.slice(-8).toUpperCase()}
                  </span>
                  <div className={`px-2 py-0.5 rounded-md border text-[7px] font-bold uppercase tracking-widest ${getStatusStyle(item.status)} opacity-80`}>
                    FUNDS_{item.status || 'PENDING'}
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground tracking-tight">
                  ₹{Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex flex-wrap gap-4 text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                  {item.requestedAt && <span>Requested: {new Date(item.requestedAt).toLocaleDateString()}</span>}
                  <span className="italic">Kyc_Verified Settlement</span>
                </div>
              </div>
              {item.status === 'pending' && (
                <div className="flex items-center gap-3 md:flex-shrink-0">
                  <Button
                    variant="outline"
                    className="h-8 px-4 text-emerald-green hover:bg-emerald-green/10 border-emerald-green/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                    onClick={() => handleApprove(item._id)}
                  >
                    Authorize
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 px-4 text-red-500 hover:bg-red-500/10 border-red-500/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                    onClick={() => handleReject(item._id)}
                  >
                    Suspend
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Policy Footer */}
      <div className="mt-8 bg-foreground rounded-xl p-8 text-background shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
          <h4 className="text-[9px] font-bold opacity-60 uppercase tracking-widest mb-1.5">Settlement Protocol</h4>
          <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Capital Disbursement Controls</h3>
          <p className="text-sm opacity-80 font-medium leading-relaxed italic max-w-2xl">
            All withdrawal authorizations are immutable and final. Reversal is not supported post-confirmation. Funds are released via cleared banking channels within 1-3 standard working days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawalsPage;
