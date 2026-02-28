import { useState } from "react";
import { uploadKycDocuments } from "../../api/kycApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";

import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const requiredDocs = [
  { key: "aadharFront", label: "Aadhaar Frontal", type: "ID_A" },
  { key: "aadharBack", label: "Aadhaar Posterior", type: "ID_B" },
  { key: "panFront", label: "PAN Certification", type: "TAX" },
  { key: "licenseFront", label: "Driving License", type: "DL" },
  { key: "bankProof", label: "Payout Account Proof", type: "BANK" },
  { key: "selfie", label: "Live Identity Scan", type: "FACE" }
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
        <div className="mb-10">
          <Link to="/rider/kyc/consent" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            BACK TO CONSENT
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                Document Vault v1.0
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Upload Identity <span className="text-primary">Artifacts</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Securely synchronize your identification assets for forensic verification.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-card rounded-[2.5rem] p-8 lg:p-12 border border-border shadow-sm">
          <div className="p-6 bg-muted/30 border border-border rounded-2xl flex gap-4 mb-10 font-black text-[10px] uppercase tracking-widest text-primary">
            SECURITY PROTOCOL
            <div className="text-xs text-muted-foreground leading-relaxed font-medium">
              <p className="font-bold text-foreground mb-1">Audit Precision Requirements</p>
              Ensure all documents are sharp, well-lit, and untruncated. Artifacts with glare or motion blur will be rejected by the automated forensic scanner.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {requiredDocs.map((doc) => (
              <div key={doc.key} className={`relative group p-6 rounded-2xl border-2 border-dashed transition-all ${docs[doc.key] ? 'bg-emerald-green/5 border-emerald-green/30' : 'bg-muted/10 border-border hover:border-primary/30'}`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all font-black text-[10px] ${docs[doc.key] ? 'bg-emerald-green text-white' : 'bg-card text-muted-foreground border border-border shadow-sm'}`}>
                    {docs[doc.key] ? "DONE" : doc.type}
                  </div>
                  <h3 className="text-xs font-bold text-foreground mb-1 uppercase tracking-widest">{doc.label}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium truncate w-full px-4">
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all font-black text-[8px] ${isComplete ? 'border-emerald-green bg-emerald-green/10 text-emerald-green' : 'border-muted bg-muted/30'}`}>
                {isComplete ? '100%' : '...'}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">
                Vault Integrity <br />
                <span className={isComplete ? 'text-emerald-green' : 'text-foreground'}>{isComplete ? 'Ready for Audit' : 'Awaiting Data'}</span>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="h-16 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex gap-3 items-center group"
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
