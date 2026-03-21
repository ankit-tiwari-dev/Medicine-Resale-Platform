import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { confirmOrderDelivery } from "../../api/orderApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";


const ConfirmDeliveryPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const onConfirm = async () => {
    setLoading(true);
    setStatus('loading');
    try {
      await confirmOrderDelivery(id);
      setStatus('success');
      toast.success("Delivery Confirmed. Escrow release triggered.");
    } catch (error) {
      setStatus('idle');
      toast.error(extractErrorMessage(error, "Unable to finalize delivery declaration."));
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6 font-sans">
        <Container className="max-w-md">
          <div className="bg-card rounded-xl p-10 shadow-xl border border-border text-center">
            <div className="w-16 h-16 bg-emerald-green/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner font-bold text-[9px] text-emerald-green uppercase tracking-[0.2em] opacity-80">
              SECURE
            </div>

            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Handover Verified</h2>
            <p className="text-muted-foreground mb-8 text-[11px] leading-relaxed font-medium opacity-70">
              The procurement cycle is now complete. The escrowed funds have been released to the seller's clinical account. Thank you for using MedAImart.
            </p>
            <Link to="/dashboard/orders">
              <Button variant="primary" className="w-full h-11 rounded-xl shadow-lg shadow-primary/10 text-xs font-bold uppercase tracking-widest">
                Return to History
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[800px] font-sans">
        {/* Header */}
        <div className="mb-10 lg:text-center">
          <Link to={`/buyer/orders/${id}/tracking`} className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-6">
            BACK TO Pulse
          </Link>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.3em] mb-4 opacity-60">
              Procurement Closure
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground max-w-lg leading-tight lg:mx-auto">
              Declare Successful <span className="text-primary">Medical Handover</span>
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch pt-4">
          {/* Security Declaration */}
          <div className="bg-card rounded-xl p-8 lg:p-10 border border-border shadow-sm flex flex-col">
            <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2 opacity-50">
              PRE-CLOSURE AUDIT
            </h3>
            <div className="space-y-3 flex-1">
              {[
                "Physical packaging is intact and untampered.",
                "Medicine batches match the AI forensic scan.",
                "Expiry dates verified for clinical safety.",
                "Instructional literature included in unit."
              ].map((audit, i) => (
                <div key={i} className="flex gap-4 p-4 bg-muted/5 border border-border rounded-xl">
                  <div className="w-5 h-5 rounded-md bg-background border border-border flex items-center justify-center mt-0.5 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-green opacity-60" />
                  </div>
                  <p className="text-[11px] font-bold text-foreground leading-relaxed italic opacity-70">{audit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-foreground rounded-xl p-8 lg:p-10 text-background flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6 font-serif flex items-center gap-3">
                <span className="text-primary text-[8px] font-bold uppercase tracking-[0.3em]">Institutional</span>
                Escrow Release
              </h3>
              <p className="text-[11px] opacity-70 leading-relaxed mb-10 font-medium italic">
                By authorizing this closure, you confirm receipt of the medical unit in valid clinical condition. This action is Permanent and will trigger instant capital release.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5 mb-6">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-50">Final verification required</span>
              </div>
              <Button
                variant="primary"
                className="w-full h-12 bg-white text-foreground rounded-xl shadow-xl hover:bg-white/90 transition-all text-sm font-bold flex gap-3 items-center justify-center group uppercase tracking-widest"
                onClick={onConfirm}
                loading={loading}
              >
                Authorize Release
              </Button>

            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ConfirmDeliveryPage;
