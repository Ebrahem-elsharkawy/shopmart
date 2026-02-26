"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProductI } from "@/interface/products";

interface ProductCardActionsProps {
  product: ProductI; // نمرر المنتج كامل
  className?: string;
}

export const ProductCardActions = ({ product, className }: ProductCardActionsProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, hasInWishlist } = useWishlist();
  const { status } = useSession();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const inWishlist = hasInWishlist(product._id);

  const handleAddToCart = async () => {
    if (status === "loading") return;
    setIsAddingToCart(true);
    try {
      addToCart({
        _id: product._id,
        product,       // المنتج كامل
        quantity: 1,
        price: product.price,
      });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (status === "loading") return;
    setIsTogglingWishlist(true);
    try {
      if (!inWishlist) addToWishlist(product);
      else await removeFromWishlist(product._id);
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className || ""}`}>
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </button>

      <button
        onClick={handleToggleWishlist}
        disabled={isTogglingWishlist}
        className={`px-4 py-2 rounded ${inWishlist ? "bg-red-500 text-white" : "bg-gray-200"}`}
      >
        {isTogglingWishlist ? "Updating..." : inWishlist ? "♥ Remove" : "♡ Add"}
      </button>
    </div>
  );
};