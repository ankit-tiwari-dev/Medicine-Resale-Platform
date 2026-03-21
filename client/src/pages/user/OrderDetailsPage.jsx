import { getOrderDetails, confirmOrderDelivery } from "../../api/orderApi";
import { raiseDispute } from "../../api/disputeApi";
import { addReview } from "../../api/reviewApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import Button from "../../components/common/Button";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../../utils/errors";
import { useState } from "react";


const OrderDetailsPage = () => {
  const { id } = useParams();
  const fetcher = useCallback(() => getOrderDetails(id), [id]);
  const query = useApiQuery(fetcher, true);
  const order = query.data;
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeData, setDisputeData] = useState({ reason: "damaged", description: "" });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "", medicineId: "" });

  const handleConfirmDelivery = async () => {
    setActionLoading(true);
    try {
      await confirmOrderDelivery(id);
      toast.success("Delivery verified. Fulfillment complete.");
      await query.execute();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Confirmation failed."));
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleRaiseDispute = async () => {
    setActionLoading(true);
    try {
      await raiseDispute({ orderId: id, ...disputeData });
      toast.success("Dispute filed. Institutional review initialized.");
      setShowDisputeModal(false);
      await query.execute();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Dispute submission failed."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddReview = async () => {
    setActionLoading(true);
    try {
      await addReview(reviewData);
      toast.success("Pharmacological feedback recorded.");
      setShowReviewModal(false);
      await query.execute();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Review submission failed."));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 animate-pulse">
        <Container className="py-12">
          <div className="h-10 bg-card rounded-xl w-1/4 mb-10" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-card rounded-xl" />
            <div className="h-64 bg-card rounded-xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-xl shadow-sm border border-border font-sans">
          <div className="w-12 h-12 text-destructive font-black text-xl uppercase tracking-widest mx-auto mb-4 flex items-center justify-center">ERR</div>
          <h2 className="text-xl font-serif font-bold text-foreground mb-2">Sync Error</h2>

          <p className="text-[11px] text-muted-foreground mb-6 opacity-70">Unable to retrieve order details from the clinical network.</p>
          <Link to="/dashboard/orders">
            <Button variant="primary" className="h-11 px-8 rounded-xl text-[11px] font-bold uppercase tracking-widest">Back to History</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-emerald-green text-white';
      case 'shipped': return 'bg-soft-cyan text-white';
      case 'pending': return 'bg-muted-amber text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10 font-sans">
          <Link to="/dashboard/orders" className="inline-flex items-center gap-2 text-[9px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest mb-6">
            <span className="tracking-widest opacity-60">BACK TO</span> History
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Order Manifest
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                Order <span className="text-primary">#{(id || "").slice(-8).toUpperCase()}</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
                Initialized on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-black/5 ${getStatusStyles(order.status)}`}>
              {order.status || 'Processing'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6 font-sans">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border bg-muted/20 flex items-center gap-3">
                <div className="text-[9px] text-primary font-bold uppercase tracking-widest opacity-60">ITEMS</div>
                <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">Procedural Items</h2>
              </div>
              <div className="divide-y divide-border">
                {(order.orderItems || []).map((item) => (
                  <div key={item._id} className="p-6 flex items-center gap-6 group hover:bg-muted/30 transition-colors">
                    <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden border border-border">
                      <img
                        src={item.medicineId?.image || item.medicineId?.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                        alt="Medicine"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{(item.medicineId?.extractedData?.name || "Premium Medicine")}</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">ID: {item.medicineId?._id || item._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary font-sans">₹{Number(item.price || 0).toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Unit Verified</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-muted/30 flex justify-between items-center">
                <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Manifest Total</div>
                <div className="text-2xl font-bold text-foreground font-sans tracking-tight">₹{Number(order.totalAmount || order.amount || 0).toLocaleString()}</div>
              </div>
            </div>

            {/* Escrow Status Detail */}
            <div className="bg-primary rounded-xl p-8 text-primary-foreground relative overflow-hidden group shadow-xl shadow-primary/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[80px] group-hover:opacity-10 transition-opacity"></div>
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/10 font-bold text-[9px] uppercase tracking-widest text-white">
                  SECURE
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 font-serif tracking-tight">Escrow Protection Status</h3>
                  <p className="text-[11px] text-primary-foreground/70 mb-6 leading-relaxed font-sans opacity-95">
                    Funds for this order are currently <span className="text-soft-cyan font-bold uppercase underline decoration-soft-cyan/30">Locked in Vault</span>. Release will trigger upon delivery confirmation and packaging integrity audit.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-[8px] text-soft-cyan font-bold uppercase tracking-widest">VERIFIED</div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Payment Secured by network</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">PENDING</div>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Awaiting Logistics Chain Initialization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: logistics */}
          <div className="space-y-6 font-sans">
            <div className="bg-card rounded-xl p-6 lg:p-8 border border-border shadow-sm">
              <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="text-primary">DESTINATION</span>
                Clinical Handover
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Delivery Endpoint</p>
                  <p className="text-[11px] font-bold text-foreground leading-relaxed">{order.shippingAddress || "Registered verification address required"}</p>
                </div>
                <div className="h-px bg-border border-dashed"></div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-60">Transaction Ref</p>
                  <p className="text-[10px] font-mono font-bold text-primary break-all">{order.paymentId || "PAYMENT-PENDING"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 lg:p-8 border border-border shadow-sm">
              <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="text-emerald-green">LOGISTICS</span>
                Logistics Hub
              </h3>
              <div className="space-y-3">
                <Link to={`/buyer/orders/${order._id}/tracking`}>
                  <Button variant="outline" className="w-full h-10 rounded-xl font-bold border-2 text-[10px] uppercase tracking-widest">
                    Track Pulse
                  </Button>
                </Link>

                {order.status === 'shipped' && (
                  <Button
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Confirm Delivery
                  </Button>
                )}

                {['pending', 'shipped', 'delivered'].includes(order.status) && (
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-500/5 border-red-500/20"
                    onClick={() => setShowDisputeModal(true)}
                  >
                    Raise Dispute
                  </Button>
                )}
              </div>
              <p className="text-[8px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-40">Certified network only</p>
            </div>

            {order.status === 'delivered' && (
              <div className="bg-card rounded-xl p-6 lg:p-8 border border-border shadow-sm">
                <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="text-primary-foreground bg-primary px-1.5 py-0.5 rounded">REVIEW</span>
                  Audit Experience
                </h3>
                <div className="space-y-4">
                  {(order.orderItems || []).map(item => (
                    !item.isReviewed && (
                      <div key={item._id} className="p-3 border border-border rounded-xl group hover:border-primary/20 transition-all">
                        <p className="text-[10px] font-bold text-foreground mb-3 truncate">{item.medicineId?.extractedData?.name || "Premium Medicine"}</p>
                        <Button
                          variant="outline"
                          className="w-full h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest"
                          onClick={() => {
                            setReviewData(prev => ({ ...prev, medicineId: item.medicineId?._id }));
                            setShowReviewModal(true);
                          }}
                        >
                          Rate Unit
                        </Button>
                      </div>
                    )
                  ))}
                  {order.orderItems?.every(item => item.isReviewed) && (
                    <p className="text-[10px] text-center italic text-muted-foreground opacity-60">All units audited</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmDelivery}
          title="Verify Clinical Handover?"
          message="Confirming receipt will release escrowed funds to the medication provider. This operation is irreversible."
          confirmLabel="Authorize Release"
          cancelLabel="Abort"
          loading={actionLoading}
        />

        <ConfirmationModal
          isOpen={showDisputeModal}
          onClose={() => setShowDisputeModal(false)}
          onConfirm={handleRaiseDispute}
          title="Initialize Transaction Dispute?"
          message={`You are documenting a protocol violation for Order #${id.slice(-8)}. Our institutional review node will audit this case.`}
          confirmLabel="File Dispute"
          cancelLabel="Close"
          loading={actionLoading}
          variant="danger"
        >
          <div className="mt-4 space-y-4 font-sans">
            <select
              className="w-full h-10 px-3 rounded-xl bg-muted/50 border border-border text-xs font-bold"
              value={disputeData.reason}
              onChange={(e) => setDisputeData(prev => ({ ...prev, reason: e.target.value }))}
            >
              <option value="damaged">Damaged Packaging</option>
              <option value="expired">Integrity Expired</option>
              <option value="wrong_item">Incorrect Asset</option>
              <option value="missing_item">Missing Unit</option>
            </select>
            <textarea
              placeholder="Clinical description of the issue..."
              className="w-full h-24 p-4 rounded-xl bg-muted/50 border border-border text-xs font-medium outline-none"
              value={disputeData.description}
              onChange={(e) => setDisputeData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </ConfirmationModal>

        <ConfirmationModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onConfirm={handleAddReview}
          title="Submit Unit Audit"
          message="Rate the quality and efficacy of the received medication unit."
          confirmLabel="Record Audit"
          cancelLabel="Back"
          loading={actionLoading}
        >
          <div className="mt-4 space-y-4 font-sans">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`w-10 h-10 rounded-xl border-2 transition-all font-bold ${reviewData.rating >= star ? 'bg-primary border-primary text-white' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                  onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                >
                  {star}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Clinical feedback on unit efficacy/quality..."
              className="w-full h-24 p-4 rounded-xl bg-muted/50 border border-border text-xs font-medium outline-none"
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
            />
          </div>
        </ConfirmationModal>
      </Container>
    </div>
  );
};

export default OrderDetailsPage;
