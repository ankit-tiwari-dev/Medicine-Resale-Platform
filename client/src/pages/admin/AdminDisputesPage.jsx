import { useState, useCallback } from "react";
import { getDisputes, resolveDispute } from "../../api/disputeApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const AdminDisputesPage = () => {
  const fetcher = useCallback(() => getDisputes(), []);
  const query = useApiQuery(fetcher, true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionData, setResolutionData] = useState({ resolution: "refund", adminComment: "" });
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleResolve = async () => {
    if (!selectedDispute) return;
    setActionLoading(true);
    try {
      await resolveDispute(selectedDispute._id, resolutionData);
      toast.success("Dispute resolution protocol finalized.");
      setShowResolveModal(false);
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Resolution command failed."));
    } finally {
      setActionLoading(false);
    }
  };

  const disputes = query.data || [];

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
              Governance & Arbitration
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Dispute <span className="text-primary">Resolution Node</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Auditing protocol violations, transaction disputes, and clinical integrity reports.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 px-6 rounded-xl border border-border font-bold uppercase tracking-widest text-[9px] hover:bg-muted/30 transition-all font-sans"
            onClick={() => query.execute()}
            loading={query.loading}
          >
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Disputes List */}
      {query.loading && disputes.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : disputes.length === 0 ? (
        <div className="py-24 text-center bg-card rounded-xl border border-border shadow-sm font-sans">
          <h3 className="text-xl font-bold text-foreground uppercase tracking-widest mb-2">Arbitration Queue Clear</h3>
          <p className="text-xs text-muted-foreground font-medium italic">No active disputes require institutional intervention at this cycle.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {disputes.map((dispute) => (
            <div key={dispute._id} className="bg-card rounded-xl p-8 border border-border shadow-sm flex flex-col lg:flex-row gap-8 transition-all hover:border-primary/10">
              <div className="flex-1 font-sans">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-2 py-0.5 rounded-md border text-[7px] font-bold uppercase tracking-widest ${dispute.status === 'pending' ? 'bg-muted-amber/10 text-muted-amber border-muted-amber/20' : 'bg-emerald-green/10 text-emerald-green border-emerald-green/20'}`}>
                    STATUS_{dispute.status?.toUpperCase() || 'PENDING'}
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">#{dispute._id?.slice(-8).toUpperCase()}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-tight mb-2">Reason: {dispute.reason}</h3>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed mb-6 opacity-80">{dispute.description}</p>
                
                <div className="flex flex-wrap gap-6 border-t border-border border-dashed pt-6">
                  <div>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-40">Original Order</p>
                    <Link to={`/admin/orders`} className="text-[10px] font-bold text-primary hover:underline">View Order Context</Link>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-40">Evidence Count</p>
                    <p className="text-[10px] font-bold text-foreground">{(dispute.evidence || []).length} Verified Assets</p>
                  </div>
                </div>
              </div>

              {dispute.status === 'pending' && (
                <div className="lg:w-64 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border border-dashed pt-8 lg:pt-0 lg:pl-8 font-sans">
                  <Button
                    variant="primary"
                    className="h-11 w-full rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg shadow-primary/5"
                    onClick={() => {
                      setSelectedDispute(dispute);
                      setShowResolveModal(true);
                    }}
                  >
                    Resolve Dispute
                  </Button>
                  <p className="text-[8px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-40">Institutional override active</p>
                </div>
              )}
              {dispute.status === 'resolved' && (
                <div className="lg:w-64 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border border-dashed pt-8 lg:pt-0 lg:pl-8 font-sans text-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-2 opacity-40">Resolution</p>
                  <p className="text-[10px] font-bold text-emerald-green uppercase tracking-widest mb-1">{dispute.resolution}</p>
                  <p className="text-[10px] font-bold text-foreground italic">"{dispute.adminComment || 'Closure finalized'}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      <ConfirmationModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onConfirm={handleResolve}
        title="Finalize Dispute Resolution"
        message={`Authorize a final settlement for Dispute #${selectedDispute?._id?.slice(-8).toUpperCase()}. This decision is legally binding and immutable.`}
        confirmLabel="Authorize Closure"
        cancelLabel="Abort"
        loading={actionLoading}
      >
        <div className="mt-4 space-y-4 font-sans text-left">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Resolution Verdict</label>
            <select
              className="w-full h-10 px-3 rounded-xl bg-muted/50 border border-border text-xs font-bold outline-none"
              value={resolutionData.resolution}
              onChange={(e) => setResolutionData(prev => ({ ...prev, resolution: e.target.value }))}
            >
              <option value="refund">Full Capital Refund</option>
              <option value="rejected">Dispute Rejected (Funds Released)</option>
              <option value="partial_refund">Partial Compensation</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Audit Comment</label>
            <textarea
              placeholder="Provide clinical or logistical reasoning for this verdict..."
              className="w-full h-24 p-4 rounded-xl bg-muted/50 border border-border text-xs font-medium outline-none"
              value={resolutionData.adminComment}
              onChange={(e) => setResolutionData(prev => ({ ...prev, adminComment: e.target.value }))}
            />
          </div>
        </div>
      </ConfirmationModal>

      {/* Governance Context */}
      <div className="mt-8 bg-clinical-navy rounded-xl p-8 text-white relative overflow-hidden group shadow-xl">
        <div className="relative z-10">
          <h4 className="text-[9px] font-bold opacity-60 uppercase tracking-widest mb-1.5">Arbitration Protocol</h4>
          <h3 className="font-serif text-xl font-bold uppercase tracking-tight mb-3">Institutional Fairness Mandate</h3>
          <p className="text-sm opacity-80 font-medium leading-relaxed italic max-w-2xl">
            Admin nodes are empowered to override transaction states to protect network integrity. All resolutions must be backed by evidence found in the clinical audit trail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDisputesPage;
