"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/wishlist-context";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Heart, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function WishlistPage() {
  const { items, loading, removeFromWishlist } = useWishlist();

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6 sm:mb-8">
          <Heart className="size-8" /> Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <p className="text-zinc-600 mb-4">Your wishlist is empty.</p>
            <Button asChild>
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => {
              const product = item.product;
              const id = product?._id ?? product?.id ?? "";
              return (
                <div
                  key={item._id}
                  className="flex gap-4 p-4 border rounded-xl bg-white"
                >
                  <Link href={`/products/${id}`} className="relative w-28 h-28 shrink-0 rounded overflow-hidden bg-zinc-100">
                    <Image
                      src={product?.imageCover ?? ""}
                      alt={product?.title ?? ""}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${id}`} className="font-medium hover:underline line-clamp-2">
                      {product?.title}
                    </Link>
                    <p className="text-zinc-600 mt-1">{product?.price} EGP</p>
                    <div className="mt-2 flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/products/${id}`}>View</Link>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(id)}
                        className="text-red-600"
                      >
                        <Trash2 className="size-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
