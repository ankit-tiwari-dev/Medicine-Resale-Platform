import { useState, useEffect } from "react";
import { confirmCollection } from "../../api/riderApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { FormInput } from "../../components/forms/FormInput";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";

import { Link, useNavigate, useLocation } from "react-router-dom";

const RiderConfirmCollectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [medicineId, setMedicineId] = useState(location.state?.medicineId || "");
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (location.state?.medicineId) {
      setMedicineId(location.state.medicineId);
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProof(file);
      setPreview(URL.createObjectURL(file));
      toast.success("Logistics proof captured.");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!medicineId || !proof) {
      toast.error("Audit requires ID and Proof image.");
      return;
    }

    setLoading(true);
    try {
      await confirmCollection({ medicineId, proof });
      toast.success("Collection verified. Ready for transit.");
      setStep(3);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to finalize collection audit."));
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Container className="max-w-md">
          <div className="bg-card rounded-xl p-8 lg:p-10 shadow-lg shadow-black/5 border border-border text-center font-sans">
            <div className="w-16 h-16 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <div className="text-[8px] font-bold tracking-[0.2em] uppercase text-emerald-green">SECURE</div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3 tracking-tight">Collection Validated</h2>
            <p className="text-[11px] text-muted-foreground mb-8 leading-relaxed font-medium opacity-70 px-4">
              Unit lot is now in your possession. tracking is active. Proceed to handover.
            </p>
            <Link to="/rider/tasks">
              <Button variant="primary" className="w-full h-11 rounded-xl shadow-lg shadow-primary/5 text-[9px] font-bold uppercase tracking-widest">
                View Next Assignment
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
        <div className="mb-10 font-sans">
          <Link to="/rider/tasks" className="inline-flex items-center gap-2 text-[9px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-[0.2em] mb-6">
            <span className="tracking-widest opacity-60">BACK TO</span> ASSIGNMENTS
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Handover Protocol
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                Verify <span className="text-primary font-sans lowercase italic">Collection</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
                Formalize possession of medical units by uploading clinical proof.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 lg:p-10 border border-border shadow-sm font-sans">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <FormInput
                  id="task-medicine-id"
                  label="Medical Lot Reference ID"
                  value={medicineId}
                  onChange={(e) => setMedicineId(e.target.value)}
                  placeholder="Enter ID from unit label"
                  required
                />

                <div className="p-5 bg-muted/20 border border-border rounded-xl space-y-4">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-60">Compliance Checklist</p>
                  {[
                    "Verify SEAL integrity.",
                    "Check EXPIRY against label.",
                    "Inspect for lot contamination.",
                    "Secure unit in thermal bag."
                  ].map((check, i) => (
                    <div key={i} className="flex gap-3 items-center text-[10px] font-bold text-foreground italic opacity-70">
                      <div className="w-3.5 h-3.5 bg-white border border-border rounded flex items-center justify-center">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                      </div>
                      {check}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-60">Capture Presence Proof</p>
                <div className="border border-dashed border-border rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden bg-muted/10 group hover:border-primary/30 transition-all font-sans">
                  {preview ? (
                    <>
                      <img src={preview} alt="Proof" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button type="button" variant="outline" className="bg-white border-none h-10 px-4 rounded-xl font-bold uppercase tracking-widest text-[9px] flex gap-2">
                          CAM Retake Photo
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-muted-foreground mb-4 group-hover:scale-110 transition-transform font-bold text-xl tracking-widest uppercase text-[9px]">APP</div>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Click to Open Camera</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                </div>
                <div className="flex gap-2 text-[8px] text-muted-foreground font-bold tracking-widest uppercase bg-muted/30 p-3 rounded-xl opacity-40">
                  Image must contain the unit and the location.
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border border-dashed flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="text-[9px] font-bold text-muted-amber uppercase opacity-40">BOND</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight opacity-70">
                  Posession Bond <br />
                  <span className="text-foreground opacity-100">Active upon submission</span>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="h-11 px-10 rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-primary/5 flex gap-3 items-center group"
                loading={loading}
              >
                AUTHORIZE POSSESSION
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default RiderConfirmCollectionPage;
