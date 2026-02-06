import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingBag, AlertCircle, Clock } from 'lucide-react';
import { addToCart } from '../services/api';
import toast from 'react-hot-toast';

const MedicineCard = ({ medicine }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        setAdding(true);
        try {
            await addToCart(medicine._id, 1);
            toast.success('Added to Cart');
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    // Check expiry (simple check)
    const expiryDate = medicine.extractedData?.expiryDate;
    const isExpiringSoon = expiryDate ? new Date(expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : false;

    return (
        <motion.div
            className="glass-card rounded-2xl overflow-hidden relative group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <motion.img
                    src={medicine.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'}
                    alt={medicine.extractedData?.name || 'Medicine'}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Verification Badge - Glowing Gold/Teal */}
                {medicine.adminVerified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)] z-10 backdrop-blur-md border border-white/20">
                        <CheckCircle size={14} strokeWidth={2.5} className="text-white" />
                        <span className="font-sans text-xs font-bold tracking-wide uppercase">AI Verified</span>
                    </div>
                )}

                {/* Expiry Warning Overlay */}
                {isExpiringSoon && (
                    <div className="absolute bottom-0 left-0 right-0 bg-amber-500/90 text-white text-[10px] font-bold px-3 py-1 flex items-center gap-2 justify-center backdrop-blur-sm">
                        <Clock size={12} /> Expiring Soon
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 relative">
                <div className="mb-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{medicine.category || 'Medicine'}</p>
                    <h3 className="font-serif text-xl font-bold text-slate-800 leading-tight mb-1 line-clamp-1">
                        {medicine.extractedData?.name || 'Unknown Medicine'}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1">
                        {medicine.description || 'Verified Seller'}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">Price per unit</span>
                        <span className="font-sans text-2xl font-bold text-medical-primary">
                            ${Number(medicine.price).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Hover Action: Add to Cart */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute inset-x-5 bottom-5"
                        >
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-medical-primary text-white rounded-xl font-bold shadow-lg hover:bg-emerald-800 transition-colors"
                            >
                                {adding ? (
                                    <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                ) : (
                                    <>
                                        <ShoppingBag size={18} /> Add to Cart
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default MedicineCard;
