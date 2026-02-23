import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Clock, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import Button from './Button';
import TrustBadge from './TrustBadge';
import { useCart } from '../../context/CartContext';

/**
 * MedicineCard.jsx
 * A "Certificate of Authenticity" trust object.
 * Engineered for enterprise healthcare aesthetics.
 */
export default function MedicineCard({ medicine, onAddToCart, loading = false }) {
    const navigate = useNavigate();
    const {
        extractedData,
        image,
        images,
        price,
        adminVerified,
        riderVerified,
        category
    } = medicine;
    const { cartItems, updateQuantity, removeFromCart, addToCart: addItem } = useCart();

    // Find if this item is in cart
    const cartItem = cartItems.find(item => {
        const id = item?.medicineId?._id || item.medicineId || item._id;
        return String(id) === String(medicine._id);
    });
    const quantity = cartItem?.quantity || 0;
    const isInCart = quantity > 0;

    const medicineName = extractedData?.name || "Premium Medicine";
    const genericName = extractedData?.genericName || "Verified Composition";
    const expiryDate = extractedData?.expiryDate;

    // Expiry check logic
    const isExpiringSoon = expiryDate
        ? new Date(expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        : false;

    return (
        <article
            onClick={() => navigate(`/browse/${medicine._id}`)}
            className="group relative flex flex-col bg-card text-card-foreground border border-border rounded-xl shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden"
        >

            {/* 1. Image Block with Trust Overlays */}
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                    src={image || images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'}
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
                {isInCart ? (
                    <div
                        className="flex items-center justify-between bg-muted/50 rounded-xl p-1 border border-primary/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                if (quantity === 1) {
                                    removeFromCart(medicine._id);
                                } else {
                                    updateQuantity(medicine._id, quantity - 1);
                                }
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-card text-foreground-muted hover:text-red-500 hover:bg-red-500/5 transition-all shadow-sm border border-border"
                        >
                            {quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter leading-none">In Cart</span>
                            <span className="text-sm font-bold text-foreground">{quantity}</span>
                        </div>

                        <button
                            onClick={() => updateQuantity(medicine._id, quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-card text-primary hover:bg-primary/5 transition-all shadow-sm border border-border"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        className="w-full h-10 font-semibold"
                        onClick={(e) => {
                            e.stopPropagation();
                            addItem(medicine);
                        }}
                        loading={loading}
                        icon={ShoppingCart}
                    >
                        Add to Cart
                    </Button>
                )}
            </div>
        </article>
    );
}
