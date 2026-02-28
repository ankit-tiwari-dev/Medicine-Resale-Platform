import { getRiderTasks } from "../../api/riderApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";

import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link to="/rider" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            BACK TO COMMAND
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                Active Logistics Queue
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Assignment <span className="text-primary">Batches</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Only KYC-authorized riders receive priority medical retrieval tasks.
              </p>
            </div>
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-card rounded-[2rem] animate-pulse border border-border" />)}
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
            {tasks.map((task) => (
              <div key={task._id} className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <div className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(task.status)}`}>
                        {task.status?.toUpperCase() || 'ASSIGNED'}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-lg border border-border">
                        ID: #{(task._id || "").slice(-8).toUpperCase()}
                      </span>
                      <div className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                        Priority: High
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-emerald-green/10 text-emerald-green rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[10px]">
                            A
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Retrieval Point (Seller)</p>
                            <p className="text-sm font-bold text-foreground leading-relaxed">
                              Indira Nagar, 100ft Road, Bengaluru. <br />
                              <span className="text-muted-foreground font-medium italic">Contact seller for security coordinates.</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[10px]">
                            B
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Handover Point (Buyer)</p>
                            <p className="text-sm font-bold text-foreground leading-relaxed">
                              HSR Layout Sector 2, Apartment 4B.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Unit Audit</span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            {task?.extractedData?.name || "Multiple Medical Units"} - Batch Integrity Scan Required.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 h-10 border-2 font-black text-[10px] uppercase tracking-widest">
                            Contact Seller
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-64 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border border-dashed pt-8 lg:pt-0 lg:pl-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-muted-amber mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Time Constraint</span>
                      </div>
                      <p className="text-xs font-bold text-foreground">
                        Complete within 120 minutes for bonus multiplier.
                      </p>
                    </div>
                    <Link to="/rider/confirm-collection">
                      <Button variant="primary" className="h-14 w-full rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 group">
                        Execute Task
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default RiderTasksPage;
