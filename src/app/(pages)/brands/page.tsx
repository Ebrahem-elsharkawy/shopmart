import { BrandI } from "@/interface/brands";
import { getAllBrands } from "@/services/brands.services";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function BrandsPage() {
  const res = await getAllBrands();
  const brands: BrandI[] = res?.data ?? res ?? [];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Brands</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.isArray(brands) && brands.map((brand) => (
            <Link key={brand._id} href={`/brands/${brand._id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square w-full">
                  <Image
                    src={brand.image || "/placeholder.svg"}
                    alt={brand.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardContent className="p-0 font-semibold text-center">
                    {brand.name}
                  </CardContent>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
