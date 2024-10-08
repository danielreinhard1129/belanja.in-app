import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useDeleteProducts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteProducts = async (productId: number[]) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete("/products/records", {
        data: { productId },
      });
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProducts, isLoading };
};

export default useDeleteProducts;
