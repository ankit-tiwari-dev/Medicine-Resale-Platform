import { useState } from "react";
import { assignRiderToMedicine, getAvailableRiders } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const AdminAssignRiderPage = () => {
  const ridersQuery = useApiQuery(getAvailableRiders, true);
  const [form, setForm] = useState({ medicineId: "", riderId: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const riders = ridersQuery.data || [];

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.medicineId || !form.riderId) {
      toast.error("Both Lot ID and Rider assignment are required.");
      return;
    }
    setLoading(true);
    try {
      await assignRiderToMedicine(form);
      toast.success("Rider synchronized with medical lot.");
      setSuccess(true);
      setForm({ medicineId: "", riderId: "" });
    } catch (error) {
      toast.error(extractErrorMessage(error, "Orchestration command failed."));
    } finally {
      setLoading(false);
    }
  };

  const selectedRider = riders.find(r => (r?.userId?._id || r.userId) === form.riderId);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-12">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em] mb-8">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Fleet Orchestration
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Assign <span className="text-primary">Distribution Task</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium max-w-2xl">
              Binding certified logistics partners to validated medical assets for secure network handover.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-3 bg-muted/30 border border-border rounded-2xl flex flex-col">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Fleet Node Overview</span>
              <span className="text-xs font-bold text-foreground tabular-nums">{riders.length} Active Partners</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={onSubmit} className="bg-card rounded-[2.5rem] p-8 lg:p-12 border border-border shadow-md space-y-10">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">
                Asset Identity Manifest
              </label>
              <FormInput
                id="assign-medicine-id"
                label=""
                value={form.medicineId}
                onChange={(e) => setForm(p => ({ ...p, medicineId: e.target.value }))}
                placeholder="Enter 24-char ObjectID Reference..."
                required
                className="h-16 text-sm font-mono tracking-widest uppercase border-2 focus:ring-primary/5"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">
                Target Logistics Node
              </label>

              {ridersQuery.loading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />)}
                </div>
              ) : riders.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center bg-muted/5 rounded-[2.5rem] border border-dashed border-border text-center p-10">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-2">No Active Fleet Partners</p>
                  <p className="text-[10px] text-muted-foreground opacity-60 uppercase tracking-widest">Verify KYC status in the Onboarding Gate</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {riders.map((rider) => {
                    const rid = rider?.userId?._id || rider.userId;
                    const isSelected = form.riderId === rid;
                    return (
                      <button
                        key={rider._id}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, riderId: rid }))}
                        className={`w-full p-6 rounded-2xl border-2 text-left flex items-center gap-6 transition-all group ${isSelected
                          ? 'border-foreground bg-foreground shadow-2xl scale-[1.02]'
                          : 'border-border bg-card hover:border-foreground/30'
                          }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${isSelected ? 'bg-background text-foreground' : 'bg-muted/50 border border-border text-foreground'}`}>
                          {rider?.userId?.name?.charAt(0) || "R"}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-background' : 'text-foreground'}`}>{rider?.userId?.name || "Rider"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-black uppercase tracking-[0.15em] opacity-70 ${isSelected ? 'text-background' : 'text-muted-foreground'}`}>Node_Status: Certified</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="px-3 py-1 rounded-lg bg-background/20 text-background text-[9px] font-black uppercase tracking-widest">
                            Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-10 border-t border-border border-dashed space-y-6">
              <Button
                type="submit"
                variant="primary"
                className="w-full h-18 rounded-2xl font-black text-lg shadow-2xl flex gap-4 items-center justify-center group py-8 uppercase tracking-[0.2em]"
                loading={loading}
                disabled={!form.medicineId || !form.riderId}
              >
                Authorize Deployment
              </Button>

              {success && (
                <div className="p-8 bg-emerald-green/5 border-2 border-emerald-green/20 rounded-[2rem] text-[10px] font-black text-emerald-green uppercase tracking-[0.2em] animate-in slide-in-from-top-4">
                  Protocol: Asset-Rider handshake recorded in logistics ledger.
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Protocol Sidebar */}
        <div className="space-y-6">
          <div className="bg-foreground rounded-[2.5rem] p-10 text-background shadow-2xl relative overflow-hidden group border border-border">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-70">
              Orchestration Rules
            </h3>
            <ul className="space-y-6">
              {[
                "Rider must be KYC-cleared to receive a task.",
                "Each lot can only have one active rider assignment.",
                "GPS tracking activates upon assignment."
              ].map((rule, i) => (
                <li key={i} className="flex gap-4 text-xs font-black uppercase tracking-widest opacity-80 leading-relaxed italic">
                  <span className="opacity-40">0{i + 1}</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {selectedRider && (
            <div className="bg-card rounded-[2.5rem] p-10 border border-border shadow-md">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-8">Selected Partner</p>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-foreground text-background rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-xl leading-none">
                  {selectedRider?.userId?.name?.charAt(0) || "R"}
                </div>
                <p className="font-black text-foreground uppercase tracking-widest text-lg">{selectedRider?.userId?.name || "Partner"}</p>
                <div className="px-5 py-2 bg-emerald-green/10 border border-emerald-green/20 rounded-xl text-[9px] font-black text-emerald-green uppercase tracking-[0.3em] mt-6">
                  Dispatch Clear
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAssignRiderPage;
