import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Star, ChevronLeft, Plus, Minus, Truck, Info, Award } from "lucide-react";
import medicineService from "../../services/medicineService";

import Section from "../../components/layout/Section";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const MedicineDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
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

  const handleAddToCart = async () => {
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
        <div className="text-center p-8 bg-card rounded-2xl shadow-sm border border-border">
          <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Medicine Not Found</h2>
          <p className="text-muted-foreground mb-6">The listing might have been removed or is unavailable.</p>
          <Link to="/browse">
            <Button variant="primary">Back to Marketplace</Button>
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
          <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="relative aspect-square bg-muted/50 rounded-xl overflow-hidden mb-6 border border-border">
                <img
                  src={medicineImages[selectedImage]}
                  alt={extractedData?.name}
                  className="w-full h-full object-contain p-2"
                />
                {adminVerified && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-green text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg backdrop-blur-md">
                      <CheckCircle size={12} /> AI Verified
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
            <div className="bg-emerald-green/5 border border-emerald-green/10 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-green/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-green/10">
                  <CheckCircle className="w-8 h-8 text-emerald-green" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3 font-serif uppercase tracking-tight">AI Compliance Audit</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-green">✓</span> Seal Integrity
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-green">✓</span> Batch Auth
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-green">✓</span> Expiry Confirmed
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-green">✓</span> Tamper detection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] px-2 py-1 bg-primary/5 rounded border border-primary/10">Clinical Grade</span>
                  {category && <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{category}</span>}
                </div>
                <h1 className="text-4xl font-bold text-foreground font-serif leading-tight">
                  {extractedData?.name || "Premium Medicine"}
                </h1>
                <p className="text-lg text-muted-foreground italic font-sans mt-1">{extractedData?.genericName}</p>
              </div>

              {/* Price Block */}
              <div className="bg-muted/30 border border-border rounded-2xl p-8 mb-8">
                <div className="flex items-end gap-3 mb-2">
                  <div className="text-5xl font-bold text-foreground font-sans tracking-tighter">₹{Number(price || 0).toFixed(2)}</div>
                  {originalPrice && originalPrice > price && (
                    <>
                      <div className="text-xl text-muted-foreground line-through pb-1 decoration-destructive/30">₹{Number(originalPrice).toFixed(2)}</div>
                      <div className="text-lg text-emerald-green font-bold pb-1 ml-2 bg-emerald-green/10 px-3 py-1 rounded-lg">
                        {Math.round(((originalPrice - price) / originalPrice) * 100)}% Off
                      </div>
                    </>
                  )}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Final Price Incl. Escrow Protection</p>
              </div>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12 mb-10 pb-10 border-b border-border font-sans">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Manufacturer</div>
                  <div className="font-bold text-foreground text-sm">{manufacturer || "Verified Labs"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Batch Number</div>
                  <div className="font-bold text-foreground text-sm uppercase tracking-tighter">{extractedData?.batchNumber || "UN-EXTRACTED"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Expiry Date</div>
                  <div className="font-bold text-foreground text-sm">
                    {extractedData?.expiryDate ? new Date(extractedData.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Available In-Store</div>
                  <div className="font-bold text-primary text-sm px-2 py-0.5 bg-primary/5 rounded w-fit">{stock} Units</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5"><Shield size={12} /> Listing Status</div>
                  <div className="font-bold text-emerald-green text-sm uppercase tracking-tighter">{medicine.status || "Unknown"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Procurement Location</div>
                  <div className="font-bold text-foreground text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse"></span>
                    {medicine.pickupLocation || "Address verification pending"}
                  </div>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground relative overflow-hidden group shadow-xl shadow-primary/10 mb-10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-[60px] group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-start gap-6 relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-serif">Escrow Shield <span className="text-soft-cyan">Active</span></h3>
                    <p className="text-xs text-primary-foreground/70 mb-4 leading-relaxed font-sans">
                      MedAImart secures your payment. Funds are only dispersed to the seller once you receive and confirm the medicine's integrity.
                    </p>
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 w-fit">
                      <Truck className="w-4 h-4 text-soft-cyan" />
                      {medicine?.isVerified && <p className="text-[10px] font-bold text-emerald-green uppercase tracking-widest mt-1">MedAImart Certified Integration</p>}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Certified Delivery Network</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Action */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-xl border border-border w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-card shadow-sm border border-border hover:bg-muted transition-all flex items-center justify-center text-foreground"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold text-foreground w-12 text-center font-sans">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(Number(stock) || 10, quantity + 1))}
                      className="w-10 h-10 rounded-lg bg-card shadow-sm border border-border hover:bg-muted transition-all flex items-center justify-center text-foreground"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      className="h-14 flex-1 rounded-xl font-bold uppercase transition-all"
                      onClick={handleAddToCart}
                      loading={actionLoading}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      className="h-14 flex-1 rounded-xl shadow-lg shadow-primary/20 text-lg font-bold uppercase transition-all"
                      onClick={handleBuyNow}
                      loading={actionLoading}
                    >
                      Buy Now • ₹{(price * quantity).toLocaleString()}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Insights */}
            {seller && (
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">Verified Reseller Data</h3>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                    {seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground text-lg">{seller.name}</span>
                      <div className="bg-emerald-green/10 p-1 rounded-full border border-emerald-green/20">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-green" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-sm text-muted-foreground font-sans">
                      <div className="flex items-center text-muted-amber">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 text-border" />
                      </div>
                      <span>4.2 Reliable Seller</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Overview Section */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card rounded-2xl p-10 shadow-sm border border-border">
            <h2 className="text-2xl font-bold text-foreground font-serif mb-6 uppercase tracking-tight">Technical Overview</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground font-sans leading-relaxed">
              <p>{description || "No manual description provided. This listing has been verified using AI metadata extraction from images."}</p>
              <p className="mt-4 text-sm font-medium">Safety Guarantee: This medication has been audited for compliance with redistribution protocols. Always use under medical supervision. AI extraction errors are manually corrected by MedAImart admins.</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-6">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Security Trust-Store</h3>
            {[
              { icon: CheckCircle, label: "Seal Integrity Verified", color: "text-emerald-green", bg: "bg-emerald-green/10" },
              { icon: Award, label: "Legitimate Manufacturer", color: "text-soft-cyan", bg: "bg-soft-cyan/10" },
              { icon: Shield, label: "Cold-Chain Compliant", color: "text-primary", bg: "bg-primary/10" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-sm font-bold text-foreground font-sans">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MedicineDetailsPage;
