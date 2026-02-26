"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

const FALLBACK_IMAGE = "/fallback-product.png";

export default function CartComponent() {
  const { items, loading, totalPrice, updateQuantity, removeItem } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6 sm:mb-8">
          <ShoppingCart className="size-8" /> Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <p className="text-zinc-600 mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {(Array.isArray(items) ? items : []).map((item) => {
                const productId = item.product._id;
                const imageSrc = item.product.imageCover || FALLBACK_IMAGE;

                return (
                  <li key={productId} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-white">
                    <Link
                      href={`/products/${productId}`}
                      className="relative w-full sm:w-24 h-24 shrink-0 rounded overflow-hidden bg-zinc-100"
                    >
                      <Image src={imageSrc} alt={item.product.title} fill className="object-cover" />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${productId}`} className="font-medium hover:underline line-clamp-2">
                        {item.product.title}
                      </Link>
                      <p className="text-zinc-600 mt-1">
                        {item.price} EGP × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="font-semibold shrink-0">
                      {item.price * item.quantity} EGP
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-6">
              <p className="text-xl font-bold">Total: {totalPrice} EGP</p>
              <Button asChild>
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}