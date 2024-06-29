"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { IFormDiscount } from "@/types/discount.type";

const useUpdateDiscount = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateDiscount = async (data: IFormDiscount, id: number) => {
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

      await axiosInstance.patch(`/discounts/${id}`, payload);
      toast.success("discount has been updated!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateDiscount, isLoading };
};

export default useUpdateDiscount;
