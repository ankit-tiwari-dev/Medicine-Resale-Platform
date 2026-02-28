import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { createPaymentOrder, verifyPayment } from "../../api/paymentApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";


const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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
            name: "Clinical Professional",
            email: "professional@provider.com"
          },
          theme: {
            color: "#0B1120"
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
          <div className="bg-card rounded-[2.5rem] p-10 shadow-xl border border-border text-center">
            <div className="w-24 h-24 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner font-black text-[10px] uppercase text-emerald-green tracking-widest">
              OK
            </div>

            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Payment Authorized</h2>
            <p className="text-muted-foreground mb-4 font-medium italic">Order Ref: #{(orderId || "").slice(-8).toUpperCase()}</p>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">
              Your payment is now held in <span className="text-primary font-bold">Secure Escrow</span>. Funds will only be released to the seller after your successful inspection and delivery confirmation.
            </p>
            <div className="space-y-3">
              <Link to="/dashboard/orders">
                <Button variant="primary" className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 text-lg font-bold">
                  Track My Order
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" className="w-full h-14 rounded-2xl">
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
          <Link to="/dashboard/cart" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase mb-6">
            <span className="tracking-widest">BACK TO</span> Cart
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                SECURE

                Secure Checkout
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Authorize <span className="text-primary">Payment</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Final step in securing your medical asset redistribution.
              </p>
            </div>
            <div className="bg-primary px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-primary/10">
              <div className="text-[10px] font-black text-soft-cyan uppercase tracking-widest">SAFE</div>

              <div className="text-[10px] uppercase font-bold text-primary-foreground tracking-widest leading-tight">
                Escrow Protection <br /> Active & Bonded
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Section */}
            <div className="bg-card rounded-[2rem] p-8 lg:p-10 border border-border shadow-sm">
              <h2 className="text-[10px] font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="text-primary">DESTINATION</span>
                Delivery Manifest
              </h2>

              <div className="space-y-6">
                <div className="p-5 bg-muted/30 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Target Address</p>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center border border-border shadow-sm flex-shrink-0 text-[10px] font-black text-primary uppercase tracking-widest">
                      LOC
                    </div>

                    <p className="text-sm font-bold text-foreground leading-relaxed">
                      Secondary validation address required. Please ensure your registered handover address is correct in your profile.
                    </p>
                  </div>
                </div>

                <div className="p-5 border border-border border-dashed rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      PAY
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Razorpay Secure Network</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">UPI / Card / NetBanking</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-emerald-green uppercase tracking-widest">OK</div>
                </div>

              </div>
            </div>

            {/* Security Assurance */}
            <div className="bg-clinical-navy rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-soft-cyan opacity-[0.05] rounded-full blur-[80px] -mr-20 -mt-20"></div>
              <div className="relative z-10 flex gap-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10 font-black text-[10px] text-soft-cyan uppercase tracking-widest">
                  SAFE
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 font-serif">Escrow Bonded Transaction</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-green" />
                      Zero-Risk Fulfillment
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-green" />
                      Packaging Integrity Audit
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-green" />
                      Cold-Chain Tracking
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-green" />
                      AI-Verified Medicine
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-md sticky top-24">
              <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-8">Financial Audit</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Order Ref</span>
                  <span className="text-foreground">#{(orderId || "").slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Logistics Protection</span>
                  <span className="text-foreground">₹0.00</span>
                </div>
                <div className="flex justify-between text-sm font-medium pb-4 border-b border-border">
                  <span className="text-muted-foreground">Execution Fee</span>
                  <span className="text-emerald-green font-bold">WAIVED</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Authorization Value</p>
                    <p className="text-3xl font-black text-primary font-sans leading-none">₹Pending</p>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase pb-1 tracking-widest">INR</div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20 text-[12px] uppercase tracking-widest font-black flex gap-3 items-center justify-center group"
                onClick={onCreatePayment}
                loading={loading}
                disabled={!canPay}
              >
                PAY NOW / AUTHORIZE CAPITAL
              </Button>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;

