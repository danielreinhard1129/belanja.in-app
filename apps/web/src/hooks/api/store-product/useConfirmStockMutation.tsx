import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useConfirmStockMutation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const confirmMutation = async (journalId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/store-products/confirm/${journalId}`,
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

  return { confirmMutation, isLoading };
};

export default useConfirmStockMutation;
