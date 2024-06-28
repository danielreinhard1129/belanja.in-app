"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

const useDeleteProduct = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteProduct = async (productId: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete(`/products/${productId}`);
      toast.success("Product deleted successfully!");
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error?.response?.data?.message || error?.response?.data;
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProduct, isLoading };
};

export default useDeleteProduct;
