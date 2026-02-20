import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { confirmOrderDelivery } from "../../api/orderApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { extractErrorMessage } from "../../utils/errors";
import {
  CheckCircle,
  Shield,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Lock,
  ArrowRight
} from "lucide-react";
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
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Container className="max-w-md">
          <div className="bg-card rounded-[2.5rem] p-10 shadow-xl border border-border text-center">
            <div className="w-24 h-24 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShieldCheck size={40} className="text-emerald-green" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Handover Verified</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">
              The procurement cycle is now complete. The escrowed funds have been released to the seller's clinical account. Thank you for using MedAImart.
            </p>
            <Link to="/dashboard/orders">
              <Button variant="primary" className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 text-lg font-bold">
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
      <Container className="py-8 lg:py-12 max-w-[800px]">
        {/* Header */}
        <div className="mb-10 lg:text-center">
          <Link to={`/buyer/orders/${id}/tracking`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Pulse
          </Link>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">
              <FileCheck size={14} />
              Procurement Closure
            </div>
            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-foreground max-w-lg leading-tight lg:mx-auto">
              Declare Successful <span className="text-primary">Medical Handover</span>
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch pt-4">
          {/* Security Declaration */}
          <div className="bg-card rounded-[2.5rem] p-8 lg:p-10 border border-border shadow-sm flex flex-col">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Pre-Closure Audit
            </h3>
            <div className="space-y-4 flex-1">
              {[
                "Physical packaging is intact and untampered.",
                "Medicine batches match the AI forensic scan.",
                "Expiry dates verified for clinical safety.",
                "Instructional literature included in unit."
              ].map((audit, i) => (
                <div key={i} className="flex gap-4 p-4 bg-muted/20 border border-border rounded-xl">
                  <div className="w-5 h-5 rounded-md bg-white border border-border flex items-center justify-center mt-0.5 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-green" />
                  </div>
                  <p className="text-xs font-bold text-foreground leading-relaxed italic">{audit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-primary rounded-[2.5rem] p-8 lg:p-10 text-primary-foreground flex flex-col justify-between shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 font-serif flex items-center gap-3">
                <Lock className="text-soft-cyan" size={24} />
                Escrow Release
              </h3>
              <p className="text-sm opacity-80 leading-relaxed mb-10 font-medium">
                By authorizing this closure, you confirm receipt of the medical unit in valid clinical condition. This action is <span className="text-soft-cyan underline font-bold uppercase tracking-widest">Permanent</span> and will trigger instant capital release to the seller.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl border border-white/10 mb-6">
                <AlertCircle size={16} className="text-soft-cyan" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Final verification required</span>
              </div>
              <Button
                variant="primary"
                className="w-full h-16 bg-white text-primary rounded-2xl shadow-xl hover:bg-slate-100 transition-all text-lg font-black flex gap-3 items-center justify-center group"
                onClick={onConfirm}
                loading={loading}
              >
                AUTHORIZE RELEASE
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ConfirmDeliveryPage;
