"use client";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { loginAction, logoutAction } from "@/redux/slices/userSlice";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import useAxios from "../useAxios";

const useGoogleAuth = () => {
  const { axiosInstance } = useAxios();
  const dispatch = useAppDispatch();
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
        dispatch(loginAction(data.data));
        toast.success(data.message);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || "Login failed");
        } else {
          toast.error("Login failed due to an unexpected error");
        }
      } finally {
        setIsLoading(false);
      }
    },
    flow: "auth-code",
  });

  const logout = () => {
    googleLogout();
    localStorage.removeItem("Authorization");
    localStorage.removeItem("location");
    dispatch(logoutAction());
    router.push("/");
  };

  return { logout, handleLoginByGoogle, isLoading };
};

export default useGoogleAuth;
