import { useState, useCallback } from "react";
import {
  ClipboardCheck,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Check,
  X,
  Clock,
  ChevronLeft,
  Filter,
  ArrowRight,
  FlaskConical
} from "lucide-react";
import { getAdminMedicines, verifyAdminMedicine } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminMedicinesReviewPage = () => {
  const fetcher = useCallback(() => getAdminMedicines({ status: "pending" }), []);
  const query = useApiQuery(fetcher, true);
  const [searchTerm, setSearchTerm] = useState("");

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
    item?.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.extractedData?.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <FlaskConical size={12} />
              Asset Forensic Audit
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
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Lot Reference or Seller..."
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-card border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-xs font-bold uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-14 px-6 rounded-2xl border-2 font-bold flex items-center gap-2 w-full sm:w-auto"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              <Activity size={18} /> Refresh Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Queue Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card p-6 rounded-[1.5rem] border border-border shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Queue</p>
            <p className="text-2xl font-black text-foreground">{filteredData.length}</p>
          </div>
        </div>
      </div>

      {/* Audit Surface */}
      <div className="bg-card border border-border rounded-[2.5rem] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Medical Unit Manifest</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Provider Node</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">AI Confidence</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Clinical Expiry</th>
                <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Governance Actions</th>
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
                    The verification queue is currently clear. No pending forensic audits.
                  </td>
                </tr>
              ) : filteredData.map((item) => {
                const aiScore = item?.extractedData?.confidenceScore || 0;
                const scoreColor = aiScore > 80 ? "text-emerald-green border-emerald-green/20 bg-emerald-green/5" : "text-muted-amber border-muted-amber/20 bg-muted-amber/5";

                return (
                  <tr key={item._id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                          {item?.extractedData?.name || "Unidentified Asset"}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-1">
                          {item?.extractedData?.genericName || "Composition Review Required"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{item?.seller?.name || "Network Provider"}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <ShieldCheck size={10} className="text-emerald-green" />
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Verified Level-1</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${scoreColor}`}>
                          <Activity size={10} />
                          {aiScore}%
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground uppercase tracking-widest mb-1 italic">
                          {item?.extractedData?.expiryDate?.slice(0, 10) || "DATE_MISSING"}
                        </span>
                        <div className="h-1 w-16 bg-muted rounded-full">
                          <div className="h-1 bg-emerald-green rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          className="h-10 w-10 p-0 text-emerald-green hover:bg-emerald-green hover:text-white border-2 rounded-xl transition-all"
                          onClick={() => submitAction(item._id, "approve")}
                          title="Authorize Network Listing"
                        >
                          <Check size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 w-10 p-0 text-red-500 hover:bg-red-500 hover:text-white border-2 rounded-xl transition-all"
                          onClick={() => submitAction(item._id, "reject")}
                          title="Declare Malign Listing"
                        >
                          <X size={18} />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button
                          variant="outline"
                          className="h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border-2 hover:bg-primary hover:text-white transition-all group/btn"
                          onClick={() => window.open(`/medicines/${item._id}`, '_blank')}
                        >
                          Evidence Vault <ExternalLink size={12} className="ml-2" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Policy */}
        <div className="px-8 py-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            <ShieldAlert size={14} className="text-primary" />
            Archival Audit Trail Protection Active
          </div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
            {filteredData.length} records in current forensic window
          </p>
        </div>
      </div>
    </div>
  );
};

// Internal icon for activity
const Activity = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default AdminMedicinesReviewPage;
