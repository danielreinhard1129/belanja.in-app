import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

const useUpdateIsActiveStoreProduct = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateIsActiveStoreProduct = async (
    isActive: boolean,
    storeProductId: number,
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        isActive,
      };
      const response = await axiosInstance.post(
        `/store-products/${storeProductId}`,
        payload,
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { updateIsActiveStoreProduct, isLoading };
};

export default useUpdateIsActiveStoreProduct;
