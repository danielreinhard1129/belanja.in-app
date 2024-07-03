"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { IFormRequestStoreProduct } from "@/types/storeProduct.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useCreateStockSuperAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createStockSuperAdmin = async (
    data: IFormRequestStoreProduct,
    storeId: number,
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        storeId: data.storeId,
        fromStoreId: storeId,
        stocks: data.stocks,
        type: data.type,
      };

      const response = await axiosInstance.post(
        "/store-products/super-admin",
        payload,
      );
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw error.response?.data;
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { createStockSuperAdmin, isLoading };
};

export default useCreateStockSuperAdmin;
