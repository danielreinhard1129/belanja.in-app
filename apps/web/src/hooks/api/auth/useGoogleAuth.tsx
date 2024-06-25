"use client";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginAction, logoutAction } from "@/redux/slices/userSlice";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";

const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginByGoogle = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.post("/auth/login/google", {
          code,
        });

        localStorage.setItem("Authorization", `Bearer ${data.token}`);
        dispatch(loginAction({ user: data.data, token: data.token }));
        toast.success(data.message);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data);
        }
      } finally {
        setIsLoading(false);
      }
    },
    flow: "auth-code",
    redirect_uri: "http://localhost:3000/",
  });

  const logout = () => {
    googleLogout();
    localStorage.removeItem("Authorization");
    dispatch(logoutAction());
    router.push("/");
  };

  return { logout, handleLoginByGoogle, isLoading };
};

export default useGoogleAuth;
