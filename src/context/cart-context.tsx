/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CartItemI } from "@/interface/cart";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { getCart, addToCart as addToCartApi, updateCartItem, removeFromCart } from "@/services/cart.services";

export interface CartContextType {
  items: CartItemI[];
  loading: boolean;
  totalPrice: number;
  cartId: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItemI[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const fetchCart = useCallback(async () => {
    if (status !== "authenticated" || !session?.token) return;

    setLoading(true);
    try {
      const res: any = await getCart(session.token);
      // Check for success status or data presence (some APIs wrap in 'data', some don't)
      if (res?.status === "success" || res?.data || (res && res.products)) {
        const cartData = res.data || (res.products ? res : null);

        if (cartData) {
          setItems(cartData.products?.map((p: any) => ({
            _id: p._id,
            product: p.product,
            quantity: p.count || p.quantity,
            price: p.price
          })) || []);
          setCartId(cartData._id || null);
          setTotalPrice(cartData.totalCartPrice || 0);
        }
      }
    } catch (error: any) {
      // 401 is handled globally by apiCall/handleApiResponse
      if (error?.status !== 401) {
        console.error("🔴 Failed to fetch cart:", error);
        toast.error("Could not load your cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [status, session?.token]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    } else if (status === "unauthenticated") {
      setItems([]);
      setCartId(null);
      setTotalPrice(0);
    }
  }, [status, session?.token, fetchCart]);

  const addToCart = async (productId: string) => {
    if (status !== "authenticated" || !session?.token) {
      toast.error("Please login to add to cart");
      return;
    }
    setLoading(true);
    try {
      const res: any = await addToCartApi(productId, 1, session.token);
      if (res?.status === "success") {
        toast.success("Added to cart");
        await fetchCart();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const res: any = await updateCartItem(itemId, quantity, session.token);
      if (res?.status === "success") {
        await fetchCart();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const res: any = await removeFromCart(itemId, session.token);
      if (res?.status === "success") {
        toast.success("Item removed");
        await fetchCart();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        totalPrice,
        cartId,
        refreshCart: fetchCart,
        addToCart,
        updateQuantity,
        removeItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
