import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load cart on mount or user change
    useEffect(() => {
        fetchCart();
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
                    await Promise.all(guestCart.map(item => api.post('/cart/add', { medicineId: item._id || item.medicineId, quantity: item.quantity })));
                    localStorage.removeItem('guestCart');
                } catch (err) {
                    console.error('Failed to sync guest cart', err);
                }
            }

            // User: Fetch from API
            try {
                const response = await api.get('/cart');
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
        if (user) {
            // User: API Call
            try {
                // Optimistic UI update
                const existingItem = cartItems.find(item => item.medicineId === medicine._id);
                if (existingItem) {
                    setCartItems(prev => prev.map(item =>
                        item.medicineId === medicine._id ? { ...item, quantity: item.quantity + quantityToAdd } : item
                    ));
                } else {
                    setCartItems(prev => [...prev, { ...medicine, medicineId: medicine._id, quantity: quantityToAdd }]);
                }

                await api.post('/cart/add', { medicineId: medicine._id, quantity: quantityToAdd });
                toast.success('Added to cart');
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
                localCart[existingItemIndex].quantity += quantityToAdd;
            } else {
                localCart.push({ ...medicine, _id: medicine._id, quantity: quantityToAdd });
            }

            localStorage.setItem('guestCart', JSON.stringify(localCart));
            setCartItems(localCart);
            toast.success('Added to cart');
        }
    };

    const removeFromCart = async (medicineId) => {
        if (user) {
            try {
                setCartItems(prev => prev.filter(item => {
                    const currentId = item?.medicineId?._id || item.medicineId || item._id;
                    return String(currentId) !== String(medicineId);
                }));
                await api.delete(`/cart/remove/${medicineId}`);
                toast.success('Removed from cart');
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
            toast.success('Removed from cart');
        }
    };

    const updateQuantity = async (medicineId, quantity) => {
        if (quantity < 1) return;

        if (user) {
            // Implement update API call if available, or remove/add logic
            // For now, simpler to just re-fetch or assume cart/add handles updates
            // await api.post('/cart/update', { medicineId, quantity });
        } else {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const itemIndex = localCart.findIndex(item => (item.id === medicineId || item._id === medicineId));
            if (itemIndex > -1) {
                localCart[itemIndex].quantity = quantity;
                localStorage.setItem('guestCart', JSON.stringify(localCart));
                setCartItems(localCart);
            }
        }
    }

    const clearCart = async () => {
        if (user) {
            try {
                await api.delete('/cart/clear');
                setCartItems([]);
            } catch (e) {
                console.error(e);
            }
        } else {
            localStorage.removeItem('guestCart');
            setCartItems([]);
        }
    }

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, loading }}>
            {children}
        </CartContext.Provider>
    );
};
