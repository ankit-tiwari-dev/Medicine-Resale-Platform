import { useEffect, useState } from "react";
import medicineService from "../../services/medicineService";
import Section from "../../components/layout/Section";
import Container from "../../components/layout/Container";
import MedicineCard from "../../components/common/MedicineCard";
import Button from "../../components/common/Button";
import { MEDICINE_CATEGORIES } from "../../utils/constants";
import { useCart } from "../../context/CartContext";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  RotateCcw, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck,
  AlertCircle,
  Package,
  Activity
} from "lucide-react";

const BrowseMedicinesPage = () => {
  const { addToCart, cartItems, cartCount } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(2000);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyRiderCertified, setOnlyRiderCertified] = useState(false);
  const [expiryRange, setExpiryRange] = useState('any'); // 'any', '3m', '6m', '1y'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        let expiryAfter = undefined;
        if (expiryRange !== 'any') {
          const date = new Date();
          if (expiryRange === '3m') date.setMonth(date.getMonth() + 3);
          if (expiryRange === '6m') date.setMonth(date.getMonth() + 6);
          if (expiryRange === '1y') date.setFullYear(date.getFullYear() + 1);
          expiryAfter = date.toISOString();
        }

        const params = {
          status: "listed",
          search: searchQuery || undefined,
          category: selectedCategory === 'All Categories' ? undefined : selectedCategory,
          maxPrice: priceRange,
          verified: onlyVerified || undefined,
          riderCertified: onlyRiderCertified || undefined,
          expiryAfter
        };
        const response = await medicineService.getAll(params);
        setItems(response?.data || []);
      } catch (err) {
        setError("Unable to fetch medicines at this time.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMedicines, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, priceRange, onlyVerified, onlyRiderCertified, expiryRange]);

  const resetFilters = () => {
    setSelectedCategory('All Categories');
    setSearchQuery('');
    setPriceRange(2000);
    setOnlyVerified(false);
    setOnlyRiderCertified(false);
    setExpiryRange('any');
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item?.medicineId?.price || item?.price || 0);
    const qty = Number(item?.quantity || 0);
    return acc + (price * qty);
  }, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <Container className="py-8 lg:py-12 max-w-[1400px]">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-green uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-green"></span>
              Verified Marketplace
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Browse <span className="text-primary">Medicines</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans">
              {loading ? "Searching inventory..." : `${items.length} verified listings found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80 group text-[10px] font-bold uppercase tracking-widest text-primary mb-2 md:mb-0">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search by name or generic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans"
              />
            </div>
            <Button
              variant="outline"
              className="lg:hidden gap-2 bg-card h-[42px] rounded-xl px-4 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter size={14} />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-70 flex-shrink-0">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground font-sans">Filters</h2>
                </div>
                <button onClick={resetFilters} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tight flex items-center gap-1">
                  <RotateCcw size={10} />
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Category</h3>
                <div className="space-y-2.5">
                  {MEDICINE_CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 rounded-full border-border text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className={`text-sm font-medium transition-colors ${selectedCategory === category ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border"></div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Max Budget</h3>
                  <span className="text-xs font-bold text-primary">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between mt-2 font-mono text-[10px] text-muted-foreground">
                  <span>₹0</span>
                  <span>₹5000</span>
                </div>
              </div>

              <div className="h-px bg-border"></div>

              {/* Quality & Expiry Filters */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Clinical Expiry</h3>
                <select 
                  value={expiryRange}
                  onChange={(e) => setExpiryRange(e.target.value)}
                  className="w-full bg-muted/40 border-border rounded-xl p-3 text-sm font-medium focus:ring-primary focus:border-primary cursor-pointer mb-6"
                >
                  <option value="any">Minimum Duration (Any)</option>
                  <option value="3m">At least 3 months</option>
                  <option value="6m">At least 6 months</option>
                  <option value="1y">At least 1 year</option>
                </select>

                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Verification Layer</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group p-3 bg-muted/40 rounded-xl hover:bg-muted transition-colors">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">AI Verified</span>
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-emerald-green focus:ring-emerald-green"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group p-3 bg-muted/40 rounded-xl hover:bg-muted transition-colors">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Rider Certified</span>
                    <input
                      type="checkbox"
                      checked={onlyRiderCertified}
                      onChange={(e) => setOnlyRiderCertified(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-soft-cyan focus:ring-soft-cyan"
                    />
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content: Medicine Grid */}
          <main className="flex-1">
            {loading && items.length === 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-12 text-center">
                <div className="text-destructive font-bold mb-2">Error Connection</div>
                <p className="text-muted-foreground text-sm">{error}</p>
                <Button variant="outline" size="sm" className="mt-6" onClick={() => window.location.reload()}>Retry Search</Button>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-muted/30 text-muted-foreground/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No medicines found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed mb-8 font-sans">
                  We couldn't find any verified listings matching your specific filters. Try adjusting your search or budget.
                </p>
                <Button variant="primary" onClick={resetFilters} className="flex items-center gap-2 mx-auto uppercase tracking-widest text-[10px] font-bold">
                  <RotateCcw size={14} />
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {items.map((medicine) => (
                  <MedicineCard
                    key={medicine._id}
                    medicine={medicine}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar: Mini Cart (Desktop Only) */}
          <aside className="hidden xl:block w-70 flex-shrink-0">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground font-sans">Subtotal</h2>
                <span className="text-lg font-bold text-primary italic">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-4">
                  <span>Shopping Cart</span>
                  <span>{cartCount} units</span>
                </div>

                {cartItems.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.slice(0, 3).map((item) => {
                      const name = item?.medicineId?.extractedData?.name || item?.extractedData?.name || "Medicine";
                      const img = item?.medicineId?.image || item?.image || item?.medicineId?.images?.[0] || item?.images?.[0];
                      return (
                        <div key={item._id || item.medicineId} className="flex gap-3">
                          <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover bg-muted" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-foreground line-clamp-1">{name}</p>
                            <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                    {cartItems.length > 3 && (
                      <p className="text-[10px] text-center text-primary font-bold pt-2">+{cartItems.length - 3} more items</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-4 italic">Your cart is empty</p>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full h-12 rounded-xl shadow-lg shadow-primary/10 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group"
                onClick={() => window.location.href = '/cart'}
              >
                <ShoppingCart size={14} />
                Go to Cart
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex items-center gap-3 p-3 bg-emerald-green/5 border border-emerald-green/20 rounded-xl">
                <ShieldCheck size={18} className="text-emerald-green flex-shrink-0" />
                <p className="text-[10px] font-medium text-emerald-green italic leading-tight">
                  Secured by Escrow Architecture. Listed medicines are AI-Verified.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-400">
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-8" />
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-foreground font-serif">Advanced Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="px-4 h-9 bg-muted rounded-xl flex items-center justify-center text-foreground ring-1 ring-border text-[10px] font-bold uppercase tracking-widest">
                CLOSE
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="mb-8 font-sans">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {MEDICINE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-card text-muted-foreground border-border'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border mb-8" />

            {/* Mobile Price */}
            <div className="mb-10 font-sans">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Max Budget</h3>
                <span className="text-lg font-bold text-primary">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest" onClick={resetFilters}>Reset</Button>
              <Button variant="primary" className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest" onClick={() => setShowMobileFilters(false)}>Show Results</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseMedicinesPage;