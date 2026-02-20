import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getSellerReviews } from "../../api/reviewApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  Star,
  ShieldCheck,
  User,
  ChevronLeft,
  MessageSquare,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

const SellerReviewsPage = () => {
  const { sellerId } = useParams();
  const fetcher = useCallback(() => getSellerReviews(sellerId), [sellerId]);
  const { data, loading, error } = useApiQuery(fetcher, true);

  const reviews = data?.reviews || [];
  const stats = data?.stats || { averageRating: 0, totalReviews: 0 };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            className={s <= rating ? "fill-soft-cyan text-soft-cyan" : "text-muted border-muted"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[900px]">
        {/* Header */}
        <div className="mb-10">
          <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                <Award size={12} />
                Trust Ledger
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Provider <span className="text-primary">Performance</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Clinical feedback and reliability metrics for provider #{(sellerId || "").slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Scorecard */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Clinical Rating</p>
            <div className="text-3xl font-black text-primary mb-2">{Number(stats.averageRating || 0).toFixed(1)}</div>
            <div className="flex justify-center">{renderStars(Math.round(stats.averageRating || 0))}</div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Authenticated Handovers</p>
            <div className="text-3xl font-black text-foreground mb-1">{stats.totalReviews || 0}</div>
            <p className="text-[10px] text-emerald-green font-bold uppercase tracking-tighter">100% Verified</p>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Trust Score</p>
            <div className="text-3xl font-black text-soft-cyan mb-1">A+</div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Gold Tier Provider</p>
          </div>
        </div>

        {loading && reviews.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card rounded-2xl animate-pulse border border-border" />)}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No performance data"
            message="This provider hasn't received any clinical feedback yet in the network."
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="text-primary" size={18} />
              <h2 className="text-xs font-bold text-foreground uppercase tracking-[0.2em]">Verified Depositions</h2>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-card rounded-[1.5rem] p-8 border border-border shadow-sm group hover:border-primary/20 transition-all">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary font-bold shadow-inner">
                        {review.userId?.name?.charAt(0) || <User size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm flex items-center gap-2">
                          {review.userId?.name || "Verified Participant"}
                          <ShieldCheck size={14} className="text-emerald-green" />
                        </div>
                        <div className="flex items-center gap-3 pt-0.5">
                          {renderStars(review.rating)}
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium italic leading-relaxed pl-1">
                    "{review.comment || "The provider adhered to all clinical protocols during this asset redistribution."}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SellerReviewsPage;
