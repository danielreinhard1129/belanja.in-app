"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useVerify from "@/hooks/api/auth/useVerify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BackToHome from "../BackToHome";
import { Skeleton } from "../ui/skeleton";

const FormSchema = z
  .object({
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof FormSchema>;

const VerifyForm = () => {
  const [imageLoading, setImageLoading] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  if (!token) {
    notFound();
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isLoading, verify } = useVerify();

  const onSubmit = (data: FormData) => {
    verify(data.password, token);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="container fixed bottom-0 left-0 right-0 top-0 flex h-screen flex-col px-0 py-0 md:flex-row md:items-center">
      <div className="relative z-10 -mb-10 h-full w-full overflow-hidden md:h-[85vh] md:rounded-3xl">
        {imageLoading && <Skeleton className="h-full w-full" />}
        <Image
          src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="bg-top"
          fill
          className="absolute object-cover"
          onLoadingComplete={handleImageLoad}
        />
      </div>
      <div className="z-50 flex h-fit w-full flex-col space-y-2 self-end rounded-t-3xl border-t-2 border-gray-100 bg-white px-4 py-4 pb-20 shadow-t-xl md:h-full md:justify-center md:self-center md:rounded-none md:border-none md:px-10 md:pb-0 md:shadow-none">
        <BackToHome />
        <h1 className="px-4 text-2xl font-semibold">Welcome!</h1>
        <p className="px-4 pb-10 text-sm md:text-base">
          <span
            className="cursor-pointer font-medium underline underline-offset-4"
            onClick={() => router.push("/register")}
          >
            Create a free account
          </span>{" "}
          or log in to get started using Belanja.in
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col px-4"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="mt-16 w-full px-4 py-3 md:mt-8"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Verifying" : "Complete Registration"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyForm;
