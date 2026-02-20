import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getMedicineReviews } from "../../api/reviewApi";
import Container from "../../components/layout/Container";
import { useApiQuery } from "../../hooks/useApiQuery";
import {
  Star,
  ShieldCheck,
  User,
  ChevronLeft,
  FlaskConical,
  MessageSquare,
  History,
  FileText,
  ArrowRight
} from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

const MedicineReviewsPage = () => {
  const { medicineId } = useParams();
  const fetcher = useCallback(() => (medicineId === "all" ? Promise.resolve({ data: [] }) : getMedicineReviews(medicineId)), [medicineId]);
  const { data, loading, error } = useApiQuery(fetcher, true);
  const reviews = data || [];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= rating ? "fill-primary text-primary" : "text-muted border-muted"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[900px]">
        {/* Header */}
        <div className="mb-10 lg:text-center">
          <Link to={medicineId === "all" ? "/browse" : `/browse/${medicineId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Unit Details
          </Link>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">
              <FlaskConical size={14} />
              Efficacy Audits
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Medicine <span className="text-primary">Efficacy Logs</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium lg:max-w-md lg:mx-auto">
              Authenticated feedback on unit integrity and redistribution success for lot #{(medicineId || "").slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {loading && reviews.length === 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-card rounded-[2rem] animate-pulse border border-border" />)}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No efficacy data mapped"
            message="This medicine unit hasn't been audited by clinical participants yet."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary font-bold">
                        {review.userId?.name?.charAt(0) || <User size={18} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified User</p>
                        <p className="font-bold text-sm text-foreground">{review.userId?.name || "Participant"}</p>
                      </div>
                    </div>
                    <ShieldCheck className="text-emerald-green" size={20} />
                  </div>
                  <div className="mb-6">{renderStars(review.rating)}</div>
                  <p className="text-sm text-muted-foreground font-medium italic leading-relaxed mb-6">
                    "{review.comment || "Unit packaging and expiration details were exactly as specified in the forensic report."}"
                  </p>
                </div>
                <div className="mt-4 pt-6 border-t border-border border-dashed flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <History size={12} />
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                  <Link to={`/browse/${medicineId}`} className="text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Inspect Unit <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default MedicineReviewsPage;
