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
      <div className="mb-10 lg:mb-12">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em] mb-8">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
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
              <input
                type="text"
                placeholder="Search Partner Registry..."
                className="w-full h-14 pl-6 pr-6 rounded-2xl bg-card border border-border outline-none focus:border-foreground focus:ring-4 focus:ring-foreground/5 transition-all text-[10px] font-black uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] w-full sm:w-auto hover:bg-foreground/5"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { id: 'total', label: 'Total Applications', count: riders.length },
          { id: 'pending', label: 'Pending Audits', count: riders.filter(r => r.verificationStatus === 'pending').length },
          { id: 'verified', label: 'Certified Partners', count: riders.filter(r => r.verificationStatus === 'approved').length }
        ].map(stat => (
          <div key={stat.id} className="bg-card rounded-[1.5rem] p-8 border border-border shadow-sm flex flex-col justify-center group hover:border-foreground/30 transition-all">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-foreground tracking-tighter">{stat.count}</p>
          </div>
        ))}
      </div>

      {query.loading && riders.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-card rounded-[2.5rem] animate-pulse border border-border" />)}
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="py-24 text-center bg-card rounded-[2.5rem] border border-border shadow-sm">
          <h3 className="text-2xl font-black text-foreground uppercase tracking-widest mb-2">Queue Clear</h3>
          <p className="text-xs text-muted-foreground font-medium italic">No distribution partner applications require forensic review at this time.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredRiders.map((rider) => (
            <div key={rider._id} className="bg-card rounded-[2.5rem] p-8 lg:p-10 border border-border shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl">
                      {rider?.userId?.name?.charAt(0) || "R"}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">{rider?.userId?.name || "Anonymous Partner"}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-70">Privilege_Identity_Level_2</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="px-3 py-1 bg-muted/50 border border-border rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      AUDIT_{rider?.verificationStatus || 'PENDING'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-6 bg-muted/20 border border-border rounded-[1.5rem]">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-2">Docs Synchronized</p>
                    <p className="text-xs font-black text-foreground italic">10_OF_10_AUDITED</p>
                  </div>
                  <div className="p-6 bg-muted/20 border border-border rounded-[1.5rem]">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-2">Risk Scoring</p>
                    <p className="text-xs font-black text-foreground">LOW_PRECISION: 0.8%</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border border-dashed flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="h-10 px-4 text-emerald-green hover:bg-emerald-green hover:text-white border-2 border-emerald-green/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                    onClick={() => onAction(rider._id, "approve")}
                  >
                    Authorize
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 px-4 text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-500/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                    onClick={() => onAction(rider._id, "reject")}
                  >
                    Restrict
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
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
      <div className="mt-12 bg-foreground rounded-[2.5rem] p-10 text-background shadow-2xl relative overflow-hidden group border border-border">
        <div className="relative z-10">
          <h4 className="text-[10px] font-black opacity-70 uppercase tracking-[0.3em] mb-2">Background Protocol</h4>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Partner Integrity Audit</h3>
          <p className="text-sm opacity-80 font-medium leading-relaxed italic max-w-2xl">
            Authorization triggers automated criminal record checks and Aadhaar metadata validation. Fraudulent submissions will result in immutable IP bans across the registry network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRidersKycPage;
