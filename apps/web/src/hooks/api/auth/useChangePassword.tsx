"use client";

import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useAxios from "../useAxios";

interface IChangePasswordResponse {
  message: string;
}

interface ChangePasswordForm {
  password: string;
}

const useChangePassword = (userId: number) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { axiosInstance } = useAxios();

  const changePassword = async (payload: ChangePasswordForm) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.patch<IChangePasswordResponse>(
        "/auth/change-password",
        payload,
      );

      toast.success(data.message);
      router.push(`/user/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { changePassword, isLoading };
};

export default useChangePassword;
