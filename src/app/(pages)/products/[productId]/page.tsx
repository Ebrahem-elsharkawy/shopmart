"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductI } from "@/interface/products";
import { getSpecificProduct } from "@/services/products.services";
import { ProductCardActions } from "@/components/product/product-card-actions";
import Image from "next/image";
import { Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function ProductDetailsPage() {
  const params = useParams();

  // Extract productId safely - it can be string | string[] | undefined
  const productId = Array.isArray(params?.productId) 
    ? params.productId[0] 
    : params?.productId;

  const [product, setProduct] = useState<ProductI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await getSpecificProduct(productId!);
        setProduct(data);
      } catch (err) {
        const error = err as { message?: string };
        setError(error.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-lg">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products" className="text-lg">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-lg font-bold">Product Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card key={product._id} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* صور المنتج */}
          <div className="lg:col-span-1">
            <Carousel>
              <CarouselContent>
                {product.images?.map((img) => (
                  <CarouselItem key={img}>
                    <div className="w-full h-100 relative">
                      <Image fill src={img} alt={product.title} className="object-contain" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* معلومات المنتج */}
          <div className="lg:col-span-2 flex flex-col justify-center items-start space-y-8">
            <CardHeader>
              <CardDescription>{product.brand?.name}</CardDescription>
              <CardTitle className="line-clamp-1 hover:underline">{product.title}</CardTitle>
              <CardDescription>{product.category?.name}</CardDescription>
              <CardDescription>{product.description}</CardDescription>
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
              {/* نمرر المنتج كامل لـ ProductCardActions */}
              <ProductCardActions product={product} className="w-full" />
            </CardFooter>
          </div>
        </Card>
      </div>
    </main>
  );
}