"use client";

import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IChangePasswordResponse {
  message: string;
}

interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

const useChangePassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (password: string, token: string) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.patch<IChangePasswordResponse>(
        "/auth/change-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(data.message);
      const decode = jwtDecode<DecodedToken>(token);

      router.replace(`/user/${decode.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { changePassword, isLoading };
};

export default useChangePassword;
