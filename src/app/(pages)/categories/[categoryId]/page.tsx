import { CategoryI } from "@/interface/categories";
import { ProductI } from "@/interface/products";
import { getCategoryById } from "@/services/categories.services";
import { getAllProducts } from "@/services/products.services";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const catRes = await getCategoryById(categoryId);
  const category: CategoryI = catRes?.data ?? catRes;
  const { data: productsData } = await getAllProducts();
  const allProducts: ProductI[] = productsData ?? [];
  const products = allProducts.filter(
    (p) => p.category?._id === categoryId || p.category?.slug === category?.slug
  );

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold">{category?.name ?? "Category"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-zinc-100">
            <Image
              src={category?.image || "/placeholder.svg"}
              alt={category?.name ?? ""}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category?.name}</h1>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <Card key={prod._id}>
              <Link href={`/products/${prod._id}`}>
                <Image
                  width={300}
                  height={300}
                  src={prod.imageCover}
                  alt={prod.title}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <CardHeader>
                <CardDescription>{prod.brand?.name}</CardDescription>
                <Link href={`/products/${prod._id}`}>
                  <CardTitle className="line-clamp-1 hover:underline">{prod.title}</CardTitle>
                </Link>
                <CardDescription>{prod.category?.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-1">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    className={`size-5 ${
                      star < Math.round(prod.ratingsAverage ?? 0)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </CardContent>
              <CardFooter>
                <p>
                  Price: <strong>{prod.price}</strong> EGP
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
