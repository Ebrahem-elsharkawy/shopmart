"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { getOrders } from "@/services/orders.services";
import { OrderI } from "@/interface/order";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Package } from "lucide-react";

export default function YourOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (status === "authenticated" && session?.token) {
      getOrders(session.token)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
          if (!isMounted) return;
          const list = (res?.data ?? res) as OrderI[] | { orders?: OrderI[] };
          const arr = Array.isArray(list) ? list : list?.orders ?? [];
          setOrders(Array.isArray(arr) ? arr : []);
        })
        .catch(() => {
          if (isMounted) setOrders([]);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 0);
    }

    return () => {
      isMounted = false;
    };
  }, [session?.token, status]);

  if (status === "loading" || loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex justify-center">
        <Spinner />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="mb-4">Please log in to view your orders.</p>
        <Button asChild><Link href="/login">Login</Link></Button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-6 sm:mb-8">
        <Package className="size-7 sm:size-8" /> Your Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 border rounded-xl">
          <p className="text-zinc-600 mb-4">You have no orders yet.</p>
          <Button asChild>
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-6">
          {(Array.isArray(orders) ? orders : []).map((order) => (
            <li key={order._id} className="border rounded-xl p-6 bg-white">
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <span className="font-mono text-sm text-zinc-500">#{order._id.slice(-8)}</span>
                <span className="font-medium">{order.totalOrderPrice} EGP</span>
              </div>
              <p className="text-sm text-zinc-600 capitalize">Payment: {order.paymentMethod}</p>
              <p className="text-sm text-zinc-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(order.cartItems ?? []).map((oi: { product?: { _id?: string; title?: string; imageCover?: string }; quantity?: number }, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {oi.product?.imageCover && (
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-zinc-100">
                        <Image
                          src={oi.product.imageCover}
                          alt={oi.product.title ?? ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="line-clamp-1">{oi.product?.title} × {oi.quantity}</span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
