"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { AxiosError } from "axios";
import { useState } from "react";

const useDeleteProduct = () => {
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
      toast.success("Product deleted successfully!");
      return response.data.data;
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
