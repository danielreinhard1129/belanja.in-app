"use client";

import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useAxios from "../useAxios";

interface RegisterResponse {
  message: string;
  data: User;
}

interface RegisterArgs extends Pick<User, "email" | "name"> {}

const useRegister = () => {
  const { axiosInstance } = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const register = async (payload: RegisterArgs) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post<RegisterResponse>(
        "/auth/register",
        payload,
      );
      router.push("/register/thanks");
      toast.success(`${data.message}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.errors[0].msg);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { register, isLoading };
};

export default useRegister;
