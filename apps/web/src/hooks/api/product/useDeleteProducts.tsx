import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useDeleteProducts = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteProducts = async (productId: number[]) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete("/products/delete", {
        data: { productId },
      });
      // router.refresh();
      return response.data.data;
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProducts, isLoading };
};

export default useDeleteProducts;
