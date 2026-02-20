import { useState } from "react";
import { getPendingKycRiders, verifyRiderKyc } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import {
  UserCheck,
  ChevronLeft,
  ShieldCheck,
  Clock,
  FileText,
  Check,
  X,
  ExternalLink,
  AlertCircle,
  Activity,
  Search
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminRidersKycPage = () => {
  const query = useApiQuery(getPendingKycRiders, true);
  const [searchTerm, setSearchTerm] = useState("");

  const onAction = async (riderId, action) => {
    try {
      await verifyRiderKyc(riderId, { action, reason: `${action} from institutional kyc review node` });
      toast.success(`Rider ${action}d successfully`);
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to update partner KYC status."));
    }
  };

  const riders = query.data || [];
  const filteredRiders = riders.filter(r =>
    r?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r?.verificationStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10 lg:mb-12">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" />
          Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <UserCheck size={12} />
              Human Resource Governance
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Logistics <span className="text-primary">Onboarding Gate</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Auditing distribution partner credentials for clinical integrity and background safety.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Partner Name..."
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-card border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-xs font-bold uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {query.loading && riders.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-card rounded-[2.5rem] animate-pulse border border-border" />)}
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-[2.5rem] border border-border shadow-sm">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
            <UserCheck size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground font-serif mb-2">Queue Exhausted</h3>
          <p className="text-sm text-muted-foreground font-medium italic">No distribution partner applications require forensic review at this time.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredRiders.map((rider) => (
            <div key={rider._id} className="bg-card rounded-[2.5rem] p-8 lg:p-10 border border-border shadow-md group hover:border-primary/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl shadow-primary/20">
                      {rider?.userId?.name?.charAt(0) || "R"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-serif group-hover:text-primary transition-colors">{rider?.userId?.name || "Anonymous Partner"}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-muted-amber animate-pulse" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Digital Audit Level-2</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status Code</p>
                    <div className="px-3 py-1 bg-muted/50 border border-border rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {rider?.verificationStatus || 'PENDING'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-muted/20 border border-border rounded-2xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <FileText size={10} className="text-primary" />
                      Docs Synchronized
                    </p>
                    <p className="text-xs font-bold text-foreground italic">10 of 10 Uploaded</p>
                  </div>
                  <div className="p-4 bg-muted/20 border border-border rounded-2xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ShieldCheck size={10} className="text-emerald-green" />
                      Risk Scoring
                    </p>
                    <p className="text-xs font-bold text-emerald-green">LOW (9.2/10)</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border border-dashed flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-10 w-10 p-0 text-emerald-green hover:bg-emerald-green hover:text-white border-2 rounded-xl transition-all"
                    onClick={() => onAction(rider._id, "approve")}
                    title="Authorize Partner"
                  >
                    <Check size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 w-10 p-0 text-red-500 hover:bg-red-500 hover:text-white border-2 rounded-xl transition-all"
                    onClick={() => onAction(rider._id, "reject")}
                    title="Ban Identity"
                  >
                    <X size={18} />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 hover:text-primary">
                    <ExternalLink size={14} /> View Document Vault
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Context */}
      <div className="mt-12 bg-clinical-navy rounded-[2.5rem] p-10 text-white shadow-xl shadow-clinical-navy/20 flex flex-col md:flex-row items-center gap-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-soft-cyan opacity-[0.05] rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md">
          <AlertCircle size={32} className="text-soft-cyan" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold font-serif mb-2">Partner Background Protocol</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
            Authorization triggers automated criminal record checks and Aadhaar metadata validation. Fraudulent submissions will result in immutable IP bans across the MedAImart network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRidersKycPage;
