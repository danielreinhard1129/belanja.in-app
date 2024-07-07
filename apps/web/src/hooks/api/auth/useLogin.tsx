"use client";

import { useAppDispatch } from "@/redux/hooks";
import { loginAction } from "@/redux/slices/userSlice";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useAxios from "../useAxios";

interface LoginResponses {
  message: string;
  data: User;
  token: string;
}

interface LoginArgs extends Pick<User, "email" | "password" | "role"> {}

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { axiosInstance } = useAxios();
  const login = async (payload: LoginArgs) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post<LoginResponses>(
        "/auth/login",
        payload,
      );

      dispatch(loginAction(data.data));
      localStorage.setItem("Authorization", `Bearer ${data.token}`);
      localStorage.setItem("token", `${data.token}`);
      if (data.data.role === "USER") {
        router.push("/");
      } else if (data.data.role === "SUPERADMIN") {
        router.push("/admin");
      }

      toast.success(`Welcome to belanjain ${data.data.name}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(`Error: ${error.response?.data}!`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading };
};

export default useLogin;
