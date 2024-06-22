import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useDeleteProducts = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.user);

  const deleteProducts = async (productId: number[]) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete("/products/delete", {
        data: { productId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        description: "Products deleted successfully!",
      });
      // router.refresh();
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

  return { deleteProducts, isLoading };
};

export default useDeleteProducts;
