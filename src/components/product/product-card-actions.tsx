"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useSession } from "next-auth/react";
import { ProductI } from "@/interface/products";
import { Heart, ShoppingCart } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface ProductCardActionsProps {
  product: ProductI;
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
    if (status === "loading" || isAddingToCart) return;
    setIsAddingToCart(true);
    await addToCart(product._id);
    setIsAddingToCart(false);
  };

  const handleToggleWishlist = async () => {
    if (status === "loading" || isTogglingWishlist) return;
    setIsTogglingWishlist(true);
    if (!inWishlist) {
      await addToWishlist(product);
    } else {
      await removeFromWishlist(product._id);
    }
    setIsTogglingWishlist(false);
  };

  return (
    <div className={`flex gap-2 w-full ${className || ""}`}>
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-70 transition-colors"
      >
        {isAddingToCart ? (
          <Spinner className="size-4 text-white" />
        ) : (
          <>
            <ShoppingCart className="size-4" /> Add to Cart
          </>
        )}
      </button>

      <button
        onClick={handleToggleWishlist}
        disabled={isTogglingWishlist}
        className={`p-2 rounded-lg border transition-colors ${
          inWishlist
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        }`}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isTogglingWishlist ? (
          <Spinner className={`size-5 ${inWishlist ? "text-red-600" : "text-zinc-600"}`} />
        ) : (
          <Heart className={`size-5 ${inWishlist ? "fill-current" : ""}`} />
        )}
      </button>
    </div>
  );
};
