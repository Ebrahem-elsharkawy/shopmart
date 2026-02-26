"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { changePasswordSchema, changePasswordSchemaType } from "@/lib/validationSchema/auth.schema";
import { changePassword as changePasswordApi } from "@/services/auth.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", reNewPassword: "" },
  });

  async function handleChangePassword(values: changePasswordSchemaType) {
    const token = session?.token;
    if (!token) {
      toast.error("You must be logged in to change password.");
      return;
    }
    const response = await changePasswordApi(values, token);
    if (response?.message === "Success" || response?.status === "success") {
      toast.success("Password changed. Please log in again.");
      router.push("/login");
    } else {
      toast.error(response?.message || "Failed to change password.");
    }
  }

  if (status === "loading") {
    return (
      <main className="container mx-auto max-w-md px-4 py-10 flex justify-center">
        <Spinner />
      </main>
    );
  }
  if (status === "unauthenticated") {
    return (
      <main className="container mx-auto max-w-md px-4 sm:px-6 py-8 sm:py-10 mt-6">
        <p>You must be logged in to change your password.</p>
        <Link href="/login" className="text-primary hover:underline">Go to login</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-md px-4 sm:px-6 py-8 sm:py-10 mt-6 sm:mt-10">
        <h1 className="font-bold text-2xl sm:text-4xl">Change Password</h1>
        <p className="text-lg sm:text-xl font-medium mt-2">Enter your current password and choose a new one.</p>
        <form className="w-full mt-8 sm:mt-10 space-y-6 sm:space-y-8" onSubmit={form.handleSubmit(handleChangePassword)}>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                <Input {...field} id={field.name} type="password" placeholder="Current password" />
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
          <Controller
            name="reNewPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
                <Input {...field} id={field.name} type="password" placeholder="Repeat new password" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer">
            {form.formState.isSubmitting ? <Spinner /> : "Change password"}
          </Button>
        </form>
        <p className="mt-6">
          <Link href="/" className="text-primary hover:underline">Back to home</Link>
        </p>
      </div>
    </main>
  );
}
