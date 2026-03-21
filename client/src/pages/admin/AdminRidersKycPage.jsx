import { useState } from "react";
import { getPendingKycRiders, verifyRiderKyc } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
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
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Human Resource Governance
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Logistics <span className="text-primary">Onboarding Gate</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Auditing distribution partner credentials for clinical integrity and background safety.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 font-sans">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search Partner Registry..."
                className="w-full h-10 pl-4 pr-4 rounded-xl bg-card border border-border outline-none focus:border-primary/30 transition-all text-[11px] font-bold tracking-tight shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-10 px-6 rounded-xl border border-border font-bold uppercase tracking-widest text-[9px] w-full sm:w-auto hover:bg-muted/30 transition-all"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { id: 'total', label: 'Total Applications', count: riders.length },
          { id: 'pending', label: 'Pending Audits', count: riders.filter(r => r.verificationStatus === 'pending').length },
          { id: 'verified', label: 'Certified Partners', count: riders.filter(r => r.verificationStatus === 'approved').length }
        ].map(stat => (
          <div key={stat.id} className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col justify-center group hover:border-primary/20 transition-all font-sans">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 opacity-50">{stat.label}</p>
            <p className="text-xl font-bold text-foreground tracking-tight">{stat.count}</p>
          </div>
        ))}
      </div>

      {query.loading && riders.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="py-24 text-center bg-card rounded-xl border border-border shadow-sm">
          <h3 className="text-xl font-bold text-foreground uppercase tracking-widest mb-2 font-serif">Queue Clear</h3>
          <p className="text-xs text-muted-foreground font-medium italic">No distribution partner applications require forensic review at this time.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredRiders.map((rider) => (
            <div key={rider._id} className="bg-card rounded-xl p-6 lg:p-8 border border-border shadow-sm transition-all flex flex-col justify-between hover:border-primary/20">
              <div>
                <div className="flex items-center justify-between mb-8 font-sans">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center text-xl font-bold shadow-inner">
                      {rider?.userId?.name?.charAt(0) || "R"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">{rider?.userId?.name || "Anonymous Partner"}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Identity_Level_2</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="px-2 py-0.5 bg-muted/50 border border-border rounded-md text-[7px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                      AUDIT_{rider?.verificationStatus || 'PENDING'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8 font-sans">
                  <div className="p-4 bg-muted/10 border border-border rounded-xl">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-50">Docs Synchronized</p>
                    <p className="text-[9px] font-bold text-foreground italic opacity-80">10_OF_10_AUDITED</p>
                  </div>
                  <div className="p-4 bg-muted/10 border border-border rounded-xl">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-50">Risk Scoring</p>
                    <p className="text-[9px] font-bold text-foreground opacity-80">LOW_PRECISION: 0.8%</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border border-dashed flex flex-wrap items-center justify-between gap-3 font-sans">
                <div className="flex gap-2.5">
                  <Button
                    variant="outline"
                    className="h-7 px-3 text-emerald-green hover:bg-emerald-green/10 border-emerald-green/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                    onClick={() => onAction(rider._id, "approve")}
                  >
                    Authorize
                  </Button>
                  <Button
                    variant="outline"
                    className="h-7 px-3 text-red-500 hover:bg-red-500/10 border-red-500/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                    onClick={() => onAction(rider._id, "reject")}
                  >
                    Restrict
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="h-7 px-0 text-[8px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all opacity-60"
                    onClick={() => { }}
                  >
                    Vault Evidence
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Context */}
      <div className="mt-8 bg-foreground rounded-xl p-8 text-background shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
          <h4 className="text-[9px] font-bold opacity-60 uppercase tracking-widest mb-1.5">Background Protocol</h4>
          <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Partner Integrity Audit</h3>
          <p className="text-sm opacity-80 font-medium leading-relaxed italic max-w-2xl">
            Authorization triggers automated criminal record checks and Aadhaar metadata validation. Fraudulent submissions will result in immutable IP bans across the registry network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRidersKycPage;
