import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { useAppSelector } from "@/redux/hooks";
import { AxiosError } from "axios";
import { useState } from "react";

const useRejectStockMutation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { token } = useAppSelector((state) => state.user);

  const rejectMutation = async (journalId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/store-products/reject/${journalId}`,
      );
      toast.success("Mutation rejected!");
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { rejectMutation, isLoading };
};

export default useRejectStockMutation;
