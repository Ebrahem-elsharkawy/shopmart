"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { WishlistItemI } from "@/interface/wishlist";
import { ProductI } from "@/interface/products";

interface WishlistContextType {
  items: WishlistItemI[];
  loading: boolean;
  addToWishlist: (product: ProductI) => void;
  removeFromWishlist: (id: string) => Promise<void>;
  hasInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItemI[]>([]);
  const [loading, setLoading] = useState(false);

  const addToWishlist = (product: ProductI) => {
    const newItem: WishlistItemI = {
      _id: Math.random().toString(36).substring(2, 9),
      product: product
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeFromWishlist = async (id: string) => {
    setLoading(true);
    try {
      setItems(prev => prev.filter(item => (item.product?._id || item._id) !== id));
    } finally {
      setLoading(false);
    }
  };

  const hasInWishlist = (id: string) =>
    items.some(item => (item.product?._id || item._id) === id);

  return (
    <WishlistContext.Provider value={{ items, loading, addToWishlist, removeFromWishlist, hasInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
