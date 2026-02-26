import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/services/products.services";
import { getAllBrands } from "@/services/brands.services";
import { getAllCategories } from "@/services/categories.services";
import { ProductI } from "@/interface/products";
import { BrandI } from "@/interface/brands";
import { CategoryI } from "@/interface/categories";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";

export default async function Home() {
  const [productsRes, brandsRes, categoriesRes] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
  ]);
  const products: ProductI[] = productsRes?.data ?? [];
  const brands: BrandI[] = brandsRes?.data ?? brandsRes ?? [];
  const categories: CategoryI[] = categoriesRes?.data ?? categoriesRes ?? [];
  const featured = Array.isArray(products) ? products.slice(0, 8) : [];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero */}
      <section className="bg-zinc-900 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to ShopMart
          </h1>
          <p className="mt-4 text-lg text-zinc-300 max-w-2xl mx-auto">
            Discover the best products, brands, and categories. Shop with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
              <Link href="/products">
                Shop products <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/categories">Browse categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto py-10 sm:py-16 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="size-7" /> Featured products
          </h2>
          <Button asChild variant="ghost">
            <Link href="/products">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((prod) => (
            <Link key={prod._id} href={`/products/${prod._id}`} className="group">
              <div className="rounded-xl border bg-white overflow-hidden transition shadow hover:shadow-lg">
                <div className="relative aspect-square">
                  <Image
                    src={prod.imageCover}
                    alt={prod.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium line-clamp-2">{prod.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < Math.round(prod.ratingsAverage ?? 0)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 font-bold text-zinc-900">{prod.price} EGP</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brands */}
      {Array.isArray(brands) && brands.length > 0 && (
        <section className="max-w-7xl mx-auto py-10 sm:py-16 px-4 sm:px-6 border-t">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Shop by brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {brands.slice(0, 10).map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="flex flex-col items-center p-4 rounded-lg border bg-white hover:shadow-md transition"
              >
                <div className="relative w-20 h-20">
                  <Image
                    src={brand.image || "/placeholder.svg"}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-center line-clamp-1">{brand.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link href="/brands">All brands</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Categories */}
      {Array.isArray(categories) && categories.length > 0 && (
        <section className="max-w-7xl mx-auto py-10 sm:py-16 px-4 sm:px-6 border-t">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat._id}`}
                className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition group"
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4 font-semibold text-center">{cat.name}</div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link href="/categories">All categories</Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-zinc-900 text-white py-12 sm:py-16 px-4 sm:px-6 mt-10 sm:mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold">Ready to shop?</h2>
          <p className="mt-2 text-zinc-300">Create an account or sign in to add items to cart and wishlist.</p>
          <div className="mt-6 flex gap-4 justify-center flex-wrap">
            <Button asChild className="bg-white text-zinc-900 hover:bg-zinc-100">
              <Link href="/register">Register</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
