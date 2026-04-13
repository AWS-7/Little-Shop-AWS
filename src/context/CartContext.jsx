import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Sync wishlist from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    const fetchWishlist = async () => {
      const { data } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);
      setWishlist(data?.map(d => d.product_id) || []);
    };
    fetchWishlist();
  }, [user]);

  const addToCart = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  }, [removeFromCart]);

  const toggleCart = useCallback(() => setIsOpen(p => !p), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const toggleWishlist = useCallback(async (productId) => {
    if (!user) {
      // Local-only wishlist for guests
      setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
      return;
    }
    
    const isInList = wishlist.includes(productId);
    // Optimistic update
    setWishlist(prev => isInList ? prev.filter(id => id !== productId) : [...prev, productId]);
    
    if (isInList) {
      const { error } = await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
      if (error) {
        setWishlist(prev => [...prev, productId]);
        toast.error('Failed to update wishlist');
      }
    } else {
      const { error } = await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
      if (error) {
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.error('Failed to update wishlist');
      }
    }
  }, [user, wishlist]);

  const isInWishlist = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, wishlist, addToCart, removeFromCart, updateQuantity, toggleCart, closeCart, toggleWishlist, isInWishlist, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
