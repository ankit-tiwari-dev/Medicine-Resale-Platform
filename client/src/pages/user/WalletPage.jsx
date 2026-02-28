import { useState } from "react";
import { getWalletBalance, getWalletTransactions, requestWithdrawal } from "../../api/walletApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";

const WalletPage = () => {
  const balanceQuery = useApiQuery(getWalletBalance, true);
  const txQuery = useApiQuery(getWalletTransactions, true);
  const [amount, setAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const onWithdraw = async (event) => {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Valid amount required for clinical withdrawal.");
      return;
    }

    setActionLoading(true);
    try {
      await requestWithdrawal({
        amount: Number(amount),
        bankDetails: { accountNumber: "000000", ifsc: "IFSC000" }
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
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
            Financial Audit
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Secure <span className="text-primary">Wallet</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-sans font-medium">
            Transparent ledger for all clinical medicine transactions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main: Balance & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Balance Card */}
            <div className="bg-foreground rounded-[2.5rem] p-10 text-background shadow-2xl border border-border relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 opacity-60">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Liquid Assets (Clinical Escrow)</span>
                </div>
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-5xl font-black font-sans leading-none tracking-tighter">₹{Number(balance).toLocaleString()}</span>
                  <span className="text-sm font-bold opacity-60 mb-1">INR</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-background/10 px-4 py-2 rounded-xl border border-background/10 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-tight">System Online</span>
                  </div>
                  <div className="bg-background/10 px-4 py-2 rounded-xl border border-background/10 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-tight">Audit Passed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-border bg-muted/20 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-foreground uppercase tracking-widest">
                  Ledger Activity
                </h2>
                <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Download Statement</button>
              </div>

              {txQuery.loading && transactions.length === 0 ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-[1.5rem] animate-pulse" />)}
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-20 text-center">
                  <p className="text-sm text-muted-foreground font-medium italic opacity-60">No recent financial movements in the ledger.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="p-6 flex items-center gap-6 group hover:bg-muted/30 transition-colors">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs text-muted-foreground">
                        {getTxType(tx.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-black text-foreground uppercase tracking-tight leading-none">{tx.description || tx.type}</h4>
                          <div className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${getStatusStyles(tx.status)}`}>
                            {tx.status}
                          </div>
                        </div>
                        <p className="text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-60">Reference: {tx._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black font-sans tracking-tighter ${tx.type?.toLowerCase() === 'credit' ? 'text-emerald-foreground' : 'text-foreground'}`}>
                          {tx.type?.toLowerCase() === 'credit' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">
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
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-8">
                Release Management
              </h3>
              <form onSubmit={onWithdraw} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1" htmlFor="withdraw-amount">Execution Amount</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground font-black text-xl">₹</div>
                    <input
                      id="withdraw-amount"
                      type="number"
                      min="1"
                      value={amount}
                      placeholder="0.00"
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-muted/40 border-2 border-border rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-foreground/5 focus:border-foreground font-sans font-black text-2xl tracking-tighter"
                      required
                    />
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-[1.5rem] border border-border">
                  <p className="text-[9px] text-muted-foreground leading-relaxed font-black uppercase tracking-widest opacity-60">Funds will be released to your registered account ending in **0000 after 2-factor clinical verification.</p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-16 rounded-[1.25rem] shadow-xl shadow-primary/10 font-black uppercase tracking-widest text-xs"
                  loading={actionLoading}
                >
                  Initialize Withdrawal
                </Button>
              </form>
            </div>

            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 underline underline-offset-8 decoration-primary/30">Guidelines</h3>
              <ul className="space-y-4">
                {[
                  "Escrow lock period: 48 hours",
                  "Execution charge: 2% dynamic",
                  "Verified withdrawals only"
                ].map((guide, i) => (
                  <li key={i} className="flex gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest items-start opacity-70">
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
