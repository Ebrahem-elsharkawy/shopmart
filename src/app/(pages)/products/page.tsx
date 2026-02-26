"use client";

import React, { useEffect, useState } from "react";
import { ProductI } from "@/interface/products";
import { getAllProducts } from "@/services/products.services";
import { ProductCardActions } from "@/components/product/product-card-actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center py-20">Loading products...</p>;
  if (error) return <p className="text-center py-20">{error}</p>;
  if (products.length === 0) return <p className="text-center py-20">No products found</p>;

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card key={product._id} className="flex flex-col">
              <Link href={`/products/${product._id}`}>
                <Image
                  width={300}
                  height={300}
                  src={product.imageCover || "/fallback-product.png"}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
              </Link>

              <CardHeader>
                <CardDescription>{product.brand?.name}</CardDescription>
                <Link href={`/products/${product._id}`}>
                  <CardTitle className="line-clamp-1 hover:underline">{product.title}</CardTitle>
                </Link>
                <CardDescription>{product.category?.name}</CardDescription>
              </CardHeader>

              <CardContent className="flex gap-1">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className={`size-5 ${
                      star < Math.round(product.ratingsAverage ?? 0)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </CardContent>

              <CardContent>
                <p>
                  Price: <strong>{product.price}</strong> EGP
                </p>
              </CardContent>

              <CardFooter>
                <ProductCardActions product={product} className="w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}