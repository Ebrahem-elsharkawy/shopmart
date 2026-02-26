"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductI } from "@/interface/products";
import { getAllProducts } from "@/services/products.services";
import { ProductCardActions } from "@/components/product/product-card-actions";
import { Spinner } from "@/components/ui/spinner";

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

function ProductsList() {
  const [products, setProducts] = useState<ProductI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data } = await getAllProducts();
        let filtered = data || [];
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter((p: ProductI) =>
            p.title.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.category?.name.toLowerCase().includes(s) ||
            p.brand?.name.toLowerCase().includes(s)
          );
        }
        setProducts(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Spinner />
    </div>
  );

  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  if (products.length === 0) return (
    <div className="text-center py-20">
      <p className="text-xl font-medium text-zinc-500">No products found {search && `for "${search}"`}</p>
      <Link href="/products" className="text-primary hover:underline mt-2 inline-block">View all products</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {search && (
        <h1 className="text-2xl font-bold mb-8">Search results for "{search}"</h1>
      )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(Array.isArray(products) ? products : []).map((product: ProductI) => (
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
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      }>
        <ProductsList />
      </Suspense>
    </main>
  );
}