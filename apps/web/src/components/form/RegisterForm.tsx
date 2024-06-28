"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import useRegister from "@/hooks/api/auth/useRegister";
import Image from "next/image";
import BackToHome from "../BackToHome";
import { Separator } from "../ui/separator";
import useGoogleAuth from "@/hooks/api/auth/useGoogleAuth";
import { useRouter } from "next/navigation";
import googleLogo from "../../../public/6929234_google_logo_icon.svg";
import { Loader2 } from "lucide-react";
import AuthGuardSign from "@/hoc/AuthGuardSign";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
    })
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  email: z.string({
    required_error: "email is required",
  }),
});

const RegisterForm = () => {
  const { handleLoginByGoogle } = useGoogleAuth();
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { register, isLoading } = useRegister();

  const onSubmit = (values: any) => {
    register(values);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="container fixed bottom-0 left-0 right-0 top-0 flex h-screen flex-col px-0 py-0 md:flex-row md:items-center">
      <div className="relative z-10 -mb-10 h-full w-full overflow-hidden md:h-[85vh] md:rounded-3xl">
        {imageLoading && <Skeleton className="h-full w-full" />}
        <Image
          src="https://images.unsplash.com/photo-1619617257069-3dc8f124c512?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="bg-top"
          fill
          className="absolute object-cover"
          onLoadingComplete={handleImageLoad}
        />
      </div>
      <div className="shadow-t-xl z-50 flex h-fit w-full flex-col space-y-2 self-end rounded-t-3xl border-t-2 border-gray-100 bg-white px-4 py-4 pb-20 md:h-full md:justify-center md:self-center md:rounded-none md:border-none md:px-10 md:pb-0 md:shadow-none">
        <BackToHome />
        <h1 className="px-4 text-2xl font-semibold">Create an account</h1>
        <p className="px-4 pb-10 text-sm md:text-base">
          <span
            className="cursor-pointer font-medium underline underline-offset-4"
            onClick={() => router.push("/login")}
          >
            Log in
          </span>{" "}
          or create an account to get started using Belanja.in
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col px-4"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <a
              href="/forgot-password"
              className="my-3 mt-6 w-fit self-end text-xs font-medium hover:underline"
            >
              Forgot password?
            </a>
            <Button
              type="submit"
              className="my-3 w-full px-4 py-3"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Loading..." : "Register"}
            </Button>
            <div className="relative my-3 flex w-full items-center justify-center">
              <Separator className="absolute" />
              <div className="z-10 bg-white px-4 text-xs text-black/55">or</div>
            </div>
            <Button
              onClick={() => handleLoginByGoogle()}
              variant="secondary"
              className="my-3 w-full gap-4 py-3 text-sm font-medium text-black"
            >
              <Image
                src={googleLogo}
                alt="google logo"
                height={16}
                width={16}
              />
              Register with Google
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthGuardSign(RegisterForm);
