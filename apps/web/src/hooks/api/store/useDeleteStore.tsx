import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useDeleteStore = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteStore = async (storeId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(`/stores/${storeId}`);
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteStore, isLoading };
};

export default useDeleteStore;
