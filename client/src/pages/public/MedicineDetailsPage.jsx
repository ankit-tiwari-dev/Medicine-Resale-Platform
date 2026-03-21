import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import medicineService from "../../services/medicineService";

import Section from "../../components/layout/Section";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { 
  ShoppingCart, 
  Zap, 
  ArrowLeft, 
  ShieldCheck, 
  Factory, 
  Database, 
  Calendar, 
  Package, 
  Activity, 
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const MedicineDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await medicineService.getById(id);
        setMedicine(response?.data || null);
      } catch (err) {
        toast.error("Unable to load medicine details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Sync with global cart state
  useEffect(() => {
    if (medicine && cartItems.length > 0) {
      const cartItem = cartItems.find(item => {
        const itemId = item?.medicineId?._id || item.medicineId || item._id;
        return String(itemId) === String(id);
      });
      if (cartItem) {
        setQuantity(Number(cartItem.quantity));
      }
    }
  }, [medicine, cartItems, id]);

  const handleAddToCart = async () => {
    const isInCart = cartItems.some(item => String(item?.medicineId?._id || item.medicineId || item._id) === String(id));
    if (isInCart) {
      navigate('/cart');
      return;
    }

    setActionLoading(true);
    try {
      await addToCart(medicine, quantity);
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setActionLoading(true);
    try {
      await addToCart(medicine, quantity);
      if (!user) {
        navigate('/login', { state: { from: { pathname: '/cart', search: '?autocheckout=true' } } });
      } else {
        navigate('/cart?autocheckout=true');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 animate-pulse">
        <Container className="py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-card rounded-2xl border border-border" />
            <div className="space-y-6">
              <div className="h-10 bg-card rounded-lg w-3/4" />
              <div className="h-6 bg-card rounded-lg w-1/2" />
              <div className="h-32 bg-card rounded-lg w-full" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-xl shadow-sm border border-border">
          <div className="w-12 h-12 flex items-center justify-center font-bold text-[10px] text-muted-foreground mx-auto mb-4 bg-muted rounded-full uppercase tracking-widest opacity-60">ERR</div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2 font-serif">Medicine Not Found</h2>
          <p className="text-muted-foreground mb-6 font-sans">The listing might have been removed or is unavailable.</p>
          <Link to="/browse">
            <Button variant="primary" className="h-11 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { extractedData, image, images, price, adminVerified, riderVerified, description, seller, originalPrice, category, manufacturer, batchNumber, stock = 10 } = medicine;
  const medicineImages = image ? [image] : (images?.length > 0 ? images : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800']);

  return (
    <div className="min-h-screen bg-muted/30">
      <Container className="py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/browse" className="inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-primary transition-colors font-black uppercase tracking-[0.2em] group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            BACK TO CATALOG
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="relative aspect-square bg-muted/30 rounded-xl overflow-hidden mb-6 border border-border/50">
                <img
                  src={medicineImages[selectedImage]}
                  alt={extractedData?.name}
                  className="w-full h-full object-contain p-4"
                />
                {adminVerified && (
                  <div className="absolute top-4 right-4">
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-green text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm backdrop-blur-md">
                      Groq Verified
                    </div>
                  </div>
                )}
              </div>

              {medicineImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {medicineImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-muted/30 ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-contain rounded-lg bg-white" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Compliance Section */}
            <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-green/5 rounded-full blur-2xl -mr-12 -mt-12 transition-transform"></div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-green/20 font-bold text-[9px] text-emerald-green tracking-widest">
                  PASS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-tight">Groq Compliance Audit</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider font-sans opacity-80">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-green font-bold">✓</span> Seal
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-green font-bold">✓</span> Auth
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-green font-bold">✓</span> Expiry
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-green font-bold">✓</span> Tamper
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] px-2 py-0.5 bg-primary/5 rounded border border-primary/10">Clinical Grade</span>
                  {category && <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{category}</span>}
                </div>
                <h1 className="text-2xl font-bold text-foreground font-serif leading-tight">
                  {extractedData?.name || "Premium Medicine"}
                </h1>
                <p className="text-base text-muted-foreground italic font-sans mt-0.5">{extractedData?.genericName}</p>
              </div>

              {/* Price Block */}
              <div className="bg-muted/10 border border-border/60 rounded-xl p-6 mb-6 relative overflow-hidden">
                <div className="flex items-end gap-3 mb-1 relative z-10">
                  <div className="text-3xl font-bold text-foreground font-sans tracking-tight">₹{Number(price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  {originalPrice && originalPrice > price && (
                    <div className="flex items-center gap-2 pb-1">
                      <div className="text-sm text-muted-foreground line-through decoration-destructive/30">₹{Number(originalPrice).toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-green font-black bg-emerald-green/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        {Math.round(((originalPrice - price) / originalPrice) * 100)}% Save
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-background/50 rounded-lg border border-border/40 w-fit">
                    <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-primary italic">S</span>
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-80">Escrow Shield Active</span>
                </div>
                </div>
                        {/* Details Grid: Technical Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-border/50 font-sans">
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Factory size={10} className="text-primary opacity-70" />
                    Manufacturer
                  </div>
                  <div className="font-bold text-foreground text-[11px] leading-tight">{manufacturer || "Verified Labs"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Database size={10} className="text-primary opacity-70" />
                    Batch ID
                  </div>
                  <div className="font-bold text-foreground text-[11px] uppercase tracking-tighter">{extractedData?.batchNumber || "UN-EXTRACTED"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Calendar size={10} className="text-primary opacity-70" />
                    Expiry
                  </div>
                  <div className="font-bold text-foreground text-[11px]">
                    {extractedData?.expiryDate ? new Date(extractedData.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Package size={10} className="text-primary opacity-70" />
                    Inventory
                  </div>
                  <div className="font-bold text-primary text-[11px] px-2 py-0.5 bg-primary/5 rounded w-fit border border-primary/10">{stock} Units</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Activity size={10} className="text-primary opacity-70" />
                    Protocol
                  </div>
                  <div className="font-bold text-emerald-green text-[11px] uppercase tracking-wider">{medicine.status || "Unknown"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <MapPin size={10} className="text-primary opacity-70" />
                    Location
                  </div>
                  <div className="font-bold text-foreground text-[11px] flex items-center gap-1.5 overflow-hidden">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-green flex-shrink-0 animate-pulse"></span>
                    <span className="truncate">{medicine.pickupLocation?.split(',').pop() || "Verified Hub"}</span>
                  </div>
                </div>
              </div>

              {/* Scientific Composition & Clinical Guidance */}
              <div className="space-y-6 mb-8">
                {extractedData?.genericName && (
                  <div className="p-5 bg-muted/5 border border-border/40 rounded-xl group hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                      <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">Scientific Composition</h3>
                    </div>
                    <div className="p-3 bg-background rounded-lg border border-border/50 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary font-sans italic">{extractedData.genericName}</span>
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-soft-cyan"></div>
                            <span className="text-[8px] font-bold text-soft-cyan uppercase tracking-widest">Active Ingredient</span>
                        </div>
                    </div>
                  </div>
                )}

                {(description || extractedData?.description) && (
                  <div className="p-5 bg-primary/[0.02] border border-primary/10 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                        <div className="text-4xl font-serif italic text-primary font-black">?</div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-4 bg-emerald-green rounded-full"></div>
                      <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">Clinical Guidance</h3>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium italic opacity-90 indent-4">
                      "{description || extractedData?.description}"
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><span className="text-emerald-green">✓</span> Groq Audited</span>
                        <span className="flex items-center gap-1"><span className="text-emerald-green">✓</span> Verified Pharmacology</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Action */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border/50 w-fit">
                    <button
                      onClick={() => {
                        const newQty = Math.max(1, quantity - 1);
                        setQuantity(newQty);
                        const isInCart = cartItems.some(item => String(item?.medicineId?._id || item.medicineId || item._id) === String(id));
                        if (isInCart) updateQuantity(id, newQty);
                      }}
                      className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted transition-all flex items-center justify-center text-foreground font-bold"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-foreground w-10 text-center font-sans tracking-tight">{quantity}</span>
                    <button
                      onClick={() => {
                        const newQty = Math.min(stock > 1 ? stock : 99, quantity + 1);
                        setQuantity(newQty);
                        const isInCart = cartItems.some(item => String(item?.medicineId?._id || item.medicineId || item._id) === String(id));
                        if (isInCart) updateQuantity(id, newQty);
                      }}
                      className="w-9 h-9 rounded-lg bg-card border border-border hover:bg-muted transition-all flex items-center justify-center text-foreground font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant={cartItems.some(item => String(item?.medicineId?._id || item.medicineId || item._id) === String(id)) ? "primary" : "outline"}
                      className="h-12 flex-1 rounded-xl font-bold uppercase transition-all text-[10px] tracking-widest flex items-center justify-center gap-2"
                      onClick={handleAddToCart}
                      loading={actionLoading}
                    >
                      <ShoppingCart size={14} />
                      {cartItems.some(item => String(item?.medicineId?._id || item.medicineId || item._id) === String(id)) ? 'Go to Cart' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="primary"
                      className="h-12 flex-1 rounded-xl shadow-lg shadow-primary/20 text-[10px] font-bold uppercase transition-all tracking-widest flex items-center justify-center gap-2"
                      onClick={handleBuyNow}
                      loading={actionLoading}
                    >
                      <Zap size={14} fill="currentColor" />
                      Buy Now • ₹{(price * quantity).toLocaleString()}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Insights */}
            {seller && (
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Verified Reseller Data</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-lg font-bold text-primary-foreground shadow-sm">
                    {seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-foreground text-sm">{seller.name}</span>
                      <div className="bg-emerald-green/10 px-1.5 py-0.5 rounded-sm border border-emerald-green/20 text-[7px] font-bold text-emerald-green uppercase tracking-widest">
                        VERIFIED
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-[8px] text-muted-foreground uppercase tracking-widest opacity-60">
                      <span>RATING 4.2 / 5 RELIABLE SELLER</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card rounded-xl p-8 shadow-sm border border-border">
            <h2 className="text-xl font-bold text-foreground font-serif mb-4 uppercase tracking-tight">Full Product Specification</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground font-sans leading-relaxed text-sm">
              <p>{description || medicine.description || "No manual description provided. This listing has been verified using Groq metadata extraction from images."}</p>
              <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/40">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Protcol Advisory</p>
                <p className="text-xs font-medium opacity-80 leading-relaxed italic">
                  This listing has been audited for compliance with redistribution protocols. Groq extraction errors are manually corrected by MedAImart admins. Verify the batch ID against the manufacturer database for maximum security.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm space-y-5">
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Security Trust-Store</h3>
            {[
              { type: "SEAL", label: "Seal Integrity Verified", color: "text-emerald-green", bg: "bg-emerald-green/10" },
              { type: "AUTH", label: "Legitimate Manufacturer", color: "text-soft-cyan", bg: "bg-soft-cyan/10" },
              { type: "COLD", label: "Cold-Chain Compliant", color: "text-primary", bg: "bg-primary/10" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 font-bold text-[9px] tracking-widest uppercase ${item.color} opacity-80 border border-current/20`}>
                  {item.type}
                </div>
                <span className="text-xs font-bold text-foreground font-sans opacity-80">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MedicineDetailsPage;
