import { useState, useCallback, useEffect } from "react";
import { getAdminMedicines, verifyAdminMedicine, approveCollection } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const TABS = [
  { id: 'pending', label: 'Initial Audit', color: 'text-primary' },
  { id: 'verified', label: 'Verified Assets', color: 'text-emerald-green' },
  { id: 'collected', label: 'Collection Audit', color: 'text-soft-cyan' },
  { id: 'listed', label: 'Marketplace Active', color: 'text-emerald-green' },
  { id: 'rejected', label: 'Rejected Lots', color: 'text-red-500' },
  { id: 'all', label: 'Archive View', color: 'text-muted-foreground' }
];

const AdminMedicinesReviewPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const fetcher = useCallback(() => getAdminMedicines(), []);
  const query = useApiQuery(fetcher, true);
  const [searchTerm, setSearchTerm] = useState("");

  const submitAction = async (medicineId, action) => {
    try {
      if (action === 'approve-collection') {
        await approveCollection({ medicineId });
        toast.success("Collection approved. Medicine is now LIVE on Marketplace.");
      } else {
        await verifyAdminMedicine(medicineId, { action, reason: `Institutional ${action} from Admin Control Center` });
        toast.success(`Unit ${action}d successfully`);
      }
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to process verification."));
    }
  };

  const filteredData = (query.data || []).filter(item => {
    const matchesTab = activeTab === 'all' ? true : item.status === activeTab;
    const matchesSearch = !searchTerm || 
      item?.extractedData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.sellerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.extractedData?.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
              Forensic Asset Audit
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Verification <span className="text-primary">Gate</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Auditing AI-extracted medicine listings for pharmaceutical compliance and network safety.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 font-sans">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search Audit Queue..."
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
              Sync Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-8 bg-card p-1.5 rounded-xl border border-border shadow-sm">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all font-sans ${isActive
                ? 'bg-foreground text-background shadow-md'
                : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                }`}
            >
              {tab.label}
              {query.data && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[8px] font-bold ${isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                  }`}>
                  {(query.data || []).filter(i => (tab.id === 'all' ? true : i.status === tab.id)).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Audit Surface */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Medical Unit Manifest</th>
                <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Provider Node</th>
                <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">Audit Status</th>
                <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Clinical Expiry</th>
                <th className="px-6 py-4 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {query.loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6 h-20 bg-muted/10"></td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-xs text-muted-foreground italic font-medium">
                    The {activeTab} queue is currently clear. No pending forensic audits.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const status = item?.status?.toLowerCase();
                  const statusCfg = {
                    pending: { label: 'Under AI Audit', color: 'text-primary bg-primary/5 border-primary/20' },
                    verified: { label: 'Verified Safe', color: 'text-emerald-green bg-emerald-green/5 border-emerald-green/20' },
                    rejected: { label: 'Audit Failed', color: 'text-red-500 bg-red-500/5 border-red-500/20' },
                    collected: { label: 'Rider Collected', color: 'text-soft-cyan bg-soft-cyan/5 border-soft-cyan/20' },
                    listed: { label: 'Marketplace LIVE', color: 'text-emerald-green bg-emerald-green/5 border-emerald-green/20' },
                    uploaded: { label: 'Pending AI Scan', color: 'text-muted-amber bg-muted-amber/5 border-muted-amber/20' },
                    pickup_assigned: { label: 'In Transit/Pickup', color: 'text-muted-foreground bg-muted/5 border-border' }
                  }[status] || { label: status, color: 'text-muted-foreground bg-muted/5 border-border' };

                  return (
                    <tr key={item._id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col font-sans">
                          <span className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                            {item?.extractedData?.name || "Unidentified Asset"}
                          </span>
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-50">
                            {item?.extractedData?.genericName || "Composition Review Required"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col font-sans">
                          <span className="text-xs font-bold text-foreground">{item?.sellerId?.name || "Network Provider"}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">Verified Registry</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${statusCfg.color}`}>
                            {statusCfg.label}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col font-sans">
                          <span className="text-[9px] font-bold text-foreground uppercase tracking-widest mb-1.5 opacity-60">
                            {item?.extractedData?.expiryDate?.slice(0, 10) || "DATE_MISSING"}
                          </span>
                          <div className="h-0.5 w-16 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-green/40 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 font-sans">
                          {status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-emerald-green hover:bg-emerald-green/10 border-emerald-green/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                                onClick={() => submitAction(item._id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-red-500 hover:bg-red-500/10 border-red-500/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                                onClick={() => submitAction(item._id, "reject")}
                              >
                                Reject
                              </Button>
                              <div className="w-px h-4 bg-border mx-1" />
                            </>
                          )}

                          {status === 'collected' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-primary hover:bg-primary/10 border-primary/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                                onClick={() => window.open(item.pickupProof, '_blank')}
                              >
                                View Proof
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-3 text-emerald-green hover:bg-emerald-green/10 border-emerald-green/20 rounded-lg transition-all text-[8px] font-bold uppercase tracking-widest"
                                onClick={() => submitAction(item._id, "approve-collection")}
                              >
                                Approve Collection
                              </Button>
                              <div className="w-px h-4 bg-border mx-1" />
                            </>
                          )}

                          <Button
                            variant="outline"
                            className="h-7 px-4 rounded-lg text-[8px] font-bold uppercase tracking-widest border border-border hover:bg-muted/30 transition-all opacity-60"
                            onClick={() => window.open(`/browse/${item._id}`, '_blank')}
                          >
                            {status === 'listed' ? 'Market View' : 'Vault'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Policy */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
            Archival Audit Protection Active
          </div>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest font-mono opacity-60">
            Audit_Volume: {filteredData.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicinesReviewPage;
