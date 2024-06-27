"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormRequestStoreProduct } from "@/types/storeProduct.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useRequestStockMutation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.user);
  const requestStockMutation = async (
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

      await axiosInstance.post("/store-products/request-mutation", payload, {
        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${token}`,
        // },
      });
      toast.success("request has send to Super Admin");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { requestStockMutation, isLoading };
};

export default useRequestStockMutation;
