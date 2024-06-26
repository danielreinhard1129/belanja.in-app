import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import axios, { AxiosError } from "axios";
import { useState } from "react";

const useConfirmStockMutation = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.user);

  const confirmMutation = async (journalId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `/store-products/confirm/${journalId}`,
        {}, // Empty body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast({
        description: "Mutation successfully!",
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          description: error?.response?.data?.message || error?.response?.data,
        });
        // console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { confirmMutation, isLoading };
};

export default useConfirmStockMutation;
