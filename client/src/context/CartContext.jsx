import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as cartApi from '../api/cartApi';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const debounceTimers = useRef({});

    // Load cart on mount or user change
    useEffect(() => {
        fetchCart();
        // Cleanup timers on unmount or user change
        return () => {
            Object.values(debounceTimers.current).forEach(clearTimeout);
            debounceTimers.current = {};
        };
    }, [user]);

    // Cross-tab synchronization for guest cart
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'guestCart' && !user) {
                const newCart = JSON.parse(e.newValue || '[]');
                setCartItems(newCart);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        if (user) {
            // Sync guest cart to user account upon login
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            if (guestCart.length > 0) {
                try {
                    await Promise.all(guestCart.map(item => cartApi.addToCart({ medicineId: item._id || item.medicineId, quantity: item.quantity })));
                    localStorage.removeItem('guestCart');
                } catch (err) {
                    console.error('Failed to sync guest cart', err);
                }
            }

            // User: Fetch from API
            try {
                const response = await cartApi.getCart();
                setCartItems(response.data.data?.items || []);
            } catch (error) {
                console.error('Failed to fetch user cart', error);
            }
        } else {
            // Guest: Fetch from LocalStorage
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            setCartItems(localCart);
        }
        setLoading(false);
    };

    const addToCart = async (medicine, quantityToAdd = 1) => {
        const qty = Number(quantityToAdd);
        if (user) {
            // Self-Purchase Prevention Check
            const sellerId = medicine.sellerId?._id || medicine.sellerId;
            if (String(sellerId) === String(user._id)) {
                toast.error('Protocol Violation: You cannot purchase your own clinical listing.');
                return;
            }

            // User: API Call
            try {
                // Optimistic UI update
                const existingItem = cartItems.find(item => {
                    const id = item?.medicineId?._id || item.medicineId || item._id;
                    return String(id) === String(medicine._id);
                });

                if (existingItem) {
                    setCartItems(prev => prev.map(item => {
                        const currentId = item?.medicineId?._id || item.medicineId || item._id;
                        return String(currentId) === String(medicine._id)
                            ? { ...item, quantity: Number(item.quantity) + qty }
                            : item;
                    }));
                } else {
                    setCartItems(prev => [...prev, { ...medicine, medicineId: medicine._id, quantity: qty }]);
                }

                await cartApi.addToCart({ medicineId: medicine._id, quantity: qty });
                fetchCart(); // Sync to be safe
            } catch (error) {
                toast.error('Failed to add to cart');
                fetchCart(); // Revert on error
            }
        } else {
            // Guest: LocalStorage
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const existingItemIndex = localCart.findIndex(item => (item.id === medicine._id || item._id === medicine._id));

            if (existingItemIndex >= 0) {
                localCart[existingItemIndex].quantity = Number(localCart[existingItemIndex].quantity) + qty;
            } else {
                localCart.push({ ...medicine, _id: medicine._id, quantity: qty });
            }

            localStorage.setItem('guestCart', JSON.stringify(localCart));
            setCartItems(localCart);
        }
    };

    const removeFromCart = async (medicineId) => {
        if (user) {
            try {
                setCartItems(prev => prev.filter(item => {
                    const currentId = item?.medicineId?._id || item.medicineId || item._id;
                    return String(currentId) !== String(medicineId);
                }));
                await cartApi.removeFromCart(medicineId);
            } catch (error) {
                toast.error('Failed to remove item');
                fetchCart();
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const updatedCart = localCart.filter(item => {
                const currentId = item?.medicineId?._id || item.medicineId || item._id || item.id;
                return String(currentId) !== String(medicineId);
            });
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        }
    };

    const updateQuantity = async (medicineId, quantity) => {
        const newQty = Number(quantity);
        if (newQty < 1) return;

        // 1. Optimistic UI update (Instant)
        setCartItems(prev => prev.map(item => {
            const currentId = item?.medicineId?._id || item.medicineId || item._id;
            return String(currentId) === String(medicineId) ? { ...item, quantity: newQty } : item;
        }));

        if (user) {
            // 2. Debounced API Update (Prevents 429 Rate Limiting)
            if (debounceTimers.current[medicineId]) {
                clearTimeout(debounceTimers.current[medicineId]);
            }

            debounceTimers.current[medicineId] = setTimeout(async () => {
                try {
                    await cartApi.updateCartItemQuantity({ medicineId, quantity: newQty });
                    delete debounceTimers.current[medicineId];
                } catch (error) {
                    toast.error('Failed to sync quantity with server');
                    fetchCart(); // Revert to server state on error
                }
            }, 500); // 500ms delay
        } else {
            // Guest: Instant LocalStorage
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const itemIndex = localCart.findIndex(item => (item.id === medicineId || item._id === medicineId));
            if (itemIndex > -1) {
                localCart[itemIndex].quantity = newQty;
                localStorage.setItem('guestCart', JSON.stringify(localCart));
            }
        }
    }

    const clearCart = async () => {
        if (user) {
            try {
                await cartApi.clearCart();
                setCartItems([]);
            } catch (e) {
                console.error(e);
            }
        } else {
            localStorage.removeItem('guestCart');
            setCartItems([]);
        }
    }

    const cartCount = cartItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, loading }}>
            {children}
        </CartContext.Provider>
    );
};
