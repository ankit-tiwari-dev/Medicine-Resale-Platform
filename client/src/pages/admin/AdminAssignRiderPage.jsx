import { useState } from "react";
import { assignRiderToMedicine, getAvailableRiders } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import {
  Truck,
  ChevronLeft,
  UserCheck,
  Package,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Activity,
  CheckCircle
} from "lucide-react";
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
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" />
          Admin Terminal
        </Link>
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
            <Truck size={12} />
            Logistics Orchestration
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Assign <span className="text-primary">Distribution Task</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-sans font-medium">
            Bind a certified logistics partner to a validated medical asset lot.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={onSubmit} className="bg-card rounded-[2.5rem] p-8 lg:p-12 border border-border shadow-md space-y-8">
            <FormInput
              id="assign-medicine-id"
              label="Medical Lot Reference ID"
              value={form.medicineId}
              onChange={(e) => setForm(p => ({ ...p, medicineId: e.target.value }))}
              placeholder="e.g. 60a7..."
              required
            />

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                Select Certified Partner
              </label>

              {ridersQuery.loading ? (
                <div className="h-16 bg-muted rounded-2xl animate-pulse" />
              ) : riders.length === 0 ? (
                <div className="h-16 flex items-center justify-center bg-muted/20 rounded-2xl border border-dashed border-border text-xs text-muted-foreground font-medium italic">
                  No active fleet partners. Verify KYC approvals.
                </div>
              ) : (
                <div className="space-y-3">
                  {riders.map((rider) => {
                    const rid = rider?.userId?._id || rider.userId;
                    const isSelected = form.riderId === rid;
                    return (
                      <button
                        key={rider._id}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, riderId: rid }))}
                        className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${isSelected
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border bg-muted/10 hover:border-primary/30'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black transition-all ${isSelected ? 'bg-primary text-white' : 'bg-card border border-border text-foreground shadow-sm'}`}>
                          {rider?.userId?.name?.charAt(0) || "R"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground">{rider?.userId?.name || "Rider"}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <ShieldCheck size={10} className="text-emerald-green" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Certified Active</span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle size={20} className="text-primary flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-border border-dashed flex items-center gap-6">
              <Button
                type="submit"
                variant="primary"
                className="flex-1 h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 flex gap-3 items-center justify-center group"
                loading={loading}
                disabled={!form.medicineId || !form.riderId}
              >
                EXECUTE ASSIGNMENT
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>

            {success && (
              <div className="p-5 bg-emerald-green/10 border border-emerald-green/20 rounded-2xl flex items-center gap-4 text-sm font-bold text-emerald-green">
                <CheckCircle size={20} />
                Lot-to-Rider binding recorded in logistics ledger.
              </div>
            )}
          </form>
        </div>

        {/* Protocol Sidebar */}
        <div className="space-y-6">
          <div className="bg-clinical-navy rounded-[2rem] p-8 text-white shadow-xl shadow-clinical-navy/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-green opacity-[0.05] rounded-full blur-[80px] -mr-24 -mt-24"></div>
            <h3 className="text-sm font-bold font-serif mb-6 flex items-center gap-3">
              <Activity size={18} className="text-soft-cyan" />
              Orchestration Rules
            </h3>
            <ul className="space-y-4">
              {[
                "Rider must be KYC-cleared to receive a task.",
                "Each lot can only have one active rider assignment.",
                "GPS tracking activates upon assignment."
              ].map((rule, i) => (
                <li key={i} className="flex gap-3 text-xs text-slate-400 font-medium leading-relaxed">
                  <div className="w-1 h-1 rounded-full bg-soft-cyan mt-2 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {selectedRider && (
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Selected Partner</p>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-4 shadow-lg shadow-primary/20">
                  {selectedRider?.userId?.name?.charAt(0) || "R"}
                </div>
                <p className="font-bold text-foreground font-serif text-lg">{selectedRider?.userId?.name || "Partner"}</p>
                <div className="px-4 py-1.5 bg-emerald-green/10 border border-emerald-green/20 rounded-lg text-[10px] font-bold text-emerald-green uppercase tracking-[0.2em] mt-4">
                  Cleared for Dispatch
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
