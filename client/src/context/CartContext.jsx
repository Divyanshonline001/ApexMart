import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart based on authentication status
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      if (isAuthenticated && token) {
        try {
          const data = await cartAPI.getCart();
          setCartItems(data.items || []);
        } catch (error) {
          console.error('Error fetching cart from server:', error.message);
        }
      } else {
        // Load from local storage for guest users
        const localCart = localStorage.getItem('guest_cart');
        setCartItems(localCart ? JSON.parse(localCart) : []);
      }
      setLoading(false);
    };

    fetchCart();
  }, [isAuthenticated, token]);

  // Sync guest cart to server once user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && token) {
        const localCartStr = localStorage.getItem('guest_cart');
        if (localCartStr) {
          const localCart = JSON.parse(localCartStr);
          if (localCart.length > 0) {
            try {
              // Add all guest items to server cart
              for (const item of localCart) {
                await cartAPI.addToCart(item.product._id, item.quantity);
              }
              // Clear local guest cart and refetch populated server cart
              localStorage.removeItem('guest_cart');
              const data = await cartAPI.getCart();
              setCartItems(data.items || []);
            } catch (error) {
              console.error('Error syncing guest cart to server:', error);
            }
          }
        }
      }
    };

    syncCart();
  }, [isAuthenticated, token]);

  // Save guest cart to localStorage when it changes
  const saveGuestCart = (items) => {
    setCartItems(items);
    localStorage.setItem('guest_cart', JSON.stringify(items));
  };

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const data = await cartAPI.addToCart(product._id, quantity);
        setCartItems(data.items || []);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Error adding to cart' };
      }
    } else {
      // Guest logic
      const updatedItems = [...cartItems];
      const itemIndex = updatedItems.findIndex(item => item.product._id === product._id);

      if (itemIndex > -1) {
        updatedItems[itemIndex].quantity += Number(quantity);
      } else {
        updatedItems.push({ product, quantity: Number(quantity) });
      }
      saveGuestCart(updatedItems);
      return { success: true };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        const data = await cartAPI.updateCartItem(productId, quantity);
        setCartItems(data.items || []);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Error updating quantity' };
      }
    } else {
      // Guest logic
      let updatedItems = [...cartItems];
      const itemIndex = updatedItems.findIndex(item => item.product._id === productId);

      if (itemIndex > -1) {
        if (quantity <= 0) {
          updatedItems = updatedItems.filter(item => item.product._id !== productId);
        } else {
          updatedItems[itemIndex].quantity = quantity;
        }
        saveGuestCart(updatedItems);
      }
      return { success: true };
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const data = await cartAPI.removeCartItem(productId);
        setCartItems(data.items || []);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Error removing item' };
      }
    } else {
      // Guest logic
      const updatedItems = cartItems.filter(item => item.product._id !== productId);
      saveGuestCart(updatedItems);
      return { success: true };
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        setCartItems([]);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Error clearing cart' };
      }
    } else {
      saveGuestCart([]);
      return { success: true };
    }
  };

  // Helper getters
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((acc, item) => {
    const originalPrice = item.product.price;
    const discount = item.product.discount || 0;
    const discountedPrice = originalPrice * (1 - discount / 100);
    const finalPrice = Math.round(discountedPrice * 100) / 100;
    return acc + finalPrice * item.quantity;
  }, 0);

  const shippingCost = cartSubtotal > 1500 || cartSubtotal === 0 ? 0 : 150;
  const cartTotal = cartSubtotal + shippingCost;

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    shippingCost,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
