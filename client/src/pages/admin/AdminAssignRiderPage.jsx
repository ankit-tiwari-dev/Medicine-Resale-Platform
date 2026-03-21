import { useState, useCallback } from "react";
import { assignRiderToMedicine, getAvailableRiders, getAdminMedicines } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Search, Package, CheckCircle2, Truck, RotateCcw, X } from "lucide-react";

const AdminAssignRiderPage = () => {
  const ridersQuery = useApiQuery(getAvailableRiders, true);
  const medicinesQuery = useApiQuery(useCallback(() => getAdminMedicines({ status: "verified" }), []), true);

  // Multi-select: store selected medicine IDs in a Set
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRiderId, setSelectedRiderId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAssigned, setLastAssigned] = useState(null);

  const riders = ridersQuery.data || [];
  const allMedicines = medicinesQuery.data || [];

  const medicines = allMedicines.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m?.extractedData?.name?.toLowerCase().includes(q) ||
      m?.extractedData?.genericName?.toLowerCase().includes(q) ||
      m?.sellerId?.name?.toLowerCase().includes(q)
    );
  });

  const selectedRider = riders.find(r => (r?.userId?._id || r.userId) === selectedRiderId);
  const selectedMedicines = allMedicines.filter(m => selectedIds.has(m._id));

  const toggleMedicine = (med) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(med._id)) {
        next.delete(med._id);
      } else {
        next.add(med._id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (medicines.every(m => selectedIds.has(m._id))) {
      // Deselect all visible
      setSelectedIds(prev => {
        const next = new Set(prev);
        medicines.forEach(m => next.delete(m._id));
        return next;
      });
    } else {
      // Select all visible
      setSelectedIds(prev => {
        const next = new Set(prev);
        medicines.forEach(m => next.add(m._id));
        return next;
      });
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectedRiderId("");
    setLastAssigned(null);
  };

  const onSubmit = async () => {
    if (selectedIds.size === 0 || !selectedRiderId) {
      toast.error("Select at least one medicine and a rider.");
      return;
    }
    setLoading(true);
    let successCount = 0;
    let failCount = 0;
    try {
      // Batch assign all selected medicines sequentially
      for (const medicineId of selectedIds) {
        try {
          await assignRiderToMedicine({ medicineId, riderId: selectedRiderId });
          successCount++;
        } catch {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} medicine${successCount > 1 ? "s" : ""} assigned to ${selectedRider?.userId?.name || "rider"} successfully!`);
        setLastAssigned({ count: successCount, rider: selectedRider });
      }
      if (failCount > 0) {
        toast.error(`${failCount} assignment${failCount > 1 ? "s" : ""} failed.`);
      }
      setSelectedIds(new Set());
      setSelectedRiderId("");
      await medicinesQuery.execute();
    } finally {
      setLoading(false);
    }
  };

  const allVisible = medicines.length > 0 && medicines.every(m => selectedIds.has(m._id));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Fleet Orchestration
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Assign <span className="text-primary">Distribution Tasks</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Select one or more verified medicines, pick a rider, then deploy all at once.
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans">
            <div className="px-4 py-2 bg-muted/30 border border-border rounded-xl flex flex-col">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-50">Pending Pickups</span>
              <span className="text-[11px] font-bold text-foreground tabular-nums">{allMedicines.length} To Assign</span>
            </div>
            <div className="px-4 py-2 bg-muted/30 border border-border rounded-xl flex flex-col">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1 opacity-50">Active Riders</span>
              <span className="text-[11px] font-bold text-foreground tabular-nums">{riders.length} Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {lastAssigned && (
        <div className="mb-6 p-4 bg-emerald-green/5 border border-emerald-green/20 rounded-xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2 font-sans">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-green flex-shrink-0" />
            <p className="text-xs font-bold text-emerald-green">
              {lastAssigned.count} medicine{lastAssigned.count > 1 ? "s" : ""} assigned to <span className="text-foreground">{lastAssigned.rider?.userId?.name}</span>
            </p>
          </div>
          <button onClick={clearSelection} className="text-[9px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest flex items-center gap-1.5 transition-colors">
            <RotateCcw size={9} /> Reset
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── Step 1: Medicine Selection ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest opacity-70">Step 01</p>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-tight font-sans">Select Medicines</h2>
            </div>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-[9px] font-bold uppercase tracking-widest">
                  {selectedIds.size} selected
                </div>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-[9px] font-bold text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <X size={10} /> Clear
                </button>
              </div>
            )}
          </div>

          {/* Search + Select All row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" />
              <input
                type="text"
                placeholder="Search by name, generic, or seller..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border outline-none focus:border-primary/40 transition-all text-xs font-medium shadow-sm"
              />
            </div>
            {medicines.length > 0 && (
              <button
                onClick={toggleAll}
                className={`h-10 px-4 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all flex-shrink-0 ${
                  allVisible
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {allVisible ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>

          {/* Medicine List */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {medicinesQuery.loading ? (
              <div className="space-y-px">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-muted/10 animate-pulse border-b border-border last:border-0" />)}
              </div>
            ) : medicines.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <Package size={24} className="text-muted-foreground opacity-20" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                  {search ? "No results for your search" : "No verified medicines awaiting pickup"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border overflow-y-auto max-h-[500px] no-scrollbar">
                {medicines.map(med => {
                  const isSelected = selectedIds.has(med._id);
                  return (
                    <button
                      key={med._id}
                      type="button"
                      onClick={() => toggleMedicine(med)}
                      className={`w-full text-left px-4 py-3.5 flex items-center gap-4 transition-all group ${
                        isSelected ? "bg-primary/10" : "hover:bg-muted/40"
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                      }`}>
                        {isSelected && <CheckCircle2 size={12} className="text-primary-foreground" />}
                      </div>
                      <a
                        href={`/browse/${med._id}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View medicine details"
                        onClick={e => e.stopPropagation()}
                        className={`w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden border transition-all relative group/img hover:ring-2 hover:ring-primary/50 cursor-pointer ${
                          isSelected ? "border-primary/40 ring-2 ring-primary/20" : "border-border"
                        }`}
                      >
                        <img
                          src={med.images?.[0] || med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=100"}
                          alt="med"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </div>
                      </a>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate transition-colors ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                          {med?.extractedData?.name || "Unknown Medicine"}
                        </p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider opacity-60 truncate mt-0.5">
                          {med?.extractedData?.genericName || "—"} · Seller: {med?.sellerId?.name || "—"}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-[8px] font-bold text-primary uppercase tracking-widest flex-shrink-0 bg-primary/10 px-2 py-0.5 rounded-md">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Step 2: Rider + Deploy ── */}
        <div className="space-y-4">
          <div>
            <p className="text-[9px] font-bold text-primary uppercase tracking-widest opacity-70">Step 02</p>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-tight font-sans">Assign Rider</h2>
          </div>

          {/* Selected medicines summary */}
          {selectedIds.size > 0 ? (
            <div className="bg-card border border-primary/20 rounded-xl p-4 font-sans">
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-3 opacity-70">
                {selectedIds.size} Medicine{selectedIds.size > 1 ? "s" : ""} Selected
              </p>
              <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar">
                {selectedMedicines.map(med => (
                  <div key={med._id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <img
                        src={med.images?.[0] || med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=60"}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-foreground truncate flex-1">{med?.extractedData?.name}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMedicine(med); }}
                      className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted/20 border border-dashed border-border rounded-xl p-4 text-center">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">← Select medicines to assign</p>
            </div>
          )}

          {/* Rider list */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-muted/20 border-b border-border flex items-center gap-2">
              <Truck size={10} className="text-primary" />
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Certified Fleet Partners</p>
            </div>
            {ridersQuery.loading ? (
              <div className="space-y-px">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/10 animate-pulse border-b border-border last:border-0" />)}
              </div>
            ) : riders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">No Online Riders Available</p>
              </div>
            ) : (
              <div className="divide-y divide-border overflow-y-auto max-h-[280px] no-scrollbar">
                {riders.map(rider => {
                  const rid = rider?.userId?._id || rider.userId;
                  const isSelected = selectedRiderId === rid;
                  return (
                    <button
                      key={rider._id}
                      type="button"
                      onClick={() => setSelectedRiderId(isSelected ? "" : rid)}
                      className={`w-full text-left px-4 py-3.5 flex items-center gap-4 transition-all group ${
                        isSelected ? "bg-primary/10" : "hover:bg-muted/40"
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                      }`}>
                        {isSelected && <CheckCircle2 size={12} className="text-primary-foreground" />}
                      </div>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                        isSelected ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-muted/50 border border-border text-foreground"
                      }`}>
                        {rider?.userId?.name?.charAt(0)?.toUpperCase() || "R"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold uppercase tracking-tight transition-colors truncate ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                          {rider?.userId?.name || "Rider"}
                        </p>
                        <p className="text-[8px] text-emerald-green font-bold uppercase tracking-widest opacity-70 mt-0.5">KYC Cleared · Available</p>
                      </div>
                      {isSelected && (
                        <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-widest flex-shrink-0">
                          ✓ Assigned
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deploy Button */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="primary"
              className="w-full h-12 rounded-xl font-bold text-[10px] shadow-lg shadow-primary/10 flex gap-3 items-center justify-center uppercase tracking-widest"
              loading={loading}
              disabled={selectedIds.size === 0 || !selectedRiderId}
              onClick={onSubmit}
            >
              <Truck size={14} />
              {selectedIds.size > 1
                ? `Deploy ${selectedIds.size} Assignments`
                : "Authorize Deployment"}
            </Button>
            {(selectedIds.size === 0 || !selectedRiderId) && (
              <p className="text-center text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                {selectedIds.size === 0 ? "Select medicines to continue" : "Select a rider to deploy"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignRiderPage;
