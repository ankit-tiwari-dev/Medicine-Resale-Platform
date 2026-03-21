import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { createPaymentOrder, verifyPayment } from "../../api/paymentApi";
import { getOrderDetails } from "../../api/orderApi";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  Activity, 
  Zap,
  Package,
  ArrowRight,
  Shield,
  Info
} from "lucide-react";


const CheckoutPage = () => {
  const { user: authUser } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [order, setOrder] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await getOrderDetails(orderId);
          setOrder(response?.data?.data || response?.data);
        } catch (err) {
          toast.error("Could not load order details.");
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const canPay = useMemo(() => Boolean(orderId), [orderId]);

  const onCreatePayment = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const response = await createPaymentOrder({ orderId, currency: "INR" });
      const razorpayOrder = response?.data?.data;

      if (window.Razorpay && razorpayOrder?.id) {
        const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
        const rzp = new window.Razorpay({
          key,
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "MedAImart Secure",
          description: `Order #${(orderId || "").slice(-6).toUpperCase()}`,
          image: "/logo.png",
          handler: async function (result) {
            const payload = {
              razorpay_order_id: result.razorpay_order_id,
              razorpay_payment_id: result.razorpay_payment_id,
              razorpay_signature: result.razorpay_signature,
              order_db_id: orderId
            };
            try {
              const verifyResponse = await verifyPayment(payload);
              if (verifyResponse?.data?.success || verifyResponse?.status === 200) {
                setOrderPlaced(true);
                toast.success("Payment Authorized Successfully");
              }
            } catch (err) {
              toast.error("Payment verification failed. Contact support.");
            }
          },
          prefill: {
            name: authUser?.name || "Customer",
            email: authUser?.email || ""
          },
          theme: {
            color: "#0D9488"
          }
        });
        rzp.open();
      } else {
        toast.error("Razorpay SDK not loaded. Please refresh.");
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to initiate secure payment."));
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Container className="max-w-md">
          <div className="bg-card rounded-xl p-10 shadow-xl border border-border text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-green"></div>
            <div className="w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 size={40} className="text-emerald-green" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Payment Authorized</h2>
            <p className="text-muted-foreground mb-4 text-[10px] font-bold uppercase tracking-widest opacity-60 font-sans italic flex items-center justify-center gap-2">
                <ShieldCheck size={10} />
                Order Ref: #{(orderId || "").slice(-8).toUpperCase()}
            </p>
            <p className="text-[11px] text-muted-foreground mb-8 leading-relaxed font-medium font-sans">
              Your payment is now held in <span className="text-primary font-bold">Secure Escrow</span>. Funds will only be released to the seller after your successful inspection.
            </p>
            <div className="space-y-3">
              <Link to="/dashboard/orders">
                <Button variant="primary" className="w-full h-11 rounded-xl shadow-lg shadow-primary/10 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Activity size={14} />
                  Track My Order
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" className="w-full h-11 rounded-xl font-bold text-[10px] uppercase tracking-widest border-border flex items-center justify-center gap-2">
                  <ShoppingCart size={14} className="opacity-60" />
                  Continue Procurement
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[1000px]">
        {/* Header */}
        <div className="mb-10">
          <Link to="/dashboard/cart" className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase mb-6 font-sans group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            BACK TO CART
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 font-sans">
                Secure Checkout
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                Authorize <span className="text-primary">Payment</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium text-xs">
                Final step in securing your medical asset redistribution.
              </p>
            </div>
            <div className="bg-primary px-6 py-3 rounded-xl flex items-center gap-4 shadow-lg shadow-primary/10">
              <ShieldCheck size={20} className="text-soft-cyan" />
              <div className="text-[10px] uppercase font-bold text-primary-foreground tracking-widest leading-tight font-sans">
                Escrow Protection <br /> Active & Bonded
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Section */}
            <div className="bg-card rounded-xl p-8 lg:p-10 border border-border shadow-sm">
              <h2 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-8 flex items-center gap-3 font-sans opacity-60">
                <MapPin size={12} className="text-primary" />
                Delivery Manifest
              </h2>

              <div className="space-y-6">
                <div className="p-5 bg-muted/30 rounded-xl border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 font-sans">Target Address</p>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center border border-border shadow-sm flex-shrink-0 text-primary">
                      <MapPin size={16} />
                    </div>

                    <p className="text-[11px] font-bold text-foreground leading-relaxed font-sans opacity-80">
                      Secondary validation address required. Please ensure your registered handover address is correct.
                    </p>
                  </div>
                </div>

                <div className="p-5 border border-border border-dashed rounded-xl flex items-center justify-between font-sans">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 text-muted-foreground">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Razorpay Secure Network</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight">UPI / Card / NetBanking</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-green uppercase tracking-widest">OK</div>
                </div>

              </div>
            </div>

            {/* Security Assurance */}
            <div className="bg-clinical-navy rounded-xl p-8 text-white relative overflow-hidden group shadow-xl shadow-clinical-navy/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-soft-cyan opacity-[0.05] rounded-full blur-[80px] -mr-20 -mt-20"></div>
              <div className="relative z-10 flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10 font-bold text-[10px] text-soft-cyan uppercase tracking-widest font-sans">
                  SAFE
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 font-serif">Escrow Bonded Transaction</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 font-sans">
                    <div className="flex items-center gap-2">
                      <Shield size={10} className="text-emerald-green" />
                      Zero-Risk Fulfillment
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={10} className="text-emerald-green" />
                      Packaging Integrity Audit
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={10} className="text-emerald-green" />
                      Cold-Chain Tracking
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={10} className="text-emerald-green" />
                      AI-Verified Medicine
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm sticky top-24">
              <h2 className="text-base font-bold text-foreground font-serif uppercase tracking-tight mb-8">Financial Audit</h2>

              <div className="space-y-4 mb-8 font-sans">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-muted-foreground opacity-60">Order Ref</span>
                  <span className="text-foreground">#{(orderId || "").slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-muted-foreground opacity-60">Logistics</span>
                  <span className="text-foreground">₹0.00</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight pb-4 border-b border-border">
                  <span className="text-muted-foreground opacity-60">Execution</span>
                  <span className="text-emerald-green">WAIVED</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-60">Auth Value</p>
                    <p className="text-2xl font-bold text-primary font-sans leading-none tracking-tight">
                      ₹{order?.amount?.toLocaleString() || "..."}
                    </p>
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase pb-1 tracking-widest opacity-60">INR</div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full h-11 rounded-xl shadow-lg shadow-primary/10 text-[10px] uppercase tracking-widest font-bold flex gap-3 items-center justify-center group"
                onClick={onCreatePayment}
                loading={loading}
                disabled={!canPay}
              >
                <Zap size={14} fill="currentColor" />
                PAY NOW / AUTHORIZE
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;

