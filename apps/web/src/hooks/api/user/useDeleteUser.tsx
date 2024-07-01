import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteUser = async (userId: number) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser, isLoading };
};

export default useDeleteUser;
