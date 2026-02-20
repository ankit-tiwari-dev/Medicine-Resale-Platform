import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearCart, getCart, removeFromCart } from "../../api/cartApi";
import { createOrder } from "../../api/orderApi";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import { Trash2, Shield, Truck, ShoppingBag, ChevronRight, Info } from "lucide-react";
import toast from "react-hot-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const query = useApiQuery(getCart, true);
  const cart = query.data || {};
  const [actionLoading, setActionLoading] = useState(false);

  const items = cart.items || cart.cartItems || [];
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item?.medicineId?.price || item?.price || 0), 0),
    [items]
  );

  const handleRemove = async (medicineId) => {
    try {
      await removeFromCart(medicineId);
      await query.execute();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to remove item."));
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) return;
    try {
      await clearCart();
      await query.execute();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to clear cart."));
    }
  };

  const handleCheckout = async () => {
    setActionLoading(true);
    try {
      const medicineIds = items.map((item) => item?.medicineId?._id || item.medicineId).filter(Boolean);
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
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <ShoppingBag size={12} />
              Your Selection
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Clinical <span className="text-primary">Cart</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              {items.length === 0 ? "Your clinical basket is empty" : `Checking out ${items.length} verified listings`}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] font-bold text-destructive hover:underline uppercase tracking-widest flex items-center gap-2"
            >
              <Trash2 size={12} /> Clear Entire Cart
            </button>
          )}
        </div>

        {query.loading && items.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-card rounded-2xl animate-pulse border border-border" />
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
                const medicine = item.medicineId || {};
                const medicineId = medicine._id || item.medicineId;
                return (
                  <div key={medicineId} className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:border-primary/20 transition-all">
                    <div className="w-24 h-24 bg-muted/50 rounded-xl overflow-hidden border border-border flex-shrink-0">
                      <img
                        src={medicine?.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                        alt={medicine?.extractedData?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-lg">{medicine?.extractedData?.name || "Premium Medicine"}</h3>
                        {medicine.adminVerified && (
                          <div className="bg-emerald-green/10 p-0.5 rounded-full border border-emerald-green/20">
                            <Shield className="w-3 h-3 text-emerald-green" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-sans font-medium mb-2">{medicine?.extractedData?.genericName}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <div className="text-lg font-bold text-primary">₹{medicine?.price?.toLocaleString() || 0}</div>
                        <div className="h-4 w-px bg-border"></div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unit Price</div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none h-10 px-3 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
                        onClick={() => handleRemove(medicineId)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Link to={`/browse/${medicineId}`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full h-10 px-3">
                          <Info size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-8 border border-border shadow-md sticky top-24">
                <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-6">Execution Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium pb-4 border-b border-border">
                    <span className="text-muted-foreground">Verification Fee</span>
                    <span className="text-emerald-green font-bold">₹0 (Free)</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Budget</p>
                      <p className="text-3xl font-bold text-primary font-sans">₹{subtotal.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/5 px-2 py-1 rounded text-[10px] font-bold text-primary border border-primary/10">ESCROW ACTIVE</div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full h-14 rounded-xl shadow-lg shadow-primary/20 text-lg font-bold mb-4"
                  onClick={handleCheckout}
                  loading={actionLoading}
                >
                  Initialize Checkout
                </Button>
                <p className="text-[10px] text-center text-muted-foreground leading-relaxed font-sans font-medium px-4">
                  By proceeding, you authorize the secure locking of funds in escrow until delivery is verified.
                </p>

                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-soft-cyan/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-soft-cyan" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">100% Refundable until verification</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-green/10 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-emerald-green" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Certified Cold-Chain Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
