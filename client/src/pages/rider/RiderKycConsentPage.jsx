import { useState } from "react";
import { submitKycConsent } from "../../api/kycApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import {
  ShieldCheck,
  FileText,
  CheckSquare,
  ChevronLeft,
  Lock,
  Info,
  UserCheck,
  Scale,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

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
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">
            <Scale size={14} />
            Clinical Governance
          </div>
          <h1 className="text-3xl lg:text-5xl font-serif font-bold text-foreground">
            Certified Partner <span className="text-primary">Consent</span>
          </h1>
          <p className="text-muted-foreground mt-4 font-sans font-medium max-w-lg mx-auto leading-relaxed">
            Explicit legal and operational authorization required before entering the medical distribution network.
          </p>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="space-y-8 mb-10">
              {[
                {
                  title: "Document Authenticity",
                  desc: "I swear under clinical oath that all provided identification and certification documents are legitimate and un-tampered.",
                  icon: FileText
                },
                {
                  title: "Operational Compliance",
                  desc: "I agree to adhere to MedAImart's cold-chain and medical handling protocols during all distribution assignments.",
                  icon: ShieldCheck
                },
                {
                  title: "Data Forensic Authorization",
                  desc: "I consent to the forensic analysis of my identification data through third-party government and financial verification APIs.",
                  icon: Lock
                }
              ].map((point, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                    <point.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1 group">{point.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-8 pt-8 border-t border-border border-dashed">
              <label className="flex items-start gap-4 p-6 bg-primary/[0.03] border border-primary/10 rounded-2xl cursor-pointer group hover:bg-primary/[0.05] transition-all">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-md border-border text-primary focus:ring-primary"
                  required
                />
                <div className="text-sm font-bold text-foreground leading-relaxed italic">
                  I confirm that I have read the MedAImart <span className="text-primary underline">Logistics Partner Agreement</span> and consent to administrative compliance locks.
                </div>
              </label>

              <div className="flex gap-4">
                <Link to="/rider" className="flex-1">
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-2 font-bold">
                    Cancel Onboarding
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-[2] h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex gap-3 items-center justify-center group"
                  loading={loading}
                  disabled={!consentGiven}
                >
                  AUTHORIZE AUDIT
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-muted/30 p-6 flex items-center gap-4 text-xs font-medium text-muted-foreground italic border-t border-border">
            <Info size={16} className="text-primary flex-shrink-0" />
            MedAImart uses AES-256 encryption for all document storage. Your data is strictly used for clinical compliance.
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderKycConsentPage;
