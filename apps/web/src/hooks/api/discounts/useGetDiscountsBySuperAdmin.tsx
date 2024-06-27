"use client";

import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { Discount } from "@/types/discount.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetDiscountsQuery {
  storeId?: string | undefined;
}

const useGetDiscountsBySuperAdmin = (queries: IGetDiscountsQuery) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const { token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getDiscountsBySuperAdmin = async () => {
    try {
      const { data } = await axiosInstance.get("/discounts/super-admin", {
        params: queries,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDiscounts(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error);
      }
      setDiscounts([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDiscountsBySuperAdmin();
  }, [queries?.storeId]);

  return { discounts, isLoading, refetch: getDiscountsBySuperAdmin };
};

export default useGetDiscountsBySuperAdmin;
