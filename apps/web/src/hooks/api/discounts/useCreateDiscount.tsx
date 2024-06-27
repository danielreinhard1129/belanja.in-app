"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { IFormDiscount } from "@/types/discount.type";

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
        minPurchase: data.minPurchase,
        productId: data.productId,
      };

      await axiosInstance.post("/discounts", payload);
      toast.success("Store created successfully!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { createDiscount, isLoading };
};

export default useCreateDiscount;
