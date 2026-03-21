import { getRiderTasks } from "../../api/riderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";
import { 
  Package, 
  MapPin, 
  Navigation, 
  Phone, 
  ExternalLink,
  CornerUpRight,
  Clock,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

const HUB_ADDRESS = "Health-Tech Central Hub, Electronic City Phase 1, Bengaluru, 560100";

const RiderTasksPage = () => {
  const { data, loading, error } = useApiQuery(getRiderTasks, true);
  const tasks = data || [];

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'pending': return 'bg-primary/10 text-primary border-primary/20';
      case 'active': return 'bg-soft-cyan/10 text-soft-cyan border-soft-cyan/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const openInMaps = (address) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const formatAddress = (seller) => {
    if (seller?.address && typeof seller.address === 'object') {
      const { street, city, pincode } = seller.address;
      const parts = [street, city, pincode].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }
    return seller?.address || "Address Not Specified";
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 font-sans">
          <Link to="/rider" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            <span className="tracking-widest opacity-60">BACK TO</span> COMMAND
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Active Logistics Queue
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                Assignment <span className="text-primary">Batches</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
                Only KYC-authorized riders receive priority medical retrieval tasks.
              </p>
            </div>
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-card rounded-xl animate-pulse border border-border" />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="Assignment queue empty"
            message="Ensure your KYC status is verified to receive new distribution tasks."
            actionLink="/rider/kyc/upload-docs"
            actionLabel="Check KYC Status"
          />
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => {
              const pickupAddr = task.pickupLocation || formatAddress(task.sellerId);
              
              return (
                <div key={task._id} className="bg-card rounded-xl p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Task Info */}
                    <div className="flex-1 font-sans">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className={`px-2 py-0.5 rounded-lg border text-[8px] font-bold uppercase tracking-widest ${getStatusStyles(task.status)}`}>
                          {task.status?.toUpperCase() || 'ASSIGNED'}
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-lg border border-border opacity-60">
                          #{(task._id || "").slice(-8).toUpperCase()}
                        </span>
                        <div className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest opacity-80 flex items-center gap-1.5">
                          <ShieldAlert size={10} />
                          Priority: High
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Route Nodes */}
                        <div className="space-y-6">
                          <div className="relative pl-8">
                            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 border-l-2 border-dashed border-border/60"></div>
                            
                            {/* Point A: Pickup */}
                            <div className="relative mb-8">
                              <div className="absolute -left-8 top-0.5 w-6 h-6 bg-emerald-green/10 text-emerald-green rounded-full flex items-center justify-center border border-emerald-green/20 font-black text-[9px] z-10">
                                A
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Retrieval Point (Seller)</p>
                                  <button 
                                    onClick={() => openInMaps(pickupAddr)}
                                    className="text-[8px] font-bold text-primary flex items-center gap-1 hover:underline"
                                  >
                                    <Navigation size={10} /> NAVIGATE
                                  </button>
                                </div>
                                <p className="text-[13px] font-bold text-foreground leading-relaxed pr-8">
                                  {pickupAddr}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-[9px] text-muted-foreground font-medium italic opacity-70">Contact: {task.sellerId?.name || "Verified Seller"}</span>
                                  {task.sellerId?.phone && (
                                    <a href={`tel:${task.sellerId.phone}`} className="p-1 bg-muted rounded hover:bg-primary/10 transition-colors">
                                      <Phone size={10} className="text-primary" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Point B: Dropoff */}
                            <div className="relative">
                              <div className="absolute -left-8 top-0.5 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 font-black text-[9px] z-10">
                                B
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Handover Point (Clinical Hub)</p>
                                  <button 
                                    onClick={() => openInMaps(HUB_ADDRESS)}
                                    className="text-[8px] font-bold text-primary flex items-center gap-1 hover:underline"
                                  >
                                    <Navigation size={10} /> NAVIGATE
                                  </button>
                                </div>
                                <p className="text-[13px] font-bold text-foreground leading-relaxed pr-8">
                                  {HUB_ADDRESS}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-5 bg-muted/20 rounded-xl border border-border/50 relative overflow-hidden group/card shadow-inner">
                            <div className="absolute top-0 right-0 p-3 opacity-[0.05] group-hover/card:opacity-[0.1] transition-opacity">
                              <Package size={32} />
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Asset Audit Required</span>
                            </div>
                            <p className="text-[11px] font-bold text-foreground leading-relaxed mb-1">
                              {task.extractedData?.name || task.name || "Unknown Asset"}
                            </p>
                            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                              Batch: {task.extractedData?.batchNumber || "UNSPECIFIED"}
                            </p>
                            <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Security Seal</span>
                              <span className="text-[8px] font-bold text-emerald-green uppercase tracking-widest flex items-center gap-1">
                                <ShieldAlert size={8} /> INTRA-HUB
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => openInMaps(pickupAddr)}
                              variant="outline" 
                              className="flex-1 h-10 border border-border font-bold text-[9px] uppercase tracking-widest rounded-xl hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                            >
                              <CornerUpRight size={12} className="text-primary" />
                              Route Point A
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Execution Panel */}
                      <div className="lg:w-72 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border border-dashed pt-8 lg:pt-0 lg:pl-8 font-sans">
                      <div className="bg-muted/30 p-4 rounded-xl border border-border mb-6">
                        <div className="flex items-center gap-2 text-primary mb-3">
                          <Clock size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Protocol Window</span>
                        </div>
                        <p className="text-[11px] font-bold text-foreground leading-tight mb-1">
                          120 Minutes Remaining
                        </p>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                          SLA Compliance Level: High
                        </p>
                      </div>
                      
                      <Link to="/rider/confirm-collection" state={{ medicineId: task._id }} className="w-full">
                        <Button variant="primary" className="h-12 w-full rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg shadow-primary/10 group flex items-center justify-center gap-2">
                          Execute Collection Protocol
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>

                      <p className="text-[8px] text-muted-foreground text-center mt-4 uppercase font-bold tracking-widest opacity-40">
                        Biometric/Photo Proof Required
                      </p>
                    </div>
                  </div>
                </div>
            );
          })}
        </div>
      )}
    </Container>
  </div>
  );
};

export default RiderTasksPage;
