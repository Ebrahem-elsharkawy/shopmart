"use client";
import { CartItemI } from "@/interface/cart";
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartContextType {
  items: CartItemI[];
  loading: boolean;
  totalPrice: number;
  addToCart: (item: CartItemI) => void;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItemI[]>([]);
  const [loading, setLoading] = useState(false);

  // حساب السعر الكلي
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // إضافة منتج للكارت
  const addToCart = (item: CartItemI) => {
    setItems(prev => {
      const exist = prev.find(i => i._id === item._id);
      if (exist) {
        // إذا موجود، نزيد الكمية
        return prev.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      // إذا مش موجود، نضيفه جديد
      return [...prev, item];
    });
    toast.success("Item added to cart");
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setLoading(true);
    try {
      setItems(prev =>
        prev.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        )
      );
      toast.success("Cart updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      setItems(prev => prev.filter(item => item._id !== itemId));
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ items, loading, totalPrice, addToCart, updateQuantity, removeItem }}
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