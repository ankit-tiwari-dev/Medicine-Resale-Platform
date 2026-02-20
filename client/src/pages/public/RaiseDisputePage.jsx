import { useState } from "react";
import { raiseDispute } from "../../api/disputeApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { FormInput } from "../../components/forms/FormInput";
import { extractErrorMessage } from "../../utils/errors";
import {
  ShieldAlert,
  ChevronLeft,
  Upload,
  FileText,
  CheckCircle,
  Info,
  AlertCircle,
  Camera
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const RaiseDisputePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get("orderId") || "";

  const [form, setForm] = useState({
    orderId: orderIdParam,
    reason: "",
    description: "",
    evidence: []
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      toast.error("Cap of 5 evidence artifacts allowed.");
      return;
    }
    setForm((prev) => ({ ...prev, evidence: files }));
    toast.success(`${files.length} artifacts attached.`);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.reason || !form.description) {
      toast.error("Audit requires reason and description.");
      return;
    }

    setLoading(true);
    try {
      await raiseDispute(form);
      toast.success("Incident report initialized successfully.");
      setStep(3);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to initialize incident report."));
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Container className="max-w-md">
          <div className="bg-card rounded-[2.5rem] p-10 shadow-xl border border-border text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle size={40} className="text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Report Initialized</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">
              Your incident report has been registered in the reconciliation network. An auditor will be assigned to review the evidence within 24 clinical hours.
            </p>
            <Link to="/disputes">
              <Button variant="primary" className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 text-lg font-bold">
                Go to Resolution Center
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
        <div className="mb-10">
          <Link to="/disputes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Reconciliation
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                <ShieldAlert size={12} />
                Audit Initialization
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Raise <span className="text-primary">Incident Report</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Formally report discrepancies in pharmaceutical handovers for clinical audit.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-4 border-b border-border bg-muted/20">
            {[
              { id: 1, label: 'Metadata' },
              { id: 2, label: 'Evidence' }
            ].map((s) => (
              <div key={s.id} className={`p-5 text-[10px] font-bold uppercase tracking-widest text-center border-r border-border last:border-r-0 ${step === s.id ? 'text-primary bg-card' : 'text-muted-foreground opacity-50'}`}>
                Step 0{s.id}: {s.label}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="p-8 lg:p-12 space-y-8" noValidate>
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <FormInput
                  id="dispute-order"
                  name="orderId"
                  label="Order Reference ID"
                  value={form.orderId}
                  onChange={onChange}
                  placeholder="ORD-XXXX-XXXX"
                  required
                />

                <FormInput
                  id="dispute-reason"
                  name="reason"
                  label="Classification of Concern"
                  value={form.reason}
                  onChange={onChange}
                  placeholder="e.g. Damaged Packaging, Wrong Medicine"
                  required
                />

                <div className="space-y-1.5">
                  <label htmlFor="dispute-description" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Detailed Deposition</label>
                  <textarea
                    id="dispute-description"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="Please provide an exhaustive description of the incident for the clinical auditor."
                    rows={6}
                    className="w-full rounded-2xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                <Button
                  type="button"
                  variant="primary"
                  className="w-full h-14 rounded-2xl font-bold"
                  onClick={() => setStep(2)}
                >
                  Proceed to Evidence Collection
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 bg-muted/30 border border-border rounded-2xl flex gap-4">
                  <Info className="text-primary flex-shrink-0" size={20} />
                  <div className="text-xs text-muted-foreground leading-relaxed font-medium">
                    <p className="font-bold text-foreground mb-1">Evidence Integrity Shield</p>
                    Auditors require visual proof of damaged goods, wrong labels, or unapproved handovers. Non-tamperable photo evidence speeds up the resolution cycle.
                  </div>
                </div>

                <div className="border-2 border-dashed border-border rounded-[2rem] p-12 text-center hover:border-primary/30 transition-all group bg-muted/10 relative">
                  <input
                    id="dispute-evidence"
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center border border-border shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="text-primary" size={28} />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">Upload Evidence Artifacts</h3>
                    <p className="text-xs text-muted-foreground font-medium">Maximum 5 attachments. PNG, JPG, or PDF supported.</p>
                  </div>
                </div>

                {form.evidence.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {form.evidence.map((file, i) => (
                      <div key={i} className="bg-card border border-border p-3 rounded-xl flex flex-col items-center gap-2 overflow-hidden">
                        <FileText className="text-primary" size={20} />
                        <span className="text-[10px] font-bold truncate w-full text-center">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 flex-1 rounded-2xl"
                    onClick={() => setStep(1)}
                  >
                    Previous Step
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="h-14 flex-[2] rounded-2xl font-bold shadow-xl shadow-primary/20"
                    loading={loading}
                  >
                    Finalize Incident Report
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
};

export default RaiseDisputePage;
