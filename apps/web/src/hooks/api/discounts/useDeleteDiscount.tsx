import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

const useDeleteDiscount = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteDiscount = async (discountId: number) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/discounts/${discountId}`);
      toast.success("Discount deleted successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteDiscount, isLoading };
};

export default useDeleteDiscount;
