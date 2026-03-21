import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { scanMedicine, uploadMedicine } from "../../api/medicineApi";

import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { MEDICINE_CATEGORIES } from "../../utils/constants";
import toast from "react-hot-toast";

const UploadMedicinePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('details'); // 'details' | 'verifying' | 'success'
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null); // { type: 'success' | 'refusal' | 'quality', message: string }
  const [isValidated, setIsValidated] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const MAX_SCANS = 3;

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

  // Auto-calculate fair trade price (30% below MRP)
  useEffect(() => {
    if (form.originalPrice) {
      const calculatedPrice = (parseFloat(form.originalPrice) * 0.7).toFixed(2);
      if (calculatedPrice !== form.price) {
        setForm(prev => ({ ...prev, price: calculatedPrice }));
      }
    } else {
      setForm(prev => ({ ...prev, price: "" }));
    }
  }, [form.originalPrice, form.price]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAiFeedback(null);
      setIsValidated(false);
    }
  };

  const handleAIScan = async () => {
    if (!image) {
      toast.error("Please upload an image first.");
      return;
    }

    if (scanCount >= MAX_SCANS) {
      setAiFeedback({
        type: 'refusal',
        message: "Scanning limit reached for this session to ensure platform integrity. Please review your data manually or try again later."
      });
      return;
    }

    setIsScanning(true);
    setAiFeedback(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await scanMedicine(formData);
      const data = response?.data?.data;

      if (data) {
        if (data.isMedical) {
          setForm(prev => ({
            ...prev,
            name: data.name || prev.name,
            genericName: data.genericName || prev.genericName,
            manufacturer: data.manufacturer || prev.manufacturer,
            batchNumber: data.batchNumber || prev.batchNumber,
            expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : prev.expiryDate,
            originalPrice: data.mrp || prev.originalPrice,
            // Price is handled by useEffect auto-calculation
            description: data.description || prev.description
          }));

          if (data.imageQuality === 'blurry' || data.imageQuality === 'unreadable') {
            setAiFeedback({
              type: 'quality',
              message: "The medicine packaging is detected but the image is slightly blurry. This may lead to audit failures. We recommend uploading a clearer image for better trust."
            });
          } else {
            setAiFeedback({
              type: 'success',
              message: "Groq Scan Successful! Metadata and a professional description have been synchronized with your form."
            });
          }
          setIsValidated(true);
        } else {
          setAiFeedback({
            type: 'refusal',
            message: data.rejectionReason || "This product does not appear to be a medical item. Only pharmaceuticals are permitted."
          });
          setIsValidated(false);
        }
        setScanCount(prev => prev + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Groq Scan failed. Please check your connection.");
    } finally {
      setIsScanning(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please provide at least one image showing medicine packaging.");
      return;
    }

    // Only show verifying step if not already validated by manual scan
    if (!isValidated) {
      setStep('verifying');
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    // Pass extracted data to avoid redundant backend scan
    if (isValidated) {
      // Frontend Expiry Guard
      const expiryDate = new Date(form.expiryDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);

      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (isNaN(expiryDate.getTime())) {
        toast.error("Please provide a valid expiry date.");
        setLoading(false);
        return;
      }

      if (diffDays < 30) {
        toast.error(diffDays < 0
          ? "This medicine appears to be expired. It cannot be listed."
          : "Medicine must have at least 30 days of shelf life remaining.");
        setLoading(false);
        return;
      }

      const extractedData = {
        name: form.name,
        genericName: form.genericName,
        manufacturer: form.manufacturer,
        batchNumber: form.batchNumber,
        expiryDate: form.expiryDate,
        mrp: form.originalPrice,
        description: form.description
      };
      formData.append("extractedData", JSON.stringify(extractedData));
    }

    // Append other fields
    formData.append("stock", form.stock);
    formData.append("description", form.description);

    try {
      await uploadMedicine(formData);

      // If already validated, transition to success immediately
      if (isValidated) {
        setStep('success');
        setLoading(false);
      } else {
        // Just in case they didn't scan, show the animation for a bit
        setTimeout(() => {
          setStep('success');
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload listing.");
      setStep('details');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      genericName: "",
      manufacturer: "",
      category: MEDICINE_CATEGORIES[1],
      batchNumber: "",
      expiryDate: "",
      stock: 1,
      originalPrice: "",
      price: "",
      description: ""
    });
    setImage(null);
    setPreview(null);
    setAiFeedback(null);
    setIsValidated(false);
    setStep('details');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Container className="max-w-md font-sans">
          <div className="bg-card rounded-xl p-10 shadow-xl border border-border text-center">
            <div className="w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Listing Secured</h2>
            <p className="text-muted-foreground mb-8 text-[11px] leading-relaxed font-medium opacity-70">
              Your medicine has been initialized in our network. It is now undergoing <span className="text-primary font-bold">Groq Forensic Verification</span> before going public.
            </p>
            <div className="space-y-3">
              <Link to="/dashboard/my-medicines">
                <Button variant="primary" className="w-full h-12 rounded-xl shadow-lg shadow-primary/5 text-[11px] font-bold uppercase tracking-widest">
                  Manage My Listings
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl text-[11px] font-bold uppercase tracking-widest"
                onClick={resetForm}
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
        <Container className="max-w-md font-sans">
          <div className="bg-card rounded-xl p-10 shadow-xl border border-border text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-inner">
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Groq Forensic Scan</h2>
            <p className="text-muted-foreground mb-10 text-[11px] leading-relaxed font-medium opacity-70">
              Our Groq LLaVA Vision model is analyzing packaging integrity and extracting legitimate pharmaceutical metadata...
            </p>
            <div className="space-y-3 max-w-xs mx-auto">
              {[
                { label: "Packaging Integrity Check", status: "complete" },
                { label: "Batch Data Extraction", status: "complete" },
                { label: "Expiry Timeline Audit", status: "active" },
                { label: "Seller Compliance Review", status: "pending" }
              ].map((audit, i) => (
                <div key={i} className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-left opacity-80">
                  <div className={`w-1.5 h-1.5 rounded-full ${audit.status === 'complete' ? 'bg-emerald-green' : audit.status === 'active' ? 'bg-primary animate-ping' : 'bg-muted'}`} />
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
        <div className="mb-10 font-sans">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-4">
            <span className="tracking-widest opacity-60">BACK TO</span> Command Center
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Seller Gateway
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                Upload <span className="text-primary">Medicine</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-lg opacity-70">
                List unused verified medicines. Every listing requires a Groq Forensic Scan to ensure platform safety.
              </p>
            </div>
            <div className="bg-emerald-green/5 border border-emerald-green/10 px-5 py-2.5 rounded-xl flex items-center gap-3">
              <div className="text-[9px] uppercase font-bold text-emerald-green tracking-widest leading-tight opacity-80">
                100% Secure <br /> Escrow System
              </div>
              {/* Test Bypass Button */}
              <button 
                type="button"
                id="test-bypass-scan"
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    name: "Generic Paracetamol",
                    genericName: "Paracetamol",
                    manufacturer: "Micro Labs",
                    batchNumber: "B12345",
                    expiryDate: "2026-12-31",
                    originalPrice: "200",
                    description: "High quality generic paracetamol for pain relief."
                  }));
                  setPreview("https://placehold.co/400x400?text=Medicine+Scan+Mock");
                  setImage(new File([""], "mock-medicine.png", { type: "image/png" }));
                  setIsValidated(true);
                  toast.success("Test: AI Scan Bypassed");
                }}
                className="ml-4 px-3 py-1 bg-emerald-green/20 text-emerald-green text-[8px] font-bold rounded-lg border border-emerald-green/30 hover:bg-emerald-green/30 transition-all"
              >
                TEST: BYPASS SCAN
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid lg:grid-cols-5 gap-8">
          {/* Left: Image Upload Zone */}
          <div className="lg:col-span-2 space-y-6 font-sans">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h2 className="text-base font-bold text-foreground font-serif uppercase tracking-tight mb-1.5">Visual Evidence</h2>
              <p className="text-[11px] text-muted-foreground mb-8 leading-relaxed font-medium opacity-70">Verify packaging integrity with clear images.</p>

              <div
                className={`aspect-square rounded-[1.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer p-4 ${preview ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary hover:bg-muted/50'}`}
                onClick={() => document.getElementById('image-upload').click()}
              >
                {preview ? (
                  <div className="relative w-full h-full">
                    <img src={preview} alt="Medicine Preview" className="w-full h-full object-contain rounded-xl" />
                    {isScanning && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-xs font-black text-white uppercase tracking-widest">Scanning...</span>
                        </div>

                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
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

              <div className="mt-8 space-y-4">
                <Button
                  type="button"
                  variant={isValidated ? "outline" : "primary"}
                  className={`w-full h-12 rounded-xl flex gap-3 font-bold transition-all text-[11px] uppercase tracking-widest ${isValidated ? 'border-emerald-green/30 text-emerald-green' : 'shadow-lg shadow-primary/5'}`}
                  onClick={handleAIScan}
                  disabled={isScanning || !image}
                >
                  {isScanning && <span className="uppercase text-[9px] tracking-widest mr-2">SCANNING</span>}
                  {isValidated ? "Rescan Pharmaceutical" : "Run Groq Forensic Scan"}
                </Button>


                <div className="bg-muted/30 rounded-xl p-4 border border-border border-dashed font-sans">
                  <div>
                    <h4 className="text-[11px] font-bold text-foreground mb-1 uppercase tracking-tight">Forensic Protocol</h4>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed opacity-70">Groq scanning automatically extracts metadata and verifies medical legitimacy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details Form */}
          <div className="lg:col-span-3 space-y-8 font-sans">
            <div className="bg-card rounded-xl p-8 lg:p-10 border border-border shadow-sm space-y-10">
              <div>
                <h2 className="text-base font-bold text-foreground font-serif uppercase tracking-tight mb-8 flex items-center gap-3">
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
                    placeholder="Groq will extract"
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
                    className="w-full px-4 py-4 bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sans resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <h2 className="text-lg font-bold text-foreground font-serif uppercase tracking-tight mb-8 flex items-center gap-3">
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
                        className="w-full px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl focus:outline-none text-sm font-sans pl-8 text-primary font-bold cursor-not-allowed"
                        readOnly
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-emerald-green/5 border border-emerald-green/10 rounded-xl flex items-center gap-3">
                  <p className="text-[10px] font-bold text-emerald-green uppercase tracking-widest">Pricing 30% below MRP is recommended for rapid clinical redistribution.</p>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className={`w-full h-15 rounded-xl shadow-lg transition-all text-base font-bold flex gap-3 items-center justify-center group ${!isValidated && 'opacity-50 grayscale cursor-not-allowed'}`}
                disabled={loading || !isValidated}
              >
                {loading ? "Securely Initializing..." : isValidated ? "Complete Verification & List" : "Scan Image to Initialize"}
              </Button>
            </div>
          </div>
        </form>
      </Container>

      {/* Professional AI Feedback Modal (Amazon Style) */}
      {aiFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-card rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {aiFeedback.type === 'success' ? 'Verification Successful' :
                  aiFeedback.type === 'quality' ? 'Image Quality Report' : 'Verification Alert'}
              </h3>
              <button
                onClick={() => setAiFeedback(null)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                {aiFeedback.message}
              </p>
            </div>
            <div className="px-6 py-4 bg-muted/30 flex justify-end">
              <Button
                variant="primary"
                className="h-10 px-8 rounded-md text-sm font-bold"
                onClick={() => setAiFeedback(null)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMedicinePage;
