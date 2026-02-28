import { useState } from "react";
import { getDisputes } from "../../api/disputeApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";


const DisputesPage = () => {
  const { data, loading, error } = useApiQuery(getDisputes, true);
  const [activeTab, setActiveTab] = useState('all');
  const disputes = data || [];

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'pending': return 'bg-muted-amber/10 text-muted-amber border-muted-amber/20';
      case 'investigating': return 'bg-primary/10 text-primary border-primary/20';
      case 'refunded': return 'bg-soft-cyan/10 text-soft-cyan border-soft-cyan/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };



  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'all') return true;
    return d.status?.toLowerCase() === activeTab;
  });

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
            LOG
            Resolution Network
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Incident <span className="text-primary">Reports</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Transparent audit and reconciliation for disputed pharmaceutical handovers.
              </p>
            </div>
            <Link to="/disputes/raise">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-primary/5">
                FILE NEW INCIDENT
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Incidents' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'investigating', label: 'In Audit' },
            { id: 'resolved', label: 'Finalized' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === tab.id
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-card text-muted-foreground border-border hover:border-primary/20'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && disputes.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card rounded-[2rem] animate-pulse border border-border" />)}
          </div>
        ) : disputes.length === 0 ? (
          <EmptyState
            title="Clean resolution history"
            message="No disputed transactions found in your clinical audit trail."
            actionLink="/dashboard/orders"
            actionLabel="View Order History"
          />
        ) : (
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <div key={dispute._id} className="bg-card rounded-[2rem] p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className={`px-3 py-1 rounded-sm border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getStatusStyles(dispute.status)}`}>
                        {dispute.status || 'AUDITING'}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-lg border border-border">
                        ID: #{(dispute._id || "").slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-foreground font-serif mb-2">{dispute.reason || "Undisclosed Discrepancy"}</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed italic pr-10">
                        "{dispute.description || "No detailed description provided in the incident report."}"
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-6 border-t border-border border-dashed text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        Order: {(dispute.orderId?._id || dispute.orderId || "").slice(-8).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2">
                        Reported: {new Date(dispute.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        {dispute.messages?.length || 0} Communications
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border border-dashed pt-8 lg:pt-0 lg:pl-8">
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Protocol</p>
                      <p className="text-xs font-bold text-foreground">
                        {dispute.status === 'pending' ? 'Awaiting clinical review' : 'Resolution under arbitration'}
                      </p>
                    </div>
                    <Button variant="primary" className="h-12 w-full rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                      OPEN AUDIT LOG
                    </Button>
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

export default DisputesPage;
