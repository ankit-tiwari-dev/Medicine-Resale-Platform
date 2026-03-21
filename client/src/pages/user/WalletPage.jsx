import { useState } from "react";
import { getWalletBalance, getWalletTransactions, requestWithdrawal } from "../../api/walletApi";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";

const WalletPage = () => {
  const balanceQuery = useApiQuery(getWalletBalance, true);
  const txQuery = useApiQuery(getWalletTransactions, true);
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const onWithdraw = async (event) => {
    event.preventDefault();
    if (!user?.bankDetails?.accountNumber || !user?.bankDetails?.ifsc) {
      toast.error("Please configure your Payout Bank Details in your Profile first.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Valid amount required for clinical withdrawal.");
      return;
    }

    setActionLoading(true);
    try {
      await requestWithdrawal({
        amount: Number(amount),
        bankDetails: user.bankDetails
      });
      toast.success("Withdrawal request initialized in the network.");
      setAmount("");
      await balanceQuery.execute();
      await txQuery.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Withdrawal initialization failed."));
    } finally {
      setActionLoading(false);
    }
  };

  const balance = balanceQuery.data?.balance || 0;
  const transactions = txQuery.data || [];

  const getTxType = (type) => {
    return type?.toLowerCase() === 'credit' ? 'DR' : 'CR';
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-foreground text-background border-foreground';
      case 'pending': return 'bg-foreground/5 text-foreground border-foreground/20';
      case 'failed': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[1000px]">
        {/* Header */}
        <div className="mb-10 font-sans">
          <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
            Financial Audit
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
            Secure <span className="text-primary">Wallet</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
            Transparent ledger for all clinical medicine transactions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main: Balance & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Balance Card */}
            <div className="bg-foreground rounded-xl p-10 text-background shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 font-sans">
                <div className="flex items-center gap-3 mb-6 opacity-60">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Liquid Assets (Clinical Escrow)</span>
                </div>
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-4xl font-bold font-sans leading-none tracking-tight">₹{Number(balance).toLocaleString()}</span>
                  <span className="text-xs font-bold opacity-60 mb-1">INR</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-background/10 px-4 py-2 rounded-lg border border-background/10 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-tight">System Online</span>
                  </div>
                  <div className="bg-background/10 px-4 py-2 rounded-lg border border-background/10 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-tight">Audit Passed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden font-sans">
              <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <h2 className="text-[9px] font-bold text-foreground uppercase tracking-widest opacity-80">
                  Ledger Activity
                </h2>
                <button className="text-[8px] font-bold text-primary hover:underline uppercase tracking-widest">Download Statement</button>
              </div>

              {txQuery.loading && transactions.length === 0 ? (
                <div className="p-8 space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium italic opacity-50">No recent financial movements in the ledger.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="p-5 flex items-center gap-6 group hover:bg-muted/30 transition-colors">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[10px] text-muted-foreground">
                        {getTxType(tx.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-[13px] font-bold text-foreground uppercase tracking-tight leading-none font-sans">{tx.description || tx.type}</h4>
                          <div className={`px-2 py-0.5 rounded-md border text-[7px] font-bold uppercase tracking-widest ${getStatusStyles(tx.status)} opacity-80`}>
                            {tx.status}
                          </div>
                        </div>
                        <p className="text-[8px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">Reference: {tx._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-bold font-sans tracking-tight ${tx.type?.toLowerCase() === 'credit' ? 'text-emerald-green' : 'text-foreground'}`}>
                          {tx.type?.toLowerCase() === 'credit' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                        </p>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">
                          {new Date(tx.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Withdrawal */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-8">
                Release Management
              </h3>
              <form onSubmit={onWithdraw} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1" htmlFor="withdraw-amount">Execution Amount</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground font-bold text-xl">₹</div>
                    <input
                      id="withdraw-amount"
                      type="number"
                      min="1"
                      value={amount}
                      placeholder="0.00"
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans font-bold text-2xl tracking-tight"
                      required
                    />
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-xl border border-border">
                  <p className="text-[9px] text-muted-foreground leading-relaxed font-bold uppercase tracking-widest opacity-60">
                    Funds will be released to your registered account {user?.bankDetails?.accountNumber ? `ending in **${user.bankDetails.accountNumber.slice(-4)}` : "(Unconfigured)"} after 2-factor clinical verification.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-11 rounded-xl shadow-lg shadow-primary/5 font-bold uppercase tracking-widest text-[9px] transition-all"
                  loading={actionLoading}
                >
                  Initialize Withdrawal
                </Button>
              </form>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 underline underline-offset-8 decoration-primary/30">Guidelines</h3>
              <ul className="space-y-4">
                {[
                  "Escrow lock period: 48 hours",
                  "Execution charge: 2% dynamic",
                  "Verified withdrawals only"
                ].map((guide, i) => (
                  <li key={i} className="flex gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest items-start opacity-70">
                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {guide}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default WalletPage;
