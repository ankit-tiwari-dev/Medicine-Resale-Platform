import { useState } from "react";
import { getAdminOrders, updateAdminOrderStatus } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "text-muted-amber" },
  { value: "paid", label: "Capital Secured", color: "text-primary" },
  { value: "shipped", label: "In Transit", color: "text-soft-cyan" },
  { value: "delivered", label: "Handover Complete", color: "text-emerald-green" },
  { value: "cancelled", label: "Voided", color: "text-red-500" },
  { value: "disputed", label: "Under Investigation", color: "text-muted-amber" }
];


const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'text-emerald-green border-emerald-green/20 bg-emerald-green/5';
    case 'shipped': return 'text-soft-cyan border-soft-cyan/20 bg-soft-cyan/5';
    case 'paid': return 'text-primary border-primary/20 bg-primary/5';
    case 'cancelled': return 'text-red-500 border-red-500/20 bg-red-500/5';
    case 'disputed': return 'text-muted-amber border-muted-amber/20 bg-muted-amber/5';
    default: return 'text-muted-foreground border-border bg-muted/30';
  }
};

const AdminOrdersPage = () => {
  const query = useApiQuery(getAdminOrders, true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const onStatusChange = async (orderId, status) => {
    if (!status) return;
    setUpdatingId(orderId);
    try {
      await updateAdminOrderStatus(orderId, { status });
      toast.success(`Order transitioned to: ${status}`);
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "State transition failed."));
    } finally {
      setUpdatingId(null);
    }
  };

  const orders = (query.data || []).filter(o =>
    o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em] mb-8">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Procurement Ledger
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Order <span className="text-primary">State Control</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Administrative lifecycle management for all registered medical procurements.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search State Registry..."
                className="h-14 pl-6 pr-6 rounded-2xl bg-card border border-border outline-none focus:border-foreground focus:ring-4 focus:ring-foreground/5 transition-all text-[10px] font-black uppercase tracking-widest w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              Sync Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Pending Dispatches', count: (query.data || []).filter(o => o.status === 'paid').length },
          { label: 'Active Shipments', count: (query.data || []).filter(o => o.status === 'shipped').length },
          { label: 'Completed Trades', count: (query.data || []).filter(o => o.status === 'delivered').length }
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-[1.5rem] p-8 border border-border shadow-sm flex flex-col justify-center group hover:border-foreground/30 transition-all">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <p className="text-3xl font-black text-foreground tracking-tighter">{s.count}</p>
          </div>
        ))}
      </div>

      {query.loading && orders.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-card rounded-[2rem] animate-pulse border border-border" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-[2.5rem] border border-border shadow-sm">
          <p className="text-muted-foreground italic font-medium">No procurement records match the current filter.</p>
        </div>
      ) : (
        <div className="bg-card rounded-[2.5rem] border border-border shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Procurement Manifest</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Current State</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Synchronization</th>
                  <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">State Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-black text-foreground group-hover:text-primary transition-colors">
                          ORD-{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 italic">
                          Institutional Lot Target
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                        {order.status || 'PENDING'}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] italic">
                          SYNC_{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase() : 'PENDING'}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-end">
                        <select
                          className="h-12 px-6 rounded-2xl border-2 border-border bg-card text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer shadow-sm"
                          defaultValue=""
                          onChange={(e) => onStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          <option value="" disabled>Lifecycle Override</option>
                          {STATUS_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 bg-muted/20 border-t border-border flex justify-between items-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {orders.length} Records in Audit Window
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
