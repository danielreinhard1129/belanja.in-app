import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useResetPasswordStoreAdmin = () => {
  const [isReseting, setIsReseting] = useState<boolean>(false);

  const resetPasswordStoreAdmin = async (userId: number) => {
    try {
      setIsReseting(true);
      const response = await axiosInstance.post(
        `/store-admins/reset/${userId}`,
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsReseting(false);
    }
  };

  return { resetPasswordStoreAdmin, isReseting };
};

export default useResetPasswordStoreAdmin;
