import { useState } from "react";
import { uploadKycDocuments } from "../../api/kycApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";

import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IdCard, CreditCard, FileText, Car, Building2, UserSquare, CheckCircle2 } from "lucide-react";

const requiredDocs = [
  { key: "aadharFront", label: "Aadhaar Frontal", icon: IdCard },
  { key: "aadharBack", label: "Aadhaar Posterior", icon: CreditCard },
  { key: "panFront", label: "PAN Certification", icon: FileText },
  { key: "licenseFront", label: "Driving License", icon: Car },
  { key: "bankProof", label: "Payout Account Proof", icon: Building2 },
  { key: "selfie", label: "Live Identity Scan", icon: UserSquare }
];

const RiderKycUploadPage = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (key, event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setDocs(prev => ({ ...prev, [key]: file }));
      toast.success(`${key.replace(/([A-Z])/g, ' $1')} captured.`);
    }
  };

  const isComplete = requiredDocs.every(d => docs[d.key]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isComplete) {
      toast.error("Clinical audit requires a full document set.");
      return;
    }

    setLoading(true);
    try {
      await uploadKycDocuments(docs);
      toast.success("Document vault synchronized successfully.");
      navigate("/rider/kyc/verify-docs");
    } catch (error) {
      toast.error("Vault synchronization failed. Storage server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 font-sans">
          <Link to="/rider/kyc/consent" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            <span className="tracking-widest opacity-60">BACK TO</span> CONSENT
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Document Vault v1.0
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight leading-tight">
                Upload Identity <span className="text-primary">Artifacts</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
                Securely synchronize your identification assets for forensic verification.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-card rounded-xl p-8 lg:p-10 border border-border shadow-lg shadow-black/5 font-sans">
          <div className="p-6 bg-muted/30 border border-border rounded-xl flex gap-4 mb-10 font-bold text-[9px] uppercase tracking-widest text-primary">
            SECURITY PROTOCOL
            <div className="text-[10px] text-muted-foreground leading-relaxed font-medium">
              <p className="font-bold text-foreground mb-1 uppercase tracking-tight">Audit Precision Requirements</p>
              Ensure all documents are sharp, well-lit, and untruncated.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {requiredDocs.map((doc) => (
              <div key={doc.key} className={`relative group p-6 rounded-xl border border-dashed transition-all ${docs[doc.key] ? 'bg-emerald-green/5 border-emerald-green/30' : 'bg-muted/10 border-border hover:border-primary/30'}`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${docs[doc.key] ? 'bg-emerald-green text-white' : 'bg-card text-muted-foreground border border-border shadow-sm'}`}>
                    {docs[doc.key] ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <doc.icon size={18} strokeWidth={2.5} />}
                  </div>
                  <h3 className="text-[9px] font-bold text-foreground mb-1 uppercase tracking-widest">{doc.label}</h3>
                  <p className="text-[8px] text-muted-foreground font-medium truncate w-full px-4 opacity-40">
                    {docs[doc.key] ? docs[doc.key].name : "Capture Digital Copy"}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(doc.key, e)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border border-dashed flex items-center justify-between gap-6">
            <div className="hidden md:flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-[8px] ${isComplete ? 'border-emerald-green bg-emerald-green/10 text-emerald-green' : 'border-muted bg-muted/30'}`}>
                {isComplete ? '100%' : '...'}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight opacity-60">
                Vault Integrity <br />
                <span className={isComplete ? 'text-emerald-green opacity-100' : 'text-foreground opacity-100'}>{isComplete ? 'Ready for Audit' : 'Awaiting Data'}</span>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="h-11 px-10 rounded-xl font-bold text-[9px] shadow-lg shadow-primary/5 flex gap-3 items-center group uppercase tracking-widest"
              loading={loading}
              disabled={!isComplete}
            >
              SYNCHRONIZE VAULT
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default RiderKycUploadPage;
