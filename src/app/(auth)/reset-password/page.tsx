"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { resetPasswordSchema, resetPasswordSchemaType } from "@/lib/validationSchema/auth.schema";
import { resetPassword as resetPasswordApi } from "@/services/auth.services";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, newPassword: "", resetCode: "" },
  });

  if (email) form.setValue("email", email);

  async function handleResetPassword(values: resetPasswordSchemaType) {
    const response = await resetPasswordApi(values);
    if (response?.message === "Success" || response?.status === "success") {
      toast.success("Password updated. You can log in now.");
      router.push("/login");
    } else {
      toast.error(response?.message || "Invalid or expired code.");
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-md px-4 sm:px-6 py-8 sm:py-10 mt-6 sm:mt-10">
        <h1 className="font-bold text-2xl sm:text-4xl">Reset Password</h1>
        <p className="text-lg sm:text-xl font-medium mt-2">Enter the code from your email and your new password.</p>
        <form className="w-full mt-8 sm:mt-10 space-y-6 sm:space-y-8" onSubmit={form.handleSubmit(handleResetPassword)}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input {...field} id={field.name} placeholder="your@email.com" type="email" readOnly />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="resetCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Reset code</FieldLabel>
                <Input {...field} id={field.name} placeholder="Enter code from email" autoComplete="one-time-code" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                <Input {...field} id={field.name} type="password" placeholder="At least 6 characters" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer">
            {form.formState.isSubmitting ? <Spinner /> : "Reset password"}
          </Button>
        </form>
        <p className="mt-6">
          <Link href="/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </main>
  );
}
