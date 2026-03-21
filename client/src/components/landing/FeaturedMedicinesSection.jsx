import MedicineCard from "../common/MedicineCard";
import { Link } from "react-router-dom";
import Button from "../common/Button";


const SkeletonCard = () => (
  <div className="h-[430px] rounded-xl border border-white/5 bg-slate-100/50" />
);

const FeaturedMedicinesSection = ({ medicines, loading, error }) => {
  return (
    <section className="py-24 bg-background">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 px-6">
        <div className="space-y-3">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground uppercase font-serif">
            Curated <br />
            <span className="text-primary font-serif">Inventory</span>
          </h2>
          <div className="h-1 w-16 bg-primary/20" />
        </div>

        <Link to="/browse" className="group">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            View Full Catalog
            <span className="group-hover:translate-x-1 transition-transform text-lg">&rarr;</span>

          </div>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mx-6 p-10 text-center border border-border rounded-xl bg-card">
          <p className="text-foreground font-bold uppercase tracking-widest text-lg mb-2">Sync Error</p>
          <p className="text-sm text-muted-foreground font-medium">{error}</p>
        </div>
      ) : null}

      {!loading && !error && medicines.length === 0 ? (
        <div className="mx-6 p-16 text-center border border-border rounded-xl bg-card">
          <p className="text-foreground font-bold uppercase tracking-widest text-lg mb-2">Inventory Empty</p>
          <p className="text-sm text-muted-foreground font-medium italic opacity-70">Currently no verified items match the landing protocol.</p>
        </div>
      ) : null}

      {!loading && !error && medicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {medicines.map((medicine) => (
            <div key={medicine._id}>
              <MedicineCard medicine={medicine} onAddToCart={() => { }} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default FeaturedMedicinesSection;
