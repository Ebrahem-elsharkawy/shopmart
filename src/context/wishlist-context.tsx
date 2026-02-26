/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { WishlistItemI } from "@/interface/wishlist";
import { ProductI } from "@/interface/products";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getWishlist, addToWishlist as addToWishlistApi, removeFromWishlist as removeFromWishlistApi } from "@/services/wishlist.services";

interface WishlistContextType {
  items: WishlistItemI[];
  loading: boolean;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (product: ProductI) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  hasInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItemI[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const fetchWishlist = useCallback(async () => {
    if (status !== "authenticated" || !session?.token) return;
    setLoading(true);
    try {
      const res: any = await getWishlist(session.token);
      if (res?.status === "success" || Array.isArray(res?.data) || Array.isArray(res)) {
        const wishlistData = res.data || (Array.isArray(res) ? res : []);
        // Normalize wishlist items
        setItems(wishlistData.map((p: any) => ({
          _id: p._id,
          product: p
        })));
      }
    } catch (error: any) {
      // 401 is handled globally
      if (error?.status !== 401) {
        console.error("🔴 Failed to fetch wishlist:", error);
        toast.error("Could not load your wishlist.");
      }
    } finally {
      setLoading(false);
    }
  }, [status, session?.token]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchWishlist();
    } else if (status === "unauthenticated") {
      setItems([]);
    }
  }, [status, session?.token, fetchWishlist]);

  const addToWishlist = async (product: ProductI) => {
    if (status !== "authenticated" || !session?.token) {
      toast.error("Please login to manage wishlist");
      return;
    }
    setLoading(true);
    try {
      const res: any = await addToWishlistApi(product._id, session.token);
      if (res?.status === "success") {
        toast.success("Added to wishlist");
        await fetchWishlist();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add to wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (status !== "authenticated" || !session?.token) return;
    setLoading(true);
    try {
      const res: any = await removeFromWishlistApi(productId, session.token);
      if (res?.status === "success") {
        toast.success("Removed from wishlist");
        await fetchWishlist();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove from wishlist");
    } finally {
      setLoading(false);
    }
  };

  const hasInWishlist = (productId: string) =>
    items.some(item => (item.product?._id || item._id) === productId);

  return (
    <WishlistContext.Provider value={{ items, loading, refreshWishlist: fetchWishlist, addToWishlist, removeFromWishlist, hasInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
