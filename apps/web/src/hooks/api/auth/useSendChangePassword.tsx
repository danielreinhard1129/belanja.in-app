"use client";

import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface ISendChangePasswordResponse {
  message: string;
}

interface SendChangePwArgs extends Pick<User, "id"> {}

const useSendChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  const sendChangePassword = async (userId: SendChangePwArgs) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post<ISendChangePasswordResponse>(
        "/auth/send-change-password",
        { user: userId },
      );
      toast.success(`${data.message}`);
      setOnSuccess(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
      setOnSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  return { sendChangePassword, isLoading, onSuccess };
};

export default useSendChangePassword;
