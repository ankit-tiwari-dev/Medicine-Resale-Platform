import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetails } from "../../api/orderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  Package,
  Shield,
  Truck,
  MapPin,
  ChevronLeft,
  CheckCircle,
  FileText,
  Clock,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import Button from "../../components/common/Button";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const fetcher = useCallback(() => getOrderDetails(id), [id]);
  const { data, loading, error } = useApiQuery(fetcher, true);
  const order = data;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 animate-pulse">
        <Container className="py-12">
          <div className="h-10 bg-card rounded-lg w-1/4 mb-10" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-card rounded-2xl" />
            <div className="h-64 bg-card rounded-2xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-2xl shadow-sm border border-border">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Sync Error</h2>
          <p className="text-muted-foreground mb-6">Unable to retrieve order details from the clinical network.</p>
          <Link to="/dashboard/orders">
            <Button variant="primary">Back to History</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-green text-white';
      case 'shipped': return 'bg-soft-cyan text-white';
      case 'pending': return 'bg-muted-amber text-white';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link to="/dashboard/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to History
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                <FileText size={12} />
                Order Manifest
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Order <span className="text-primary">#{(id || "").slice(-8).toUpperCase()}</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Initialized on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg ${getStatusStyles(order.status)}`}>
              <Truck size={16} />
              {order.status || 'Processing'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-3">
                <ShoppingBag className="text-primary" size={18} />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Procedural Items</h2>
              </div>
              <div className="divide-y divide-border">
                {(order.orderItems || []).map((item) => (
                  <div key={item._id} className="p-6 flex items-center gap-6 group hover:bg-muted/30 transition-colors">
                    <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden border border-border">
                      <img
                        src={item.medicineId?.image || item.medicineId?.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                        alt="Medicine"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{(item.medicineId?.extractedData?.name || "Premium Medicine")}</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">ID: {item.medicineId?._id || item._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary font-sans">₹{Number(item.price || 0).toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Unit Verified</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-muted/30 flex justify-between items-center">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Manifest Total</div>
                <div className="text-3xl font-bold text-foreground font-sans">₹{Number(order.totalAmount || order.amount || 0).toLocaleString()}</div>
              </div>
            </div>

            {/* Escrow Status Detail */}
            <div className="bg-primary rounded-[2rem] p-8 text-primary-foreground relative overflow-hidden group shadow-xl shadow-primary/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[80px] group-hover:opacity-10 transition-opacity"></div>
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 font-serif">Escrow Protection Status</h3>
                  <p className="text-xs text-primary-foreground/70 mb-6 leading-relaxed font-sans">
                    Funds for this order are currently <span className="text-soft-cyan font-bold uppercase underline decoration-soft-cyan/30">Locked in Vault</span>. Release will trigger upon delivery confirmation and packaging integrity audit.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={14} className="text-soft-cyan" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Payment Verified by Razorpay</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-white/40" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Awaiting Rider Collection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: logistics */}
          <div className="space-y-6">
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                Clinical Handover
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Delivery Endpoint</p>
                  <p className="text-sm font-bold text-foreground leading-relaxed">{order.shippingAddress || "Registered verification address required"}</p>
                </div>
                <div className="h-px bg-border dashed"></div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Transaction Ref</p>
                  <p className="text-xs font-mono font-bold text-primary break-all">{order.paymentId || "PAYMENT-PENDING"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <Truck size={16} className="text-emerald-green" />
                Logistics Tracking
              </h3>
              <Link to={`/buyer/orders/${order._id}/tracking`}>
                <Button variant="outline" className="w-full h-14 rounded-xl font-bold border-2">
                  Open Logistics Portal
                </Button>
              </Link>
              <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-tighter">Certified riders only</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderDetailsPage;
