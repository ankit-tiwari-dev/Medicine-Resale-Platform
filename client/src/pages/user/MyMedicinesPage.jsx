import { useState } from "react";
import { Link } from "react-router-dom";
import { getMyMedicines, updateMedicine } from "../../api/medicineApi";
import EmptyState from "../../components/common/EmptyState";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  Shield,
  Clock,
  AlertCircle,
  Boxes,
  BarChart3
} from "lucide-react";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

const MyMedicinesPage = () => {
  const { data, loading, error, execute: refreshList } = useApiQuery(getMyMedicines, true);
  const [activeTab, setActiveTab] = useState('all');
  const items = data || [];

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'listed': return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'pending': return 'bg-muted-amber/10 text-muted-amber border-muted-amber/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'sold': return 'bg-soft-cyan/10 text-soft-cyan border-soft-cyan/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const tabs = [
    { id: 'all', label: 'All Inventory', count: items.length },
    { id: 'listed', label: 'Live & Verified', count: items.filter(i => i.status === 'listed').length },
    { id: 'pending', label: 'Under AI Audit', count: items.filter(i => i.status === 'pending').length },
    { id: 'rejected', label: 'Audit Failed', count: items.filter(i => i.status === 'rejected').length }
  ];

  const filteredItems = items.filter(i => {
    if (activeTab === 'all') return true;
    return i.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Command Center
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                <Boxes size={12} />
                Inventory Management
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                My <span className="text-primary">Medicines</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Manage your listed pharmaceutical assets and their forensic status.
              </p>
            </div>
            <Link to="/dashboard/upload-medicine">
              <Button variant="primary" className="h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 font-bold flex items-center gap-2">
                <Plus size={20} /> List New Unit
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-card rounded-2xl shadow-sm mb-8 overflow-hidden border border-border flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-5 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap relative border-r last:border-r-0 border-border ${activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary hover:bg-muted/30'
                }`}
            >
              {tab.label}
              <span className="ml-2 px-1.5 py-0.5 bg-muted rounded font-sans text-xs">{tab.count}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary animate-in fade-in slide-in-from-bottom-1"></div>
              )}
            </button>
          ))}
        </div>

        {loading && items.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-card rounded-2xl animate-pulse border border-border" />
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
          <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Medicine & Metadata</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Procurement Status</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Valuation</th>
                    <th className="px-8 py-5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="group hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted/50 flex-shrink-0">
                            <img
                              src={item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                              alt={item.extractedData?.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground font-sans">{item.extractedData?.name || "Premium Medicine"}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{item.category || "General Pharmacology"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest items-center gap-1.5 ${getStatusStyles(item.status)}`}>
                          {item.status === 'listed' ? <Shield size={12} /> : item.status === 'pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                          {item.status || 'Auditing'}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-foreground">₹{Number(item.price || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Stock: {item.stock || 0} Units</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Link to={`/medicines/${item._id}`}>
                            <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                              <Eye size={18} />
                            </button>
                          </Link>
                          <button className="p-2.5 text-muted-foreground hover:text-soft-cyan hover:bg-soft-cyan/5 rounded-xl transition-all">
                            <Edit size={18} />
                          </button>
                          <button className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Grid View */}
            <div className="lg:hidden divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item._id} className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border border-border bg-muted/30 overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                        alt={item.extractedData?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{item.extractedData?.name || "Medicine"}</h3>
                      <div className={`mt-1 inline-flex px-2 py-0.5 rounded-md border text-[8px] font-bold uppercase tracking-widest ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border border-dashed">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">List Price</p>
                      <p className="font-black text-primary">₹{Number(item.price || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Quantity</p>
                      <p className="font-bold text-foreground">{item.stock || 0} Units</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link to={`/medicines/${item._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full font-bold">Inspect</Button>
                    </Link>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 flex items-center justify-center">
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="p-20 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground font-medium italic">No listings found matching this status filter.</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default MyMedicinesPage;
