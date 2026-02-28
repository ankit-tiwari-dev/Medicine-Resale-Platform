import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderTracking } from "../../api/orderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import Button from "../../components/common/Button";


const OrderTrackingPage = () => {
  const { id } = useParams();
  const fetcher = useCallback(() => getOrderTracking(id), [id]);
  const { data, loading, error } = useApiQuery(fetcher, true);
  const order = data;

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 animate-pulse">
        <Container className="py-12">
          <div className="h-10 bg-card rounded-lg w-1/4 mb-10" />
          <div className="h-96 bg-card rounded-2xl" />
        </Container>
      </div>
    );
  }

  const steps = [
    { status: 'ordered', label: 'Order Initialized', initial: 'DOC', desc: 'Medical requisition received and audited.' },
    { status: 'paid', label: 'Capital Secured', initial: 'SEC', desc: 'Funds locked in clinical escrow vault.' },
    { status: 'shipped', label: 'In Transit', initial: 'TRK', desc: 'Certified rider has collected the unit.' },
    { status: 'delivered', label: 'Handover Complete', initial: 'OK', desc: 'Procurement cycle finalized.' }
  ];


  const currentStatus = order?.status?.toLowerCase() || 'pending';
  const statusHistory = order?.statusHistory || [];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[900px]">
        {/* Header */}
        <div className="mb-10">
          <Link to={`/dashboard/orders/${id}`} className="inline-flex items-center gap-2 text-[10px] text-muted-foreground hover:text-primary transition-colors font-black uppercase tracking-widest mb-6">
            <span className="tracking-widest">BACK TO</span> Manifest
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                TIME

                Logistics Pulse
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Live <span className="text-primary">Tracking</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Real-time audit of your pharmaceutical shipment #{(id || "").slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-green/10 border border-emerald-green/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-green uppercase tracking-widest">GPRS Active</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-[2.5rem] p-8 lg:p-12 border border-border shadow-sm">
              <div className="relative space-y-12">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-muted-foreground/10 border-l border-dashed border-muted-foreground/30" />

                {steps.map((step, index) => {
                  const isCompleted = statusHistory.some(h => h.status?.toLowerCase() === step.status) || currentStatus === step.status;
                  const isCurrent = currentStatus === step.status;

                  return (
                    <div key={step.status} className={`relative flex gap-8 group ${!isCompleted && 'opacity-40'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all shadow-lg ${isCompleted ? 'bg-primary text-white scale-110 shadow-primary/20' : 'bg-muted text-muted-foreground'
                        }`}>
                        <div className="text-[10px] font-black uppercase tracking-widest">{step.initial}</div>

                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-base font-bold uppercase tracking-tight ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </h3>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-muted-foreground opacity-60">
                              {statusHistory.find(h => h.status?.toLowerCase() === step.status)?.at
                                ? new Date(statusHistory.find(h => h.status?.toLowerCase() === step.status).at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'AUDITED'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium pr-10">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-16 p-6 bg-muted/20 border border-border border-dashed rounded-[1.5rem] flex items-center gap-4">
                <div className="text-primary text-[10px] font-black uppercase tracking-widest">LOC</div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Node</p>
                  <p className="text-sm font-bold text-foreground">Hub Processing Center — Bengaluru South</p>
                </div>
              </div>
            </div>

            {currentStatus === 'shipped' && (
              <Link to={`/buyer/orders/${id}/confirm-delivery`}>
                <Button className="w-full h-16 rounded-2xl shadow-xl shadow-primary/10 text-lg font-bold flex gap-3 items-center justify-center">
                  Declare Delivery Success
                </Button>

              </Link>
            )}
          </div>

          {/* Sidebar: Rider info */}
          <div className="space-y-6">
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="text-primary">LOGISTICS</span>
                Logistics Lead
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-muted rounded-2xl overflow-hidden border border-border">
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200"
                    alt="Rider"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Rahul S.</p>
                  <p className="text-[10px] text-emerald-green font-bold uppercase tracking-tighter">Verified Professional</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Cert ID</span>
                  <span className="text-foreground">CERT-4891-X</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Fleet Sync</span>
                  <span className="text-emerald-green">99.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-[2rem] p-8 text-primary-foreground shadow-lg shadow-primary/10 group cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-soft-cyan">SECURE</span>
                Escrow Protection
              </h3>

              <p className="text-[10px] leading-relaxed opacity-70 mb-6 font-medium">
                Funds will remain locked in our secure network vault until you inspect the medicine and declare a successful handover.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all pb-1">
                Protocol Details &rarr;
              </div>

            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderTrackingPage;
