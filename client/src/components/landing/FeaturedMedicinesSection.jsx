import MedicineCard from "../common/MedicineCard";
import LandingSectionTitle from "./LandingSectionTitle";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import Button from "../common/Button";

const SkeletonCard = () => (
  <div className="h-96 animate-pulse rounded-xl border border-border bg-muted/50" />
);

const FeaturedMedicinesSection = ({ medicines, loading, error }) => {
  return (
    <section className="py-12 lg:py-20">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <LandingSectionTitle
          eyebrow="Verified Pharmacy"
          title={<span>Verified <span className="text-emerald-green">Listings</span></span>}
          subtitle="Curated medicines that have passed all stages of our AI and human verification protocol."
        />
        <Link to="/browse" className="hidden md:block">
          <Button variant="primary" size="lg" className="gap-2">
            Browse Catalog
            <TrendingUp className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-xl border border-soft-red/20 bg-soft-red/5 p-8 text-center">
          <p className="text-soft-red font-medium">{error}</p>
        </div>
      ) : null}

      {!loading && !error && medicines.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
          <p className="text-muted-foreground font-medium">No verified medicines available right now.</p>
        </div>
      ) : null}

      {!loading && !error && medicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine._id} medicine={medicine} onAddToCart={() => { }} />
          ))}
        </div>
      ) : null}

      <div className="mt-12 text-center md:hidden">
        <Link to="/browse">
          <Button variant="primary" size="lg" className="w-full">
            Browse Full Catalog
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedMedicinesSection;
