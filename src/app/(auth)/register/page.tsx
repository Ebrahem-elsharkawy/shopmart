"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { registerSchema, registerSchemaType } from "@/lib/validationSchema/auth.schema";
import { signUpUser } from "@/services/auth.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Register() {
  const router=useRouter()
  const form = useForm({
    resolver:zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },

  });
  async function handleRegister(values:registerSchemaType) {
      const response=await signUpUser(values)
      if(response.message==="Success" || response.message==="success"){
        toast.success("Signup successfully")
        router.push("/login")
      }else {
        toast.error(response.message)
      }
      
    }
  return (
    <>
      <main className="min-h-screen">
        <div className="container mx-auto max-w-md sm:max-w-lg px-4 sm:px-6 py-8 sm:py-10 mt-6 sm:mt-10">
          <h1 className="font-bold text-2xl sm:text-4xl">Welcome to ShopMart 🛒</h1>
          <p className="text-lg sm:text-xl font-medium mt-1">Register Now</p>
          <form className="w-full mx-auto mt-8 sm:mt-10 space-y-6 sm:space-y-8" onSubmit={form.handleSubmit(handleRegister)}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    type="text"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
                    placeholder=""
                    autoComplete="off"
                    type="email"
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
                    placeholder=""
                    autoComplete="off"
                    type="password"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="rePassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>RePassword</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    type="password"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Mobile Number</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    type="tel"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button className="w-full cursor-pointer">
              {form.formState.isSubmitting ? <Spinner/> : "Register "}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
