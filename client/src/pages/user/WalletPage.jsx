import { useState } from "react";
import { getWalletBalance, getWalletTransactions, requestWithdrawal } from "../../api/walletApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Receipt,
  History,
  ChevronRight,
  Info,
  Shield
} from "lucide-react";
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

  const getTxIcon = (type) => {
    return type?.toLowerCase() === 'credit' ?
      <ArrowDownLeft className="text-emerald-green" /> :
      <ArrowUpRight className="text-primary" />;
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'pending': return 'bg-muted-amber/10 text-muted-amber border-muted-amber/20';
      case 'failed': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[1000px]">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
            <History size={12} />
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
            <div className="bg-primary rounded-[2.5rem] p-10 text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-[0.03] rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 opacity-70">
                  <Wallet size={20} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Liquid Assets (Clinical Escrow)</span>
                </div>
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-5xl font-black font-sans leading-none">₹{Number(balance).toLocaleString()}</span>
                  <span className="text-sm font-bold opacity-60 mb-1">INR</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-green animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">System Online</span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <Shield size={12} className="text-soft-cyan" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Audit Passed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <Receipt size={16} className="text-primary" />
                  Ledger Activity
                </h2>
                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tight">Download Statement</button>
              </div>

              {txQuery.loading && transactions.length === 0 ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-20 text-center">
                  <p className="text-sm text-muted-foreground font-medium italic">No recent financial movements in the ledger.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="p-5 flex items-center gap-6 group hover:bg-muted/30 transition-colors">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-card transition-colors shadow-sm">
                        {getTxIcon(tx.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-bold text-foreground">{tx.description || tx.type}</h4>
                          <div className={`px-1.5 py-0.5 rounded-md border text-[8px] font-bold uppercase tracking-widest ${getStatusStyles(tx.status)}`}>
                            {tx.status}
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-tight uppercase">Reference: {tx._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-black font-sans ${tx.type?.toLowerCase() === 'credit' ? 'text-emerald-green' : 'text-primary'}`}>
                          {tx.type?.toLowerCase() === 'credit' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
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
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <ArrowUpRight size={16} className="text-primary" />
                Release Management
              </h3>
              <form onSubmit={onWithdraw} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1" htmlFor="withdraw-amount">Execution Amount</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">₹</div>
                    <input
                      id="withdraw-amount"
                      type="number"
                      min="1"
                      value={amount}
                      placeholder="0.00"
                      onChange={(event) => setAmount(event.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans font-bold text-lg"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-2xl border border-border flex gap-3">
                  <Info className="text-muted-foreground flex-shrink-0 mt-0.5" size={14} />
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Funds will be released to your registered account ending in **0000 after 2-factor clinical verification.</p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-14 rounded-xl shadow-lg shadow-primary/20 font-bold"
                  loading={actionLoading}
                >
                  Initialize Withdrawal
                </Button>
              </form>
            </div>

            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Financial Guidelines</h3>
              <ul className="space-y-3">
                {[
                  "Escrow lock period: 48 hours post-delivery",
                  "Platform fee: 2% execution charge",
                  "Free withdrawals over ₹500"
                ].map((guide, i) => (
                  <li key={i} className="flex gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter items-start">
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
