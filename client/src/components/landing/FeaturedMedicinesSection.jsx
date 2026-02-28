import MedicineCard from "../common/MedicineCard";
import { Link } from "react-router-dom";
import Button from "../common/Button";


const SkeletonCard = () => (
  <div className="h-[430px] rounded-2xl border border-white/5 bg-slate-100/50" />
);

const FeaturedMedicinesSection = ({ medicines, loading, error }) => {
  return (
    <section className="py-24 bg-background">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 px-6">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground uppercase">
            Curated <br />
            <span className="text-secondary-foreground/20">Inventory</span>
          </h2>
          <div className="h-1.5 w-20 bg-foreground" />
        </div>

        <Link to="/browse" className="group">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-muted-foreground transition-colors">
            View Full Catalog
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>

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
        <div className="mx-6 p-12 text-center border border-foreground/10 rounded-3xl">
          <p className="text-foreground font-black uppercase tracking-tighter text-xl mb-2">Sync Error</p>
          <p className="text-muted-foreground font-medium">{error}</p>
        </div>
      ) : null}

      {!loading && !error && medicines.length === 0 ? (
        <div className="mx-6 p-20 text-center border border-foreground/10 rounded-3xl">
          <p className="text-foreground font-black uppercase tracking-tighter text-xl mb-2">Inventory Empty</p>
          <p className="text-muted-foreground font-medium">Currently no verified items match the landing protocol.</p>
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
