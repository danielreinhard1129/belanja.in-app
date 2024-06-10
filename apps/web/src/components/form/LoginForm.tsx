"use client";

import useGoogleAuth from "@/hooks/api/auth/useGoogleAuth";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import useLogin from "@/hooks/api/auth/useLogin";

const FormSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Input the right email",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

const LoginForm = () => {
  const { logout, handleLoginSuccess } = useGoogleAuth();
  const { login } = useLogin();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (values: any) => {
    login(values);
  };

  return (
    <div className="flex flex-col space-y-2 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="mt-6 w-full px-4 py-2">
            Login
          </Button>
        </form>
      </Form>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      <Button onClick={() => logout()} className="px-4 py-2">
        Logout
      </Button>
    </div>
  );
};

export default LoginForm;
