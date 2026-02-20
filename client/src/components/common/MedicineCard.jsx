import React from 'react';
import { Shield, CheckCircle, Clock, ShoppingCart } from 'lucide-react';
import Button from './Button';
import TrustBadge from './TrustBadge';

/**
 * MedicineCard.jsx
 * A "Certificate of Authenticity" trust object.
 * Engineered for enterprise healthcare aesthetics.
 */
export default function MedicineCard({ medicine, onAddToCart, loading = false }) {
    const {
        extractedData,
        images,
        price,
        adminVerified,
        riderVerified,
        category
    } = medicine;

    const medicineName = extractedData?.name || "Premium Medicine";
    const genericName = extractedData?.genericName || "Verified Composition";
    const expiryDate = extractedData?.expiryDate;

    // Expiry check logic
    const isExpiringSoon = expiryDate
        ? new Date(expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        : false;

    return (
        <article className="group relative flex flex-col bg-card text-card-foreground border border-border rounded-xl shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">

            {/* 1. Image Block with Trust Overlays */}
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                    src={images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'}
                    alt={medicineName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Verification Status Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 font-sans">
                    {adminVerified && (
                        <div className="px-2 py-1 rounded-md bg-emerald-green text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                            <CheckCircle size={10} /> AI Verified
                        </div>
                    )}
                    {riderVerified && (
                        <div className="px-2 py-1 rounded-md bg-soft-cyan text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                            <Shield size={10} /> Rider Certified
                        </div>
                    )}
                </div>

                {/* Expiry Warning Strip */}
                {isExpiringSoon && (
                    <div className="absolute bottom-0 inset-x-0 bg-soft-red/90 text-white py-1.5 px-3 text-[10px] font-bold flex items-center justify-center gap-1.5 backdrop-blur-sm">
                        <Clock size={12} /> EXPIRING SOON
                    </div>
                )}
            </div>

            {/* 2. Body: Scientific Information */}
            <div className="flex-1 p-5 flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-sans">
                        {category || 'Pharma Listing'}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground leading-tight line-clamp-1">
                    {medicineName}
                </h3>
                <p className="text-sm text-muted-foreground italic line-clamp-1 mb-2 font-sans">
                    {genericName}
                </p>

                {/* 3. Trust Strip (Price & Verification) */}
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight font-sans">Price per unit</span>
                        <span className="text-xl font-bold text-primary">₹{Number(price).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-1.5" title="Secured by Escrow">
                        <div className="p-2 bg-emerald-green/10 rounded-full">
                            <Shield size={16} className="text-emerald-green" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Action Row */}
            <div className="px-5 pb-5">
                <Button
                    variant="primary"
                    className="w-full h-10 font-semibold"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(medicine);
                    }}
                    loading={loading}
                    icon={ShoppingCart}
                >
                    Add to Cart
                </Button>
            </div>
        </article>
    );
}
