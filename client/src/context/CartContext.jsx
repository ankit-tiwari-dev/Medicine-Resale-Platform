import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
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

    const fetchCart = async () => {
        setLoading(true);
        if (user) {
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

    const addToCart = async (medicine) => {
        if (user) {
            // User: API Call
            try {
                // Optimistic UI update
                const existingItem = cartItems.find(item => item.medicineId === medicine.id);
                if (existingItem) {
                    setCartItems(prev => prev.map(item =>
                        item.medicineId === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
                    ));
                } else {
                    setCartItems(prev => [...prev, { ...medicine, medicineId: medicine.id, quantity: 1 }]);
                }

                await api.post('/cart/add', { medicineId: medicine.id, quantity: 1 });
                toast.success('Added to cart');
                fetchCart(); // Sync to be safe
            } catch (error) {
                toast.error('Failed to add to cart');
                fetchCart(); // Revert on error
            }
        } else {
            // Guest: LocalStorage
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const existingItemIndex = localCart.findIndex(item => item.id === medicine.id);

            if (existingItemIndex >= 0) {
                localCart[existingItemIndex].quantity += 1;
            } else {
                localCart.push({ ...medicine, quantity: 1 });
            }

            localStorage.setItem('guestCart', JSON.stringify(localCart));
            setCartItems(localCart);
            toast.success('Added to cart');
        }
    };

    const removeFromCart = async (medicineId) => {
        if (user) {
            try {
                setCartItems(prev => prev.filter(item => item.medicineId !== medicineId && item.id !== medicineId));
                await api.delete(`/cart/remove/${medicineId}`);
                toast.success('Removed from cart');
            } catch (error) {
                toast.error('Failed to remove item');
                fetchCart();
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const updatedCart = localCart.filter(item => item.id !== medicineId);
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
            const itemIndex = localCart.findIndex(item => item.id === medicineId);
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
