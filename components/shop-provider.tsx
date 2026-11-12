"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type CartLine = { productId: string; quantity: number };
type ShopContextValue = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    const safeQuantity = Math.min(99, Math.max(1, Math.floor(quantity)));
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (existing) {
        return current.map((line) => line.productId === productId
          ? { ...line, quantity: Math.min(99, line.quantity + safeQuantity) }
          : line);
      }
      return [...current, { productId, quantity: safeQuantity }];
    });
    setCartOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const safeQuantity = Math.min(99, Math.max(1, Math.floor(quantity) || 1));
    setCart((current) => current.map((line) => line.productId === productId ? { ...line, quantity: safeQuantity } : line));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }, []);

  const value = useMemo(() => ({
    cart,
    wishlist,
    cartOpen,
    cartCount: cart.reduce((total, line) => total + line.quantity, 0),
    addToCart,
    setQuantity,
    removeFromCart,
    toggleWishlist,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  }), [cart, wishlist, cartOpen, addToCart, setQuantity, removeFromCart, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider.");
  return context;
}

