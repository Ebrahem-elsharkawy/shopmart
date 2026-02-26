import { CategoryI } from "@/interface/categories";
import { getAllCategories } from "@/services/categories.services";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function CategoriesPage() {
  const res = await getAllCategories();
  const categories: CategoryI[] = res?.data ?? res ?? [];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.isArray(categories) && categories.map((cat) => (
            <Link key={cat._id} href={`/categories/${cat._id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square w-full">
                  <Image
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <CardContent className="p-4 font-semibold text-center">
                  {cat.name}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
