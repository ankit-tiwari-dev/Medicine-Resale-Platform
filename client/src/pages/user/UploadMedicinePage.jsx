import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  Camera,
  ChevronLeft,
  CheckCircle,
  Info,
  Shield,
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import { uploadMedicine } from "../../api/medicineApi";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { MEDICINE_CATEGORIES } from "../../utils/constants";
import toast from "react-hot-toast";

const UploadMedicinePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('details'); // 'details' | 'verifying' | 'success'
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    genericName: "",
    manufacturer: "",
    category: MEDICINE_CATEGORIES[1], // Default to first category after 'All'
    batchNumber: "",
    expiryDate: "",
    stock: 1,
    originalPrice: "",
    price: "", // Selling Price
    description: ""
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please provide at least one image showing medicine packaging.");
      return;
    }

    setStep('verifying');
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    // Append all fields to FormData
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    try {
      await uploadMedicine(formData);
      // Simulate AI extraction delay for UI feedback
      setTimeout(() => {
        setStep('success');
        setLoading(false);
      }, 3000);
    } catch (error) {
      toast.error("Failed to upload listing. Check your network.");
      setStep('details');
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Container className="max-w-md">
          <div className="bg-card rounded-[2.5rem] p-10 shadow-xl border border-border text-center">
            <div className="w-24 h-24 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle size={40} className="text-emerald-green" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Listing Secured</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">
              Your medicine has been initialized in our network. It is now undergoing <span className="text-primary font-bold font-sans">AI Forensic Verification</span> before going public.
            </p>
            <div className="space-y-3">
              <Link to="/dashboard/my-medicines">
                <Button variant="primary" className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 text-lg">
                  Manage My Listings
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl"
                onClick={() => {
                  setStep('details');
                  setForm({ ...form, name: "", batchNumber: "", expiryDate: "" });
                  setImage(null);
                  setPreview(null);
                }}
              >
                List Another Medicine
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (step === 'verifying') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Container className="max-w-md">
          <div className="bg-card rounded-[2.5rem] p-10 shadow-xl border border-border text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-inner">
              <Camera size={40} className="text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">AI Forensic Scan</h2>
            <p className="text-muted-foreground mb-10 text-sm leading-relaxed font-medium">
              Our Llama 3.2 Vision model is analyzing packaging integrity and extracting legitimate pharmaceutical metadata...
            </p>
            <div className="space-y-4 max-w-xs mx-auto">
              {[
                { label: "Packaging Integrity Check", status: "complete" },
                { label: "Batch Data Extraction", status: "complete" },
                { label: "Expiry Timeline Audit", status: "active" },
                { label: "Seller Compliance Review", status: "pending" }
              ].map((audit, i) => (
                <div key={i} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-left">
                  <div className={`w-2 h-2 rounded-full ${audit.status === 'complete' ? 'bg-emerald-green' : audit.status === 'active' ? 'bg-primary animate-ping' : 'bg-muted'}`} />
                  <span className={audit.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}>{audit.label}</span>
                </div>
              ))}
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
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Command Center
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                <ShoppingBag size={12} />
                Seller Gateway
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Upload <span className="text-primary">Medicine</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium max-w-lg">
                List unused verified medicines. Every listing requires an AI Forensic Scan to ensure platform safety.
              </p>
            </div>
            <div className="bg-emerald-green/5 border border-emerald-green/10 px-6 py-3 rounded-2xl flex items-center gap-3">
              <Shield className="text-emerald-green" size={20} />
              <div className="text-[10px] uppercase font-bold text-emerald-green tracking-widest leading-tight">
                100% Secure <br /> Escrow System
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid lg:grid-cols-5 gap-8">
          {/* Left: Image Upload Zone */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm">
              <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-2">Visual Evidence</h2>
              <p className="text-xs text-muted-foreground mb-8 leading-relaxed font-medium">Verify packaging integrity with clear images.</p>

              <div
                className={`aspect-square rounded-[1.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer p-4 ${preview ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary hover:bg-muted/50'}`}
                onClick={() => document.getElementById('image-upload').click()}
              >
                {preview ? (
                  <img src={preview} alt="Medicine Preview" className="w-full h-full object-cover rounded-xl shadow-lg shadow-primary/10" />
                ) : (
                  <>
                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <Upload className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-bold text-foreground font-sans">Drop medication scan</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase mt-1 tracking-widest">PNG, JPG up to 10MB</span>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="mt-8 bg-muted/30 rounded-2xl p-4 border border-border dashed">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground mb-1 uppercase tracking-tight">AI Capture Protocol</h4>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Ensure the Batch Number and Expiry Date are clearly visible to avoid audit failure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-card rounded-[2rem] p-10 border border-border shadow-sm space-y-10">
              <div>
                <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Pharmaceutical Data
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormInput
                    label="Brand Name"
                    placeholder="e.g., Dolo 650"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="font-sans"
                  />
                  <FormInput
                    label="Generic Name"
                    placeholder="e.g., Paracetamol"
                    value={form.genericName}
                    onChange={(e) => setForm({ ...form, genericName: e.target.value })}
                    className="font-sans"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <FormInput
                    label="Manufacturer"
                    placeholder="e.g., Micro Labs"
                    value={form.manufacturer}
                    onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    className="font-sans"
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Category</label>
                    <select
                      className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans font-medium"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {MEDICINE_CATEGORIES.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-6 mt-6">
                  <FormInput
                    label="Batch No."
                    placeholder="AI will extract"
                    value={form.batchNumber}
                    onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                    required
                    className="font-sans"
                  />
                  <FormInput
                    label="Expiry"
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    required
                    className="font-sans"
                  />
                  <div className="flex flex-col justify-end">
                    <FormInput
                      label="Quantity"
                      type="number"
                      min="1"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                      required
                      className="font-sans"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 mb-2 block">Safety Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe storage conditions and seal integrity..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-4 bg-muted/40 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-green rounded-full" />
                  Fair-Trade Pricing
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 items-start">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Original MRP</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={form.originalPrice}
                        onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                        className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans pl-8"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Your List Price</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₹</div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans pl-8"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-emerald-green/5 border border-emerald-green/10 rounded-xl flex items-center gap-3">
                  <Info size={16} className="text-emerald-green" />
                  <p className="text-[10px] font-bold text-emerald-green uppercase tracking-widest">Pricing 30% below MRP is recommended for rapid clinical redistribution.</p>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20 text-lg font-bold flex gap-3 items-center justify-center group"
                disabled={loading}
              >
                {loading ? "Securely Initializing..." : "Submit for AI forensic scan"}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default UploadMedicinePage;
