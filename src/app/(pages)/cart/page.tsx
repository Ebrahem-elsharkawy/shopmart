"use client";

import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import CartComponent from "./cartComponents";

export default function CartPage() {
  return (
    <CartProvider>
      <WishlistProvider>
        <CartComponent />
      </WishlistProvider>
    </CartProvider>
  );
}