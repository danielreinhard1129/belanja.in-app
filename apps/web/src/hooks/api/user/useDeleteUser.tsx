import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import useAxios from "../useAxios";

const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { axiosInstance } = useAxios();

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
