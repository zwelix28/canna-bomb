import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showError('Please login to add items to cart', 'Authentication Required');
      return { success: false };
    }

    try {
      setLoading(true);
      const response = await api.post('/api/cart/add', 
        { productId, quantity }
      );
      
      setCart(response.data);
      showSuccess('Item added to cart successfully!', 'Added to Cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      showError(message, 'Add to Cart Failed');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false };

    try {
      setLoading(true);
      const response = await api.put(`/api/cart/update/${productId}`,
        { quantity }
      );
      
      setCart(response.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart item';
      showError(message, 'Update Failed');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false };

    try {
      setLoading(true);
      const response = await api.delete(`/api/cart/remove/${productId}`);
      
      setCart(response.data);
      showSuccess('Item removed from cart', 'Removed from Cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      showError(message, 'Remove Failed');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false };

    try {
      setLoading(true);
      await api.delete('/api/cart/clear');
      
      setCart({ items: [], total: 0, itemCount: 0 });
      showSuccess('Cart cleared successfully', 'Cart Cleared');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      showError(message, 'Clear Cart Failed');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const getCartSummary = async () => {
    if (!isAuthenticated) return null;

    try {
      const response = await api.get('/api/cart/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart summary:', error);
      return null;
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    fetchCart,
    itemCount: cart.itemCount,
    total: cart.total,
    items: cart.items
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
