import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface IForgotPasswordResponse {
  message: string;
  email: string;
}

const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post<IForgotPasswordResponse>(
        "/auth/forgot-password",
        email,
      );
      toast.success(`Email successfully sent to ${data.email}!`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(`Error: ${error.response?.data}!`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { forgotPassword, isLoading };
};

export default useForgotPassword;
