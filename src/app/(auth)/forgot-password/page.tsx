"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { forgotPasswordSchema, forgotPasswordSchemaType } from "@/lib/validationSchema/auth.schema";
import { forgotPassword as forgotPasswordApi } from "@/services/auth.services";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function handleForgotPassword(values: forgotPasswordSchemaType) {
    const response = await forgotPasswordApi(values);
    if (response?.message === "Success" || response?.message === "success" || response?.status === "success") {
      toast.success("Check your email for the reset code.");
      router.push("/reset-password?email=" + encodeURIComponent(values.email));
    } else {
      toast.error(response?.message || "Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-md px-4 sm:px-6 py-8 sm:py-10 mt-6 sm:mt-10">
        <h1 className="font-bold text-2xl sm:text-4xl">Forgot Password</h1>
        <p className="text-lg sm:text-xl font-medium mt-2">Enter your email to receive a reset code.</p>
        <form className="w-full mt-8 sm:mt-10 space-y-6 sm:space-y-8" onSubmit={form.handleSubmit(handleForgotPassword)}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="your@email.com"
                  type="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer">
            {form.formState.isSubmitting ? <Spinner /> : "Send reset code"}
          </Button>
        </form>
        <p className="mt-6">
          <Link href="/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </main>
  );
}
