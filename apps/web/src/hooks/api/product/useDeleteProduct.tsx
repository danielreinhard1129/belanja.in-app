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
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProduct, isLoading };
};

export default useDeleteProduct;
