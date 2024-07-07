"use client";
import { Discount } from "@/types/discount.type";
import React, { useEffect, useState } from "react";
import useAxios from "../useAxios";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useGetDiscountsByUser = (payload: {
  storeId?: number;
  productIds: number[];
}) => {
  const { axiosInstance } = useAxios();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getDiscountsByUser = async () => {
    try {
      const { data } = await axiosInstance.get("/discounts/user", {
        params: payload,
      });

      setDiscounts(data);
    } catch (error) {
      if (error instanceof AxiosError) {
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (discounts.length === 0) {
      getDiscountsByUser();
    }
  }, [payload]);
  return { discounts, isLoading, setDiscounts,refetch: getDiscountsByUser };
};

export default useGetDiscountsByUser;
