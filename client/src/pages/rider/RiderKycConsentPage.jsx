import { useState } from "react";
import { submitKycConsent } from "../../api/kycApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";

import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ShieldPlus, Database } from "lucide-react";

const RiderKycConsentPage = () => {
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await submitKycConsent({ consentGiven });
      toast.success("Governance consent recorded.");
      navigate("/rider/kyc/upload-docs");
    } catch (error) {
      toast.error("Consent submission failed. Critical protocol error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[800px]">
        {/* Header */}
        <div className="mb-10 text-center font-sans">
          <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-3 opacity-60">
            Governance Audit
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
            Certified Partner <span className="text-primary">Consent</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-4 font-sans font-medium max-w-lg mx-auto leading-relaxed opacity-70">
            Explicit legal and operational authorization required before entering the medical distribution network.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-lg shadow-black/5 overflow-hidden font-sans">
          <div className="p-8 lg:p-10">
            <div className="space-y-8 mb-10">
              {[
                {
                  title: "Document Authenticity",
                  desc: "I swear under clinical oath that all provided identification and certification documents are legitimate and un-tampered.",
                  icon: ShieldCheck
                },
                {
                  title: "Operational Compliance",
                  desc: "I agree to adhere to MedAImart's cold-chain and medical handling protocols during all distribution assignments.",
                  icon: ShieldPlus
                },
                {
                  title: "Data Forensic Authorization",
                  desc: "I consent to the forensic analysis of my identification data through third-party government and financial verification APIs.",
                  icon: Database
                }
              ].map((point, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center flex-shrink-0">
                    <point.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-foreground mb-1 group tracking-tight">{point.title}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed opacity-70">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-8 pt-8 border-t border-border border-dashed">
              <label className="flex items-start gap-4 p-5 bg-primary/[0.03] border border-primary/10 rounded-xl cursor-pointer group hover:bg-primary/[0.05] transition-all">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  required
                />
                <div className="text-[11px] font-bold text-foreground leading-relaxed italic opacity-80">
                  I confirm that I have read the MedAImart <span className="text-primary underline">Logistics Partner Agreement</span> and consent to administrative compliance locks.
                </div>
              </label>

              <div className="flex gap-4">
                <Link to="/rider" className="flex-1">
                  <Button variant="outline" className="w-full h-11 rounded-xl border border-border font-bold text-[9px] uppercase tracking-widest">
                    Cancel Onboarding
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-[2] h-11 rounded-xl font-bold text-[9px] shadow-lg shadow-primary/5 flex gap-3 items-center justify-center group uppercase tracking-widest"
                  loading={loading}
                  disabled={!consentGiven}
                >
                  AUTHORIZE AUDIT
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-muted/30 p-6 flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border font-sans opacity-60">
            SECURE: MedAImart uses AES-256 encryption. Your data is strictly used for clinical compliance.
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderKycConsentPage;
