"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema, loginSchemaType } from "@/lib/validationSchema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/products";

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleLogin(values: loginSchemaType) {
    try {
      console.log(" Login attempt:", values.email);
      
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log(" SignIn result:", result);

      if (result?.error) {
        console.error(" Login error:", result.error);
        toast.error(result.error);
        return;
      }
      
      if (result?.ok) {
        console.log(" Login successful");
        toast.success("Logged in successfully");
        
        // Direct redirect without delay or session update
        router.push(callbackUrl);  
        return;
      }

      toast.error("Login failed. Please try again.");
    } catch (error) {
      console.error(" Login exception:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="container mx-auto max-w-md sm:max-w-lg px-4 sm:px-6 py-8 sm:py-10 mt-6 sm:mt-10">
      <h1 className="font-bold text-2xl sm:text-4xl">
        Welcome to ShopMart 🛒
      </h1>
      <p className="text-lg sm:text-xl font-medium mt-1">Login Now</p>

      <form
        className="w-full mx-auto mt-8 sm:mt-10 space-y-6 sm:space-y-8"
        noValidate
      >
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
                type="email"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="password"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button
          type="button"
          className="w-full cursor-pointer"
          onClick={form.handleSubmit(handleLogin)}
        >
          {form.formState.isSubmitting ? <Spinner /> : "Login"}
        </Button>

        <p className="text-center mt-4">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
