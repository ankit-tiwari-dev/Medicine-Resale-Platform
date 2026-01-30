import { useState } from 'react';
import { Trash2, AlertCircle, ArrowRight, Minus, Plus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal;

    const handleCheckout = async () => {
        if (!user) {
            toast('Please login to checkout', {
                icon: '🔒',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            navigate('/login', { state: { from: '/cart' } }); // Redirect to login with return path
            return;
        }

        setIsProcessing(true);
        try {
            // Create Order API call
            await api.post('/orders', { items: cartItems.map(i => ({ medicineId: i.id || i.medicineId, quantity: i.quantity })), shippingAddress: "123 Main St" });

            await clearCart();
            toast.success('Order placed successfully!');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            console.error(error);
            toast.error('Checkout failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Add medicines to your cart to see them here.</p>
                    <Link to="/marketplace" className="block w-full bg-[#32aeb1] text-white font-bold py-3 rounded-xl hover:bg-[#2a9396] transition-colors">
                        Browse Medicines
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-8 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Cart ({cartCount})</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 transition-all hover:shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                    <img
                                        src={item.image || "https://placehold.co/100?text=Rx"}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.medicineId || item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">Seller: {item.sellerName || 'Verified Seller'}</p>

                                    <div className="flex items-center justify-between">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#32aeb1] disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-bold text-gray-900 min-w-[1rem] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#32aeb1]"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <span className="font-bold text-gray-900 text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-24 shadow-sm">
                            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4">Payment Details</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>MRP Total</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Additional Discount</span>
                                    <span className="text-emerald-600 font-medium">- ₹0.00</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping Fee</span>
                                    <span className="text-emerald-600 font-medium">Free</span>
                                </div>
                                <div className="h-px bg-dashed bg-gray-200 my-2" />
                                <div className="flex justify-between font-bold text-gray-900 text-xl">
                                    <span>Total Amount</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg font-medium">
                                    Total Savings: ₹0.00 on this order
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full bg-[#32aeb1] hover:bg-[#2a9396] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-70"
                            >
                                {user ? (isProcessing ? 'Processing Order...' : 'Proceed to Checkout') : 'Login to Checkout'}
                                {!isProcessing && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
