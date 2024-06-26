"use client";

import useForgotPassword from "@/hooks/api/auth/useForgotPassword";
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
import { FC, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import BackToHome from "../BackToHome";
import { useRouter } from "next/navigation";
import AuthGuardSign from "@/hoc/AuthGuardSign";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const FormSchema = z.object({
  email: z.string({
    required_error: "email is required",
  }),
});

const ForgotPasswordForm: FC = () => {
  const { forgotPassword, isLoading } = useForgotPassword();
  const [imageLoading, setImageLoading] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (values: any) => {
    forgotPassword(values);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="container fixed bottom-0 left-0 right-0 top-0 flex h-screen flex-col px-0 py-0 md:flex-row md:items-center">
      <div className="relative z-10 -mb-10 h-full w-full overflow-hidden md:h-[85vh] md:rounded-3xl">
        {imageLoading && <Skeleton className="h-full w-full" />}
        <Image
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="bg-top"
          fill
          className="absolute object-cover"
          onLoadingComplete={handleImageLoad}
        />
      </div>
      <div className="shadow-t-xl z-50 flex h-fit w-full flex-col space-y-2 self-end rounded-t-3xl border-t-2 border-gray-100 bg-white px-4 py-4 pb-20 md:h-full md:justify-center md:self-center md:rounded-none md:border-none md:px-10 md:pb-0 md:shadow-none">
        <BackToHome />
        <h1 className="px-4 text-2xl font-semibold">Forgot password?</h1>
        <p className="px-4 pb-10 text-sm md:text-base">
          No worries, we'll send you an email for reset instruction
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col px-4"
          >
            <div className="space-y-4">
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
            <Button
              type="submit"
              className="my-6 w-full px-4 py-3"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Loading..." : "Forgot Password"}
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              className="my-4 w-fit self-center text-xs font-medium"
            >
              <ChevronLeft size={16} className="mr-2" />
              Back to login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthGuardSign(ForgotPasswordForm);
