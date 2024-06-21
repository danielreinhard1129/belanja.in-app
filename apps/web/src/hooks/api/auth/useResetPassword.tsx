"use client";

import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IResetPasswordResponse {
  message: string;
}

interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

const useResetPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (password: string, token: string) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.patch<IResetPasswordResponse>(
        "/auth/reset-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(data.message);

      router.replace(`/login`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { resetPassword, isLoading };
};

export default useResetPassword;
