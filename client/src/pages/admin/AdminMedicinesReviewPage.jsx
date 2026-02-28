import { useState, useCallback, useEffect } from "react";
import { getAdminMedicines, verifyAdminMedicine } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const TABS = [
  { id: 'pending', label: 'Pending Audits', color: 'text-primary' },
  { id: 'verified', label: 'Verified Assets', color: 'text-emerald-green' },
  { id: 'rejected', label: 'Rejected Lots', color: 'text-red-500' },
  { id: 'all', label: 'Archive View', color: 'text-muted-foreground' }
];

const AdminMedicinesReviewPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const fetcher = useCallback(() => getAdminMedicines({ status: activeTab === 'all' ? undefined : activeTab }), [activeTab]);
  const query = useApiQuery(fetcher, true);
  const [searchTerm, setSearchTerm] = useState("");

  // Re-fetch when tab changes
  useEffect(() => {
    query.execute();
  }, [activeTab, query.execute]);

  const submitAction = async (medicineId, action) => {
    try {
      await verifyAdminMedicine(medicineId, { action, reason: `Institutional ${action} from Admin Control Center` });
      toast.success(`Unit ${action}d successfully`);
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Unable to process verification."));
    }
  };

  const filteredData = (query.data || []).filter(item =>
    item?.extractedData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.sellerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.extractedData?.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em] mb-8">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Forensic Asset Audit
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Verification <span className="text-primary">Gate</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Auditing AI-extracted medicine listings for pharmaceutical compliance and network safety.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search Audit Queue..."
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
              Sync Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-card p-2 rounded-[2rem] border border-border shadow-sm">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive
                ? 'bg-foreground text-background shadow-lg shadow-foreground/10'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              {tab.label}
              {query.data && (
                <span className={`ml-2 px-2 py-0.5 rounded-lg text-[9px] font-bold ${isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                  }`}>
                  {(query.data || []).filter(i => (tab.id === 'all' ? true : i.status === tab.id)).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Audit Surface */}
      <div className="bg-card border border-border rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Medical Unit Manifest</th>
                <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Provider Node</th>
                <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] text-center">Audit Status</th>
                <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Clinical Expiry</th>
                <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {query.loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-8 h-20 bg-muted/10"></td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-sm text-muted-foreground italic font-medium">
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
                    listed: { label: 'Active Listing', color: 'text-emerald-green bg-emerald-green/5 border-emerald-green/20' },
                    uploaded: { label: 'Pending AI Scan', color: 'text-muted-amber bg-muted-amber/5 border-muted-amber/20' }
                  }[status] || { label: status, color: 'text-muted-foreground bg-muted/5 border-border' };

                  return (
                    <tr key={item._id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                            {item?.extractedData?.name || "Unidentified Asset"}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            {item?.extractedData?.genericName || "Composition Review Required"}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">{item?.sellerId?.name || "Network Provider"}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Verified Level-1 Registry</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex justify-center">
                          <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${statusCfg.color}`}>
                            {statusCfg.label}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-foreground uppercase tracking-widest mb-1.5 italic">
                            {item?.extractedData?.expiryDate?.slice(0, 10) || "DATE_MISSING"}
                          </span>
                          <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-green rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-end gap-3">
                          {status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 px-4 text-emerald-green hover:bg-emerald-green hover:text-white border-2 border-emerald-green/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                                onClick={() => submitAction(item._id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 px-4 text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-500/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                                onClick={() => submitAction(item._id, "reject")}
                              >
                                Reject
                              </Button>
                              <div className="w-px h-6 bg-border mx-1" />
                            </>
                          )}
                          <Button
                            variant="outline"
                            className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 hover:bg-foreground hover:text-background transition-all"
                            onClick={() => window.open(`/browse/${item._id}`, '_blank')}
                          >
                            Evidence Vault
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
        <div className="px-10 py-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">
            Archival Audit Protection Active
          </div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest font-mono">
            Audit_Volume: {filteredData.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicinesReviewPage;
