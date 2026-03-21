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
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Fleet Orchestration
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Assign <span className="text-primary">Distribution Task</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Binding certified logistics partners to validated medical assets for secure network handover.
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans">
            <div className="px-4 py-2 bg-muted/30 border border-border rounded-xl flex flex-col">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-50">Fleet Nodes</span>
              <span className="text-[11px] font-bold text-foreground tabular-nums">{riders.length} Active Partners</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={onSubmit} className="bg-card rounded-xl p-6 lg:p-8 border border-border shadow-sm space-y-8">
            <div className="space-y-3">
              <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-50 font-sans">
                Asset Identity Manifest
              </label>
              <FormInput
                id="assign-medicine-id"
                label=""
                value={form.medicineId}
                onChange={(e) => setForm(p => ({ ...p, medicineId: e.target.value }))}
                placeholder="Enter 24-char ObjectID Reference..."
                required
                className="h-10 text-[11px] font-mono tracking-tight uppercase border rounded-xl focus:ring-primary/5 font-bold"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-60">
                Target Logistics Node
              </label>

              {ridersQuery.loading ? (
                <div className="grid grid-cols-1 gap-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
                </div>
              ) : riders.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center bg-muted/5 rounded-xl border border-dashed border-border text-center p-8">
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5 opacity-60">No Active Fleet Partners</p>
                  <p className="text-[9px] text-muted-foreground opacity-40 uppercase tracking-widest">Verify KYC status in the Onboarding Gate</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 font-sans">
                  {riders.map((rider) => {
                    const rid = rider?.userId?._id || rider.userId;
                    const isSelected = form.riderId === rid;
                    return (
                      <button
                        key={rider._id}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, riderId: rid }))}
                        className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all group ${isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card hover:border-primary/20'
                          }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/50 border border-border text-foreground'}`}>
                          {rider?.userId?.name?.charAt(0) || "R"}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs font-bold uppercase tracking-tight transition-colors ${isSelected ? 'text-primary' : 'text-foreground'}`}>{rider?.userId?.name || "Rider"}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[8px] font-bold uppercase tracking-widest opacity-50 ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>Node_Status: Certified</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[7px] font-bold uppercase tracking-widest">
                            Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-border border-dashed space-y-6 font-sans">
              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 rounded-xl font-bold text-[10px] shadow-lg shadow-primary/10 flex gap-3 items-center justify-center group uppercase tracking-widest"
                loading={loading}
                disabled={!form.medicineId || !form.riderId}
              >
                Authorize Deployment
              </Button>

              {success && (
                <div className="p-4 bg-emerald-green/5 border border-emerald-green/20 rounded-xl text-[9px] font-bold text-emerald-green uppercase tracking-widest animate-in slide-in-from-top-4 italic opacity-80">
                  Protocol: Asset-Rider handshake recorded in logistics ledger.
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Protocol Sidebar */}
        <div className="space-y-6">
          <div className="bg-foreground rounded-xl p-8 text-background shadow-lg relative overflow-hidden group">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-6 opacity-60">
              Orchestration Rules
            </h3>
            <ul className="space-y-5">
              {[
                "Rider must be KYC-cleared to receive a task.",
                "Each lot can only have one active rider assignment.",
                "GPS tracking activates upon assignment."
              ].map((rule, i) => (
                <li key={i} className="flex gap-4 text-xs font-semibold uppercase tracking-widest opacity-80 leading-relaxed italic">
                  <span className="opacity-40">0{i + 1}</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {selectedRider && (
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm font-sans">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-6 opacity-50">Selected Partner</p>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center text-xl font-bold mb-4 shadow-inner leading-none">
                  {selectedRider?.userId?.name?.charAt(0) || "R"}
                </div>
                <p className="font-bold text-foreground uppercase tracking-widest text-sm">{selectedRider?.userId?.name || "Partner"}</p>
                <div className="px-4 py-1.5 bg-emerald-green/10 border border-emerald-green/20 rounded-xl text-[8px] font-bold text-emerald-green uppercase tracking-[0.2em] mt-5">
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
