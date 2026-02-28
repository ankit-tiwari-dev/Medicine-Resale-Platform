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
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-8">
          <span className="tracking-widest">BACK TO</span> Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
              FINANCE

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
          { label: 'Pending Authorizations', value: items.filter(i => i.status === 'pending').length },
          { label: 'Net Pending Value', value: `₹${items.filter(i => i.status === 'pending').reduce((a, b) => a + (b.amount || 0), 0).toLocaleString('en-IN')}` },
          { label: 'Completed Today', value: items.filter(i => i.status !== 'pending').length }
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-[1.5rem] p-8 border border-border shadow-sm flex flex-col justify-center group hover:border-foreground/30 transition-all">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <p className="text-3xl font-black text-foreground tracking-tighter">{s.value}</p>
          </div>
        ))}
      </div>

      {query.loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card rounded-[2rem] animate-pulse border border-border" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-[2.5rem] border border-border shadow-sm">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 opacity-30 font-black text-xs uppercase tracking-widest">
            EMPTY

          </div>
          <h3 className="text-xl font-bold text-foreground font-serif mb-2">Capital Queue Clear</h3>
          <p className="text-sm text-muted-foreground font-medium italic">No active payout requests require authorization.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col md:flex-row md:items-center gap-8 transition-all hover:border-foreground/30">
              <div className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-black">
                {item?.userId?.name?.charAt(0) || "M"}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] font-mono opacity-70">
                    TXN_ID_{item._id?.slice(-8).toUpperCase()}
                  </span>
                  <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                    FUNDS_{item.status || 'PENDING'}
                  </div>
                </div>
                <p className="text-3xl font-black text-foreground tracking-tighter">
                  ₹{Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">
                  {item.requestedAt && <span>Requested: {new Date(item.requestedAt).toLocaleDateString()}</span>}
                  <span className="opacity-60 italic">Kyc_Verified_Settlement</span>
                </div>
              </div>
              {item.status === 'pending' && (
                <div className="flex items-center gap-4 md:flex-shrink-0">
                  <Button
                    variant="outline"
                    className="h-10 px-4 text-emerald-green hover:bg-emerald-green hover:text-white border-2 border-emerald-green/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                    onClick={() => handleApprove(item._id)}
                  >
                    Authorize
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 px-4 text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-500/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
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
      <div className="mt-12 bg-foreground rounded-[2.5rem] p-10 text-background shadow-2xl relative overflow-hidden group border border-border">
        <div className="relative z-10">
          <h4 className="text-[10px] font-black opacity-70 uppercase tracking-[0.3em] mb-2">Settlement Protocol</h4>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Capital Disbursement Controls</h3>
          <p className="text-sm opacity-80 font-medium leading-relaxed italic max-w-2xl">
            All withdrawal authorizations are immutable and final. Reversal is not supported post-confirmation. Funds are released via cleared banking channels within 1-3 standard working days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawalsPage;
