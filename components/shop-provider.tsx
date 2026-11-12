"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { WHATSAPP_PHONE } from "@/lib/whatsapp";

type ShopContextValue = {
  wishlist: string[];
  whatsappNumber: string;
  toggleWishlist: (productId: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children, whatsappNumber = WHATSAPP_PHONE }: { children: ReactNode; whatsappNumber?: string }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }, []);
  const value = useMemo(() => ({ wishlist, whatsappNumber, toggleWishlist }), [wishlist, whatsappNumber, toggleWishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider.");
  return context;
}
