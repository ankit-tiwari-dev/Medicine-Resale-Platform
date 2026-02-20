import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import EmptyState from "../../components/common/EmptyState";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  Package,
  Clock,
  CheckCircle,
  ChevronRight,
  Truck,
  AlertCircle,
  FileText,
  History
} from "lucide-react";
import Button from "../../components/common/Button";

const OrdersPage = () => {
  const { data, loading, error } = useApiQuery(getMyOrders, true);
  const orders = data || [];

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'shipped': return 'bg-soft-cyan/10 text-soft-cyan border-soft-cyan/20';
      case 'pending': return 'bg-muted-amber/10 text-muted-amber border-muted-amber/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'cancelled': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
            <History size={12} />
            Audit Trail
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Order <span className="text-primary">History</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-sans font-medium">
            Monitor the clinical lifecycle of your pharmaceutical acquisitions.
          </p>
        </div>

        {loading && orders.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-card rounded-2xl animate-pulse border border-border" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No order records"
            message="You haven't initialized any medicine purchases yet. Your procurement history will appear here."
            actionLink="/browse"
            actionLabel="Browse Marketplace"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-card rounded-2xl p-6 border border-border shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Package size={28} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-bold text-foreground font-sans">Order #{(order._id || "").slice(-8).toUpperCase()}</h3>
                        <div className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${getStatusStyles(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status || 'Processing'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={12} />
                          {order.orderItems?.length || 0} Items
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-border border-dashed">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Value Amount</p>
                      <p className="text-xl font-bold text-foreground font-sans">₹{Number(order.totalAmount || order.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/dashboard/orders/${order._id}`}>
                        <Button variant="outline" size="sm" className="h-10 px-4 font-bold border-2">
                          Details
                        </Button>
                      </Link>
                      <Link to={`/buyer/orders/${order._id}/tracking`}>
                        <Button variant="primary" size="sm" className="h-10 px-4 font-bold shadow-lg shadow-primary/10 flex items-center gap-2">
                          Track <ChevronRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
