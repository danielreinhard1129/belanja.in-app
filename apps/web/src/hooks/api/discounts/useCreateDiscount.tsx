"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { IFormDiscount } from "@/types/discount.type";

const useCreateDiscount = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("Authorization")?.split(" ")[1];
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
      };

      await axiosInstance.post("/discounts", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
