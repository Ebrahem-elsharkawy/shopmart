"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/cart-context";
import { createOrder } from "@/services/orders.services";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CreditCard, Banknote } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, totalPrice, loading: cartLoading } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("cash");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading" || cartLoading) {
    return (
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10 flex justify-center">
        <Spinner />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="mb-4">Please log in to checkout.</p>
        <Button asChild><Link href="/login">Login</Link></Button>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="mb-4">Your cart is empty.</p>
        <Button asChild><Link href="/products">Browse products</Link></Button>
      </main>
    );
  }

  async function handlePlaceOrder() {
    const token = session?.token;
    if (!token) return;
    setSubmitting(true);
    try {
      const res = (await createOrder(token, {
        paymentMethod: paymentMethod === "online" ? "online" : "cash",
        shippingAddress: address || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any;
      if (res?.message === "Success" || res?.status === "success" || res?.data?.order) {
        toast.success("Order placed successfully.");
        router.push("/your-orders");
      } else {
        toast.error(res?.message || "Failed to place order.");
      }
    } catch {
      toast.error("Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Checkout</h1>
      <p className="text-zinc-600 mb-6">Total: <strong>{totalPrice} EGP</strong></p>

      <div className="space-y-4 mb-6">
        <Field>
          <FieldLabel>Payment method</FieldLabel>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="rounded"
              />
              <Banknote className="size-5" /> Cash
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
                className="rounded"
              />
              <CreditCard className="size-5" /> Online
            </label>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="address">Shipping address (optional)</FieldLabel>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address, city, phone"
          />
        </Field>
      </div>

      <Button
        className="w-full"
        onClick={handlePlaceOrder}
        disabled={submitting}
      >
        {submitting ? <Spinner /> : "Place order"}
      </Button>
      <p className="mt-4 text-center">
        <Link href="/cart" className="text-primary hover:underline">Back to cart</Link>
      </p>
    </main>
  );
}
