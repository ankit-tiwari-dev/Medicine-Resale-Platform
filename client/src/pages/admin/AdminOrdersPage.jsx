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
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Procurement Ledger
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Order <span className="text-primary">State Control</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Administrative lifecycle management for all registered medical procurements.
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans">
            <div className="relative">
              <input
                type="text"
                placeholder="Search State Registry..."
                className="h-10 pl-4 pr-4 rounded-xl bg-card border border-border outline-none focus:border-primary/30 transition-all text-[11px] font-bold tracking-tight w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-10 px-6 rounded-xl border border-border font-bold uppercase tracking-widest text-[9px] hover:bg-muted/30 transition-all"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              Sync Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending Dispatches', count: (query.data || []).filter(o => o.status === 'paid').length },
          { label: 'Active Shipments', count: (query.data || []).filter(o => o.status === 'shipped').length },
          { label: 'Completed Trades', count: (query.data || []).filter(o => o.status === 'delivered').length }
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col justify-center group hover:border-primary/20 transition-all font-sans">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 opacity-50">{s.label}</p>
            <p className="text-xl font-bold text-foreground tracking-tight">{s.count}</p>
          </div>
        ))}
      </div>

      {query.loading && orders.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted-foreground italic font-medium">No procurement records match the current filter.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border font-sans">
                  <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Procurement Manifest</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Current State</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Synchronization</th>
                  <th className="px-6 py-4 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-widest">State Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col font-sans">
                        <span className="font-mono text-[11px] font-bold text-foreground group-hover:text-primary transition-colors">
                          ORD-{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1 opacity-50 italic">
                          Lot Target
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[8px] font-bold uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                        {order.status || 'PENDING'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col font-sans opacity-60">
                        <span className="text-[8px] font-bold text-foreground uppercase tracking-[0.1em] italic">
                          SYNC_{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase() : 'PENDING'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end font-sans">
                        <select
                          className="h-8 px-4 rounded-lg border border-border bg-card text-[8px] font-bold uppercase tracking-widest outline-none focus:border-primary/30 transition-all cursor-pointer shadow-sm opacity-80 hover:opacity-100"
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
          <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            {orders.length} Records in Audit Window
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
