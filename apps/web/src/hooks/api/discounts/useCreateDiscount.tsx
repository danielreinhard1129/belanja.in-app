"use client";

import { axiosInstance } from "@/libs/axios";
import { IFormDiscount } from "@/types/discount.type";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useCreateDiscount = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createDiscount = async (data: IFormDiscount) => {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        desc: data.desc,
        discountType: data.discountType,
        discountvalue: data.discountvalue,
        discountLimit: data.discountLimit,
        minPurchase: data.minPurchase,
        productId: Number(data.productId),
        storeId: Number(data.storeId),
      };

      const response = await axiosInstance.post("/discounts", payload);
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
  return { createDiscount, isLoading };
};

export default useCreateDiscount;
