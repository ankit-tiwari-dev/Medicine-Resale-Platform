import { BadgeCheck, Clock, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MedicineCard = ({ data }) => {
    const { addToCart } = useCart();
    const { name, price, expiryDate, verified, image, description, sellerName } = data;

    // Calculate generic status for demo purposes if not provided
    const isExpired = new Date(expiryDate) < new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(expiryDate).toLocaleDateString('en-US', options);

    return (
        <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full relative">
            {/* Category Label */}
            {data.category && (
                <span className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 uppercase tracking-wider">
                    {data.category}
                </span>
            )}

            {/* Image Container */}
            <div className="relative h-40 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img
                    src={image || "https://placehold.co/400x300?text=Medicine"}
                    alt={name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />

                {/* Verified Badge */}
                {verified && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-emerald-100">
                        <BadgeCheck className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Verified</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-base mb-1 group-hover:text-[#32aeb1] transition-colors line-clamp-1" title={name}>
                    {name}
                </h3>

                <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs text-gray-400">Sold by</span>
                    <span className="text-xs font-semibold text-gray-600 truncate max-w-[120px]">{sellerName || 'Pharmacy'}</span>
                </div>

                <div className={`flex items-center gap-1.5 mb-3 text-xs ${isExpired ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    <Clock className="w-3 h-3" />
                    <span>Expires: {formattedDate}</span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-gray-50">
                    <div>
                        <span className="text-[10px] text-gray-400 block mb-0.5">MRP</span>
                        <span className="text-base font-bold text-gray-900">₹{price}</span>
                    </div>

                    <button
                        onClick={() => addToCart(data)}
                        className="bg-[#32aeb1] hover:bg-[#2a9396] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all font-semibold text-xs shadow-md shadow-teal-500/20 active:scale-95"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicineCard;
