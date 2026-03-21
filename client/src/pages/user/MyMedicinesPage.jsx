import { useState } from "react";
import { Link } from "react-router-dom";
import { getMyMedicines, updateMedicine, deleteMedicine } from "../../api/medicineApi";
import { useApiQuery } from "../../hooks/useApiQuery";
import toast from "react-hot-toast";
import Container from "../../components/layout/Container";
import Button from "../../components/common/Button";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { 
  FileUp, 
  Microscope, 
  ShieldCheck, 
  Truck, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ChevronRight,
  ClipboardCheck,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  PackageX
} from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

const MyMedicinesPage = () => {
  const { data, loading, error, execute: refreshList } = useApiQuery(getMyMedicines, true);
  const [activeTab, setActiveTab] = useState('all');
  const [editItem, setEditItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const items = data || [];

  const lifecycleSteps = [
    { id: 'uploaded', label: 'Registered', icon: FileUp },
    { id: 'pending', label: 'AI Audit', icon: Microscope },
    { id: 'verified', label: 'Verified', icon: ShieldCheck },
    { id: 'pickup_assigned', label: 'Logistics', icon: Truck },
    { id: 'collected', label: 'Received', icon: Package },
    { id: 'listed', label: 'Live', icon: CheckCircle2 }
  ];

  const getStatusCfg = (status) => {
    switch (status?.toLowerCase()) {
      case 'listed': return { label: 'Live & Verified', color: 'text-emerald-green bg-emerald-green/5 border-emerald-green/20' };
      case 'pending': return { label: 'Under AI Audit', color: 'text-primary bg-primary/5 border-primary/20' };
      case 'verified': return { label: 'Verified', color: 'text-emerald-green bg-emerald-green/5 border-emerald-green/20' };
      case 'pickup_assigned': return { label: 'Rider Assigned', color: 'text-soft-cyan bg-soft-cyan/5 border-soft-cyan/20' };
      case 'collected': return { label: 'Collected', color: 'text-soft-cyan bg-soft-cyan/5 border-soft-cyan/20' };
      case 'rejected': return { label: 'Audit Failed', color: 'text-red-500 bg-red-500/5 border-red-500/20' };
      case 'sold': return { label: 'Sold & Dispatched', color: 'text-soft-cyan bg-soft-cyan/5 border-soft-cyan/20' };
      default: return { label: status, color: 'text-muted-foreground bg-muted/5 border-border' };
    }
  };

  const getStepIndex = (status) => {
    const idx = lifecycleSteps.findIndex(s => s.id === status?.toLowerCase());
    if (idx !== -1) return idx;
    if (status?.toLowerCase() === 'sold') return 5;
    return -1;
  };

  const StatusStepper = ({ currentStatus }) => {
    const currentIndex = getStepIndex(currentStatus);
    
    return (
      <div className="flex items-center gap-1 w-full max-w-[280px]">
        {lifecycleSteps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div 
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-green/10 border-emerald-green/20 text-emerald-green' :
                  isActive ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' :
                  'bg-muted/30 border-border text-muted-foreground opacity-40'
                }`}
                title={`${step.label}: ${isActive ? 'Active' : isCompleted ? 'Completed' : 'Upcoming'}`}
              >
                <step.icon size={10} strokeWidth={isCompleted ? 3 : 2.5} />
              </div>
              {idx < lifecycleSteps.length - 1 && (
                <div className={`h-[1.5px] flex-1 mx-0.5 rounded-full ${isCompleted ? 'bg-emerald-green/30' : 'bg-border/30'}`}></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Inventory', count: items.length },
    { id: 'listed', label: 'Live Assets', count: items.filter(i => i.status === 'listed').length },
    { id: 'pending', label: 'Audit Queue', count: items.filter(i => i.status === 'pending').length },
    { id: 'rejected', label: 'Failed Lots', count: items.filter(i => i.status === 'rejected').length }
  ];

  const filteredItems = items.filter(i => {
    if (activeTab === 'all') return true;
    return i.status === activeTab;
  });

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setActionLoading(true);
    try {
      await deleteMedicine(confirmDeleteId);
      toast.success("Listing removed successfully");
      refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete listing");
    } finally {
      setActionLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await updateMedicine(editItem._id, {
        price: editItem.price,
        stock: editItem.stock,
        name: editItem.extractedData.name,
        batchNumber: editItem.extractedData.batchNumber
      });
      toast.success("Medicine updated");
      setEditItem(null);
      refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 animate-in fade-in duration-500">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 lg:mb-12 font-sans">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-8">
            <span className="tracking-widest opacity-60">BACK TO</span> Command Center
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Asset Inventory Registry
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                My <span className="text-primary">Medicines</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl opacity-70">
                Auditing and managing your listed pharmaceutical assets within the clinical redistribution network.
              </p>
            </div>
            <Link to="/dashboard/upload-medicine">
              <Button variant="primary" className="h-14 px-8 rounded-xl shadow-lg shadow-primary/5 font-bold flex items-center gap-3 text-xs tracking-widest">
                INITIALIZE NEW LISTING
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tabs.map(tab => {
            let IconBase = Package;
            if (tab.id === 'listed') IconBase = CheckCircle2;
            else if (tab.id === 'pending') IconBase = Microscope;
            else if (tab.id === 'rejected') IconBase = AlertCircle;

            return (
              <div 
                key={tab.id} 
                className="group relative bg-card/50 backdrop-blur-sm p-6 rounded-[1.5rem] border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex items-center gap-5 cursor-pointer"
                onClick={() => setActiveTab(tab.id)}
              >
                {/* Ambient glow effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 transition-opacity duration-500 group-hover:opacity-30 -mr-10 -mt-10 pointer-events-none ${
                    tab.id === 'all' ? 'bg-primary' :
                    tab.id === 'listed' ? 'bg-emerald-green' :
                    tab.id === 'pending' ? 'bg-muted-amber' :
                    'bg-red-500'
                }`} />
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 border ${
                  tab.id === 'all' ? 'bg-primary/10 text-primary border-primary/20' :
                  tab.id === 'listed' ? 'bg-emerald-green/10 text-emerald-green border-emerald-green/20' :
                  tab.id === 'pending' ? 'bg-muted-amber/10 text-muted-amber border-muted-amber/20' :
                  'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                  <IconBase size={20} strokeWidth={2.5} />
                </div>

                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-foreground transition-colors">{tab.label}</p>
                  <p className="text-3xl font-black text-foreground font-sans leading-none tracking-tighter">{tab.count}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-card p-1.5 rounded-xl border border-border shadow-sm font-sans overflow-x-auto no-scrollbar mask-edges">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-2.5 flex-shrink-0 whitespace-nowrap rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${activeTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading && items.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-card rounded-[2rem] animate-pulse border border-border" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Your warehouse is empty"
            message="You haven't listed any medicines for redistribution yet."
            actionLink="/dashboard/upload-medicine"
            actionLabel="Initialize First Listing"
          />
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden font-sans">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Medical Unit Manifest</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Procurement Status</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Lifecycle Tracking</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Valuation</th>
                    <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Governance Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map((item) => {
                    const statusCfg = getStatusCfg(item.status);
                    return (
                      <tr key={item._id} className="group hover:bg-muted/5 transition-colors">
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-muted/50 flex-shrink-0 shadow-sm relative group/img">
                              <img
                                src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                                alt={item.extractedData?.name}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground font-sans group-hover:text-primary transition-colors">{item.extractedData?.name || "Premium Medicine"}</h3>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{item.category || "General Pharmacology"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className={`inline-flex px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest items-center gap-2 ${statusCfg.color}`}>
                            {statusCfg.label}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <StatusStepper currentStatus={item.status} />
                        </td>
                        <td className="px-10 py-6">
                          <div className="font-black text-foreground">₹{Number(item.price || 0).toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em] mt-0.5">Stock: {item.stock || 0} Units</div>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {(() => {
                              const isLocked = ['sold', 'collected', 'pickup_assigned', 'verified'].includes(item.status?.toLowerCase());
                              return (
                                <>
                                  <Link to={`/browse/${item._id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-10 px-3 rounded-xl hover:bg-primary/5 border-2 border-border transition-all font-black text-[10px] uppercase tracking-widest"
                                      title="Inspect Listing"
                                    >
                                      VIEW
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => !isLocked && setEditItem(JSON.parse(JSON.stringify(item)))}
                                    disabled={isLocked}
                                    className={`h-10 px-3 rounded-xl border-2 border-border transition-all font-black text-[10px] uppercase tracking-widest ${isLocked ? '' : 'hover:bg-soft-cyan/5 hover:text-soft-cyan'}`}
                                    title={isLocked ? "Listing is locked (Network Chain Active)" : "Edit Listing"}
                                  >
                                    EDIT
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => !isLocked && setConfirmDeleteId(item._id)}
                                    disabled={isLocked || actionLoading}
                                    className={`h-10 px-3 rounded-xl border-2 border-border transition-all font-black text-[10px] uppercase tracking-widest ${isLocked ? '' : 'hover:bg-red-500/5 hover:text-red-500'}`}
                                    title={isLocked ? "Listing is locked (Audit Requirement)" : "Purge Listing"}
                                  >
                                    DEL
                                  </Button>
                                </>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Grid View */}
            <div className="lg:hidden divide-y divide-border/50 bg-card rounded-xl border border-border shadow-sm overflow-hidden font-sans">
              {filteredItems.map((item) => {
                const statusCfg = getStatusCfg(item.status);
                return (
                  <div key={item._id} className="p-8 space-y-6 hover:bg-muted/5 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl border border-border bg-muted/30 overflow-hidden flex-shrink-0 shadow-sm">
                        <img
                          src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                          alt={item.extractedData?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate text-lg">{item.extractedData?.name || "Medicine"}</h3>
                        <div className="mt-3 flex flex-col gap-3">
                          <div className={`inline-flex self-start px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest items-center gap-2 ${statusCfg.color}`}>
                            {statusCfg.label}
                          </div>
                          <StatusStepper currentStatus={item.status} />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 p-5 bg-muted/20 rounded-2xl border border-border/50 border-dashed">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70 mb-1">List Price</p>
                        <p className="font-black text-foreground text-lg">₹{Number(item.price || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70 mb-1">Available</p>
                        <p className="font-black text-foreground text-lg">{item.stock || 0} Units</p>
                      </div>
                    </div>
                    {(() => {
                      const isLocked = ['sold', 'collected', 'pickup_assigned', 'verified'].includes(item.status?.toLowerCase());
                      return (
                        <div className="flex gap-3 pt-2">
                          <Link to={`/browse/${item._id}`} className="flex-1">
                            <Button variant="outline" className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-2">Inspect Asset</Button>
                          </Link>
                          <Button
                            variant="outline"
                            disabled={isLocked}
                            className={`h-12 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest ${isLocked ? '' : 'hover:bg-soft-cyan/5 hover:text-soft-cyan'}`}
                            onClick={() => !isLocked && setEditItem(JSON.parse(JSON.stringify(item)))}
                          >
                            EDIT
                          </Button>
                          <Button
                            variant="outline"
                            disabled={isLocked || actionLoading}
                            className={`h-12 px-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest ${isLocked ? '' : 'hover:bg-red-500/5 hover:text-red-500'}`}
                            onClick={() => !isLocked && setConfirmDeleteId(item._id)}
                          >
                            DEL
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-12 h-12 text-muted-foreground/30 font-black text-xl uppercase tracking-widest mx-auto flex items-center justify-center mb-4">EMPTY</div>

                <p className="text-sm text-muted-foreground font-medium italic">No listings found matching this status filter.</p>
              </div>
            )}
          </div>
        )}
      </Container>

      {/* Quick Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 font-sans">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border/50">
              <div>
                <h3 className="text-xl font-bold text-foreground font-serif tracking-tight">Quick Inventory Edit</h3>
                <p className="text-[9px] text-primary mt-1 uppercase font-bold tracking-[0.2em] opacity-60">Update clinical particulars</p>
              </div>
              <button
                onClick={() => setEditItem(null)}
                className="p-2 px-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
              >
                CLOSE
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-1">List Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-muted/20 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground"
                    value={editItem.price}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-1">Available Stock</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 bg-muted/20 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground"
                    value={editItem.stock}
                    onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-1">Medicine Name (Brand)</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-muted/20 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-foreground placeholder:text-muted-foreground"
                  value={editItem.extractedData.name}
                  onChange={(e) => setEditItem({
                    ...editItem,
                    extractedData: { ...editItem.extractedData, name: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="pt-6 flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-xl font-bold bg-muted/10 border-border hover:bg-muted/20 transition-all text-[11px] uppercase tracking-widest"
                  onClick={() => setEditItem(null)}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/5 text-[11px] uppercase tracking-widest"
                  loading={actionLoading}
                >
                  Commit Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hospital-Grade Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Sanitize Listing?"
        message="This operation will permanently purge the medicine from the clinical redistribution network. This action is irreversible."
        confirmLabel="Confirm Purge"
        cancelLabel="Abort Mission"
        loading={actionLoading}
        variant="danger"
      />
    </div>
  );
};

export default MyMedicinesPage;
