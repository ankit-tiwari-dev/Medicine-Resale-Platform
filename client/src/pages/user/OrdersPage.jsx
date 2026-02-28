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
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
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
              <div key={i} className="h-40 bg-card rounded-[2rem] animate-pulse border border-border" />
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
              <div key={order._id} className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm group hover:border-foreground/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">Order #{(order._id || "").slice(-8).toUpperCase()}</h3>
                        <div className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                          {order.status || 'Processing'}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
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
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Valuation</p>
                      <p className="text-2xl font-black text-foreground tracking-tighter">₹{Number(order.totalAmount || order.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <Link to={`/dashboard/orders/${order._id}`} className="flex-1 md:flex-none">
                        <Button variant="outline" className="w-full h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
                          Audit Details
                        </Button>
                      </Link>
                      <Link to={`/buyer/orders/${order._id}/tracking`} className="flex-1 md:flex-none">
                        <Button variant="primary" className="w-full h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/10">
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
