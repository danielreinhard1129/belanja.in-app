import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

const useRejectStockMutation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const rejectMutation = async (journalId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/store-products/reject/${journalId}`,
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

  return { rejectMutation, isLoading };
};

export default useRejectStockMutation;
