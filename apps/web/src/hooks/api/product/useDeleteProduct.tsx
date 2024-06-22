import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useDeleteProduct = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.user);

  const deleteProduct = async (productId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(`/products/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        description: "Product deleted successfully!",
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

  return { deleteProduct, isLoading };
};

export default useDeleteProduct;
