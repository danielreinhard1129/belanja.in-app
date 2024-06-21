import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";

interface IForgotPasswordResponse {
  message: string;
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

      console.log(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { forgotPassword, isLoading };
};

export default useForgotPassword;
