"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormStoreProduct } from "@/types/storeProduct.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useCreateStockMutation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAppSelector((state) => state.user);
  const createStockMutation = async (
    data: IFormStoreProduct,
    storeId: number,
  ) => {
    setIsLoading(true);
    try {
      const payload = {
        storeId: data.storeId,
        fromStoreId: storeId,
        stocks: data.stocks,
      };

      await axiosInstance.post("/store-products/mutation", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        description: "Stock mutation created successfully!",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast({
          description: error?.response?.data,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { createStockMutation, isLoading };
};

export default useCreateStockMutation;
