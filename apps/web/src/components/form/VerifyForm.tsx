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
import { notFound, useSearchParams } from "next/navigation";
import useVerify from "@/hooks/api/auth/useVerify";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  password: z.string({
    required_error: "email is required",
  }),
});

const VerifyForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    notFound();
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  const { isLoading, verify } = useVerify();

  const onSubmit = (password: any) => {
    verify(password, token);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="px-4 py-2 w-full text-white"
          disabled={isLoading}
        >
          {isLoading ?? <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Verifying" : "Complete Registration"}
        </Button>
      </form>
    </Form>
  );
};

export default VerifyForm;
