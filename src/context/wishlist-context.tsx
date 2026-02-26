"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

interface WishlistContextType {
  items: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  hasInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<string[]>([]);

  const addToWishlist = (id: string) => {
    setItems(prev => [...prev, id]);
    toast.success("Added to wishlist");
  };

  const removeFromWishlist = (id: string) => {
    setItems(prev => prev.filter(item => item !== id));
    toast.success("Removed from wishlist");
  };

  const hasInWishlist = (id: string) => items.includes(id);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, hasInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};