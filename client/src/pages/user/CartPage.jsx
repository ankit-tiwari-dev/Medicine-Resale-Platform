import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { createOrder } from "../../api/orderApi";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import Container from "../../components/layout/Container";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { 
  ShoppingCart, 
  Trash2, 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Minus, 
  CreditCard,
  AlertCircle,
  Truck
} from "lucide-react";


const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { cartItems: items, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const [actionLoading, setActionLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Amazon-style: Auto-trigger checkout if redirected from "Buy Now"
  useEffect(() => {
    const shouldAutoCheckout = searchParams.get('autocheckout') === 'true';
    if (shouldAutoCheckout && items.length > 0 && user && !loading && !actionLoading) {
      handleCheckout();
      // Remove query param to prevent infinite loops or re-triggers on refresh
      navigate('/cart', { replace: true });
    }
  }, [searchParams, items, user, loading]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => {
      const price = Number(item?.medicineId?.price || item?.price || 0);
      const quantity = Number(item?.quantity || 1);
      return sum + (price * quantity);
    }, 0),
    [items]
  );

  const handleRemove = async (medicineId) => {
    await removeFromCart(medicineId);
  };

  const handleClear = async () => {
    setActionLoading(true);
    try {
      await clearCart();
      toast.success("Clinical cart purged successfully");
    } finally {
      setActionLoading(false);
      setShowClearConfirm(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to proceed with checkout.");
      navigate('/login', { state: { from: { pathname: location.pathname, search: '?autocheckout=true' } } });
      return;
    }
    setActionLoading(true);
    try {
      const medicineIds = items.map((item) => item?.medicineId?._id || item.medicineId || item._id).filter(Boolean);
      const response = await createOrder({ items: medicineIds, shippingAddress: "Address update required" });
      const createdOrders = response?.data?.data || [];
      const orderId = createdOrders[0]?._id;
      if (orderId) {
        navigate(`/buyer/checkout?orderId=${orderId}`);
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Checkout failed."));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60 font-sans">
              Clinical Selection
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Clinical <span className="text-primary">Cart</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
              {items.length === 0 ? "Your clinical basket is empty" : `Checking out ${items.length} verified listings`}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-[9px] font-bold text-destructive hover:underline uppercase tracking-widest flex items-center self-start md:self-auto gap-2 opacity-60 hover:opacity-100 transition-opacity font-sans group"
            >
              <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
              PURGE CART
            </button>
          )}
        </div>

        {loading && items.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Your cart is vacant"
            message="Looks like you haven't added any verified medicines for purchase yet. Browse our marketplace to find what you need."
            actionLink="/browse"
            actionLabel="Go to Marketplace"
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const medicine = item.medicineId ? item.medicineId : item;
                const medicineId = medicine._id || item.medicineId || item._id;
                return (
                  <div key={medicineId} className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:border-primary/10 transition-all font-sans">
                    <div className="w-20 h-20 bg-muted/50 rounded-xl overflow-hidden border border-border flex-shrink-0">
                      <img
                        src={medicine?.image || medicine?.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                        alt={medicine?.extractedData?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-base tracking-tight">{medicine?.extractedData?.name || "Premium Medicine"}</h3>
                        {medicine.adminVerified && (
                          <div className="bg-emerald-green/5 p-1 px-2 rounded-md border border-emerald-green/10 text-[7px] font-bold tracking-widest uppercase text-emerald-green">
                            SECURE
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-sans font-medium mb-4 opacity-70">{medicine?.extractedData?.genericName}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-muted/10 p-1 rounded-xl border border-border w-fit mb-4">
                        <button
                          onClick={() => updateQuantity(medicineId, Math.max(1, Number(item.quantity || 1) - 1))}
                          className="w-7 h-7 rounded-lg bg-card shadow-sm border border-border hover:bg-muted transition-all flex items-center justify-center text-foreground"
                          disabled={Number(item.quantity || 1) <= 1}
                        >
                          <Minus size={12} />
                        </button>

                        <span className="text-xs font-bold text-foreground w-8 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(medicineId, Number(item.quantity || 1) + 1)}
                          className="w-7 h-7 rounded-lg bg-card shadow-sm border border-border hover:bg-muted transition-all flex items-center justify-center text-foreground"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <div className="text-base font-bold text-primary">₹{medicine?.price?.toLocaleString() || 0}</div>
                        <div className="h-3 w-px bg-border"></div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Unit Price</div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none h-9 px-4 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 rounded-lg text-[8px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                        onClick={() => handleRemove(medicineId)}
                      >
                        <Trash2 size={12} />
                        DROP
                      </Button>

                      <Link to={`/browse/${medicineId}`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full h-9 px-4 font-bold uppercase text-[8px] tracking-widest rounded-lg flex items-center justify-center gap-2">
                          <Eye size={12} />
                          VIEW
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-8 border border-border shadow-md sticky top-24 font-sans">
                <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-6">Execution Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[11px] font-medium opacity-70">
                    <span className="text-muted-foreground font-sans">Subtotal ({items.length} items)</span>
                    <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium pb-4 border-b border-border opacity-70">
                    <span className="text-muted-foreground font-sans">Verification Fee</span>
                    <span className="text-emerald-green font-bold">₹0 (Free)</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Total Budget</p>
                      <p className="text-2xl font-bold text-primary font-sans">₹{subtotal.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/5 px-2 py-0.5 rounded-md text-[7px] font-bold text-primary border border-primary/10 tracking-widest">ESCROW ACTIVE</div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full h-12 rounded-xl shadow-lg shadow-primary/10 text-xs font-bold uppercase tracking-widest mb-4 transition-all flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  loading={actionLoading}
                >
                  <CreditCard size={14} />
                  Initialize Checkout
                  <ArrowRight size={14} className="ml-1" />
                </Button>
                <p className="text-[9px] text-center text-muted-foreground leading-relaxed font-sans font-medium px-4 opacity-70 italic">
                  By proceeding, you authorize the secure locking of funds in escrow until delivery is verified.
                </p>

                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-soft-cyan/10 flex items-center justify-center text-soft-cyan">
                      <ShieldCheck size={16} />
                    </div>

                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">100% Refundable until verification</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-green/10 flex items-center justify-center text-emerald-green uppercase">
                      <Truck size={16} />
                    </div>

                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Certified Cold-Chain Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* Hospital-Grade Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClear}
        title="Purge Clinical Selection?"
        message="This operation will clear all medicine units from your current session. You will need to re-verify listings from the marketplace to continue."
        confirmLabel="Confirm Purge"
        cancelLabel="Abort Operation"
        loading={actionLoading}
        variant="danger"
      />
    </div>
  );
};

export default CartPage;
