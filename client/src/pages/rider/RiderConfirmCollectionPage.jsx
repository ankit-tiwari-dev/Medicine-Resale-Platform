import { useState } from "react";
import { confirmCollection } from "../../api/riderApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";
import { FormInput } from "../../components/forms/FormInput";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";

const RiderConfirmCollectionPage = () => {
  const navigate = useNavigate();
  const [medicineId, setMedicineId] = useState("");
  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

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
          <div className="bg-card rounded-[2.5rem] p-10 shadow-xl border border-border text-center">
            <div className="w-24 h-24 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <div className="text-[10px] font-black tracking-widest uppercase text-emerald-green">SECURE</div>

            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Collection Validated</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">
              Unit lot #{medicineId.slice(-6).toUpperCase()} is now officially in your possession. Real-time tracking is active. Proceed to handover coordinates.
            </p>
            <Link to="/rider/tasks">
              <Button variant="primary" className="w-full h-14 rounded-2xl shadow-lg shadow-primary/20 text-lg font-bold">
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
        {/* Header */}
        <div className="mb-10">
          <Link to="/rider/tasks" className="inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-primary transition-colors font-black uppercase tracking-[0.2em] mb-6">
            <span className="tracking-widest">BACK TO</span> Assignments
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                DOC

                Handover Protocol
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Verify <span className="text-primary">Collection</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Formalize possession of medical units by uploading clinical proof.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-[2.5rem] p-8 lg:p-12 border border-border shadow-sm">
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

                <div className="p-5 bg-muted/20 border border-border rounded-2xl space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Compliance Checklist</p>
                  {[
                    "Verify SEAL integrity.",
                    "Check EXPIRY against label.",
                    "Inspect for lot contamination.",
                    "Secure unit in thermal bag."
                  ].map((check, i) => (
                    <div key={i} className="flex gap-3 items-center text-xs font-bold text-foreground italic">
                      <div className="w-5 h-5 bg-white border border-border rounded-md flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                      {check}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Capture Presence Proof</p>
                <div className="border-2 border-dashed border-border rounded-[2rem] h-64 flex flex-col items-center justify-center relative overflow-hidden bg-muted/10 group hover:border-primary/30 transition-all">
                  {preview ? (
                    <>
                      <img src={preview} alt="Proof" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button type="button" variant="outline" className="bg-white border-none h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex gap-2">
                          CAM Retake Photo
                        </Button>

                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-muted-foreground mb-4 group-hover:scale-110 transition-transform font-black text-xl tracking-widest uppercase text-[10px]">APP</div>

                      <p className="text-xs font-bold text-muted-foreground">Click to Open Camera</p>
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
                <div className="flex gap-2 text-[10px] text-muted-foreground font-black tracking-widest uppercase bg-muted/30 p-3 rounded-xl">
                  <div className="flex-shrink-0 mt-0.5 text-primary">INFO</div>

                  Image must contain the unit and the seller's handover location for validity.
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border border-dashed flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-black text-muted-amber uppercase">BOND</div>

                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">
                  Posession Bond <br />
                  <span className="text-foreground">Active upon submission</span>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="h-16 px-10 rounded-2xl font-bold shadow-xl shadow-primary/20 flex gap-3 items-center group"
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
