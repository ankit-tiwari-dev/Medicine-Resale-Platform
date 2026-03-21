import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import EmptyState from "../../components/common/EmptyState";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import Button from "../../components/common/Button";

const OrdersPage = () => {
  const { data, loading, error } = useApiQuery(getMyOrders, true);
  const orders = data || [];

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-foreground text-background border-foreground';
      case 'shipped': return 'bg-muted-foreground/20 text-foreground border-foreground/30';
      case 'pending': return 'bg-foreground/5 text-foreground border-foreground/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60 font-sans">
            Audit Trail
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
            Order <span className="text-primary">History</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
            Monitor the clinical lifecycle of your pharmaceutical acquisitions.
          </p>
        </div>

        {loading && orders.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-card rounded-xl animate-pulse border border-border" />
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
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-card rounded-xl p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-foreground uppercase col-span-1 tracking-tight font-sans">Order #{(order._id || "").slice(-8).toUpperCase()}</h3>
                        <div className={`px-2 py-0.5 rounded-md border text-[7px] font-bold uppercase tracking-widest ${getStatusStyles(order.status)} opacity-80`}>
                          {order.status || 'Processing'}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                        <span>
                          Created: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span>
                          Volume: {order.orderItems?.length || 0} Units
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 border-t md:border-t-0 pt-6 md:pt-0 border-border border-dashed">
                    <div className="text-center md:text-right font-sans">
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-40">Total Valuation</p>
                      <p className="text-xl font-bold text-foreground tracking-tight">₹{Number(order.totalAmount || order.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <Link to={`/dashboard/orders/${order._id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[8px] border-border hover:bg-muted/30 transition-all font-sans">
                          Audit Details
                        </Button>
                      </Link>
                      <Link to={`/buyer/orders/${order._id}/tracking`} className="flex-1 md:flex-none">
                        <Button variant="primary" className="w-full h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[8px] shadow-lg shadow-primary/5 font-sans">
                          Track Protocol
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
